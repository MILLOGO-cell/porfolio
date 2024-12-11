"use client";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-300 rounded-full animate-spin"></div>
        <span className="sr-only">Chargement...</span>
      </div>
      <p className="mt-4 text-lg font-semibold">Chargement en cours...</p>
    </div>
  );
}
