import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <h1 className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
        404
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Cette page n&apos;existe pas.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
