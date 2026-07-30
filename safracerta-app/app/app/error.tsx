"use client";

export default function ErroApp({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-red-200 p-10 text-center max-w-lg mx-auto mt-10">
      <p className="text-3xl mb-3">⚠️</p>
      <h2 className="text-lg font-semibold text-red-700 mb-2">
        Algo deu errado ao carregar esta página
      </h2>
      <p className="text-sm text-gray-500 mb-1">
        {error.message}
      </p>
      {error.digest && (
        <p className="text-xs text-gray-400 mb-4">Código: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="rounded-lg bg-green-600 text-white text-sm font-medium px-4 py-2 hover:bg-green-700"
      >
        Tentar novamente
      </button>
    </div>
  );
}
