"use client";

import { useState } from "react";

interface ApiKeyModalProps {
  onSave: (apiKey: string) => void;
  currentKey: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiKeyModal({
  onSave,
  currentKey,
  isOpen,
  onClose,
}: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState(currentKey || "");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSave(apiKey.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-2">Configurar API Key</h2>
        <p className="text-gray-600 text-sm mb-4">
          Necesitas una API key de Anthropic para usar esta app. Tu key se
          guarda solo en tu navegador.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
            autoFocus
          />

          <div className="flex gap-3">
            {currentKey && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={!apiKey.trim()}
              className="flex-1 py-3 px-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Guardar
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Obtén tu API key en{" "}
          <a
            href="https://console.anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
          >
            console.anthropic.com
          </a>
        </p>
      </div>
    </div>
  );
}
