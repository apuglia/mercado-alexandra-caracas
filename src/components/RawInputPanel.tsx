"use client";

import { MergeMode } from "@/types";

interface RawInputPanelProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  onClear: () => void;
  isLoading: boolean;
  mergeMode: MergeMode;
  onMergeModeChange: (mode: MergeMode) => void;
  hasApiKey: boolean;
  onConfigureApiKey: () => void;
}

export default function RawInputPanel({
  value,
  onChange,
  onGenerate,
  onClear,
  isLoading,
  mergeMode,
  onMergeModeChange,
  hasApiKey,
  onConfigureApiKey,
}: RawInputPanelProps) {
  const handleClear = () => {
    if (confirm("¿Borrar todo?")) {
      onClear();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-800">Lista de compras</h2>
        <button
          onClick={onConfigureApiKey}
          className="text-xs text-gray-500 hover:text-green-600 transition-colors"
        >
          {hasApiKey ? "⚙️ API Key" : "🔑 Configurar API"}
        </button>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="pollo 2kg, arroz, yogurt x4, huevos, tomate 🍅, leche..."
        className="w-full h-40 px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 placeholder:text-gray-400"
      />

      <p className="text-xs text-gray-400 mt-2 mb-4">
        💡 Pega desde WhatsApp o escribe como quieras
      </p>

      {/* Merge mode toggle */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <span className="text-gray-600">Al regenerar:</span>
        <button
          onClick={() => onMergeModeChange("replace")}
          className={`px-3 py-1 rounded-full transition-colors ${
            mergeMode === "replace"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Reemplazar
        </button>
        <button
          onClick={() => onMergeModeChange("merge")}
          className={`px-3 py-1 rounded-full transition-colors ${
            mergeMode === "merge"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Fusionar
        </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onGenerate}
          disabled={isLoading || !value.trim() || !hasApiKey}
          className="flex-1 py-3 px-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⏳</span>
              Procesando...
            </>
          ) : (
            <>✨ Generar lista</>
          )}
        </button>
        <button
          onClick={handleClear}
          className="py-3 px-4 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
