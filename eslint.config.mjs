/**
 * Configuration ESLint au format plat.
 *
 * Trois choses étaient cassées en même temps, et `npm run lint` échouait sur un
 * message trompeur — « Invalid project directory provided, no such directory:
 * lint » :
 *
 *   - `next lint` a été retiré de Next 16, qui interprète donc « lint » comme un
 *     nom de dossier. On appelle désormais `eslint` directement ;
 *   - `eslint-config-next` était figé en 0.2.4, un paquet des tout débuts sans
 *     rapport avec Next 16, qui ne fournissait ni `core-web-vitals` ni
 *     `typescript` ;
 *   - ESLint 10 était installé alors que `.eslintrc.json` n'y est plus lu, et
 *     surtout `eslint-plugin-react`, embarqué par la configuration de Next,
 *     appelle encore `context.getFilename()`, retiré dans cette version. ESLint
 *     est donc revenu en 9, la majeure que `eslint-config-next` déclare
 *     réellement prendre en charge, et la configuration passe au format plat.
 */
import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const configuration = [
  {
    // Artéfacts de construction et code généré : rien à y corriger, et Prisma
    // produit des fichiers volumineux qui feraient exploser la durée d'analyse.
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'src/generated/**',
      'public/**',
      'docs/**',
      'next-env.d.ts',
    ],
  },
  ...coreWebVitals,
  ...typescript,
];

export default configuration;
