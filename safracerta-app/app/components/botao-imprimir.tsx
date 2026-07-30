"use client";

export function BotaoImprimir() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="no-print rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2 hover:bg-blue-700 fixed top-4 right-4 z-50"
      title="Imprimir ou salvar como PDF"
    >
      🖨️ Imprimir / Salvar PDF
    </button>
  );
}
