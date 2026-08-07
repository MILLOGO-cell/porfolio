/**
 * Configuration Next.
 *
 * En `.mjs` et non en `.ts` : au demarrage, Next doit lire ce fichier, et une
 * configuration TypeScript l'oblige a disposer du paquet `typescript`. Dans une
 * image d'execution allegee il est absent, et Next tentait alors de l'installer
 * lui-meme au lancement du conteneur — 379 paquets telecharges avant de servir
 * la premiere requete, en production.
 *
 * L'annotation JSDoc ci-dessous conserve l'autocompletion et la verification de
 * types dans l'editeur, sans rien exiger a l'execution.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  turbopack: {},
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'tailwindui.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    config.externals.push({
      canvas: 'commonjs canvas',
    });
    return config;
  },
};

export default nextConfig;
