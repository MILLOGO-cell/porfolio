import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/db';
import { verifyTwoFactorCode } from '@/lib/two-factor';
import { rateLimit, resetRateLimit } from '@/lib/rate-limit';

const hasGithubCredentials = Boolean(
  process.env.GITHUB_ID && process.env.GITHUB_SECRET
);

export const authOptions: NextAuthOptions = {
  providers: [
    ...(hasGithubCredentials
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        code: { label: 'Code 2FA', type: 'text' },
      },
      async authorize(credentials) {
        // NOTE : il n'y a volontairement PLUS de raccourci
        // `credentials.password === process.env.ADMIN_PASSWORD`. Il comparait
        // un mot de passe en clair, sans hachage, sans limitation de débit et
        // sans second facteur — toute personne ayant accès aux variables
        // d'environnement du déploiement obtenait l'administration. Pour
        // (re)créer un compte, utiliser `npm run seed:admin`.
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const email = credentials.email.toLowerCase().trim();

        // Anti-force brute : 8 tentatives par compte et par tranche de 15 min.
        const limitKey = `login:${email}`;
        if (!rateLimit(limitKey, 8, 15 * 60 * 1000).allowed) {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user?.password) {
          return null;
        }

        const isValidPassword = await compare(credentials.password, user.password);
        if (!isValidPassword) {
          return null;
        }

        // Le second facteur est vérifié ICI, dans le même appel que le mot de
        // passe. Une route de vérification séparée serait contournable par un
        // POST direct sur /api/auth/callback/credentials.
        const isValidSecondFactor = await verifyTwoFactorCode(
          user,
          credentials.code
        );
        if (!isValidSecondFactor) {
          return null;
        }

        resetRateLimit(limitKey);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60,
  },

  pages: {
    signIn: '/protected_access/login',
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'github') {
        return true;
      }

      // GitHub ne crée JAMAIS de compte : sans cette règle, n'importe quel
      // compte GitHub obtenait un accès administrateur.
      if (!user.email) return false;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { id: true, twoFactorEnabled: true },
      });

      if (!existingUser) return false;

      // Le 2FA de l'application ne peut pas être appliqué dans un aller-retour
      // OAuth : si le compte l'a activé, on impose le chemin email + mot de passe.
      if (existingUser.twoFactorEnabled) return false;

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        return token;
      }

      // Sur les requêtes suivantes le JWT n'est pas relu en base : on résout
      // l'id à partir de l'email pour les connexions OAuth.
      if (!token.id && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true },
        });
        if (dbUser) token.id = dbUser.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
