"use client";

import { useState, useCallback } from "react";
import { useAppState } from "@/hooks/useAppState";
import RawInputPanel from "@/components/RawInputPanel";
import OutputPanel from "@/components/OutputPanel";
import ActionBar from "@/components/ActionBar";
import ApiKeyModal from "@/components/ApiKeyModal";
import Toast from "@/components/Toast";

export default function Home() {
  const {
    state,
    isLoading,
    error,
    isHydrated,
    setRawInput,
    setMergeMode,
    setApiKey,
    updateItem,
    deleteItem,
    generateList,
    clearAll,
    setError,
  } = useAppState();

  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Show API key modal if not configured
  const needsApiKey = isHydrated && !state.apiKey;

  const handleCopied = useCallback(() => {
    setToast({ message: "Copiado. Pégalo en WhatsApp ✅", type: "success" });
  }, []);

  const handleCloseToast = useCallback(() => {
    setToast(null);
  }, []);

  // Show error as toast
  if (error && !toast) {
    setToast({ message: error, type: "error" });
    setError(null);
  }

  // Show loading skeleton during hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto">
          <h1 className="text-lg font-semibold text-gray-800">
            🛒 Mercado Alexandra
          </h1>
          <p className="text-xs text-gray-400">
            Lista de compras inteligente
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-lg mx-auto p-4 space-y-4">
        <RawInputPanel
          value={state.rawInput}
          onChange={setRawInput}
          onGenerate={generateList}
          onClear={clearAll}
          isLoading={isLoading}
          mergeMode={state.mergeMode}
          onMergeModeChange={setMergeMode}
          hasApiKey={!!state.apiKey}
          onConfigureApiKey={() => setShowApiKeyModal(true)}
        />

        <OutputPanel
          items={state.items}
          onUpdateItem={updateItem}
          onDeleteItem={deleteItem}
        />
      </main>

      {/* Action bar */}
      <ActionBar items={state.items} onCopied={handleCopied} />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={needsApiKey || showApiKeyModal}
        currentKey={state.apiKey}
        onSave={setApiKey}
        onClose={() => setShowApiKeyModal(false)}
      />

      {/* Toast */}
      <Toast
        message={toast?.message || ""}
        isVisible={!!toast}
        onClose={handleCloseToast}
        type={toast?.type}
      />
    </div>
  );
}
