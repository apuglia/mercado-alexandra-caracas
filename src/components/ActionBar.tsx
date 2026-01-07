"use client";

import { Item } from "@/types";
import { formatForWhatsApp, copyToClipboard, shareViaWebShare, canShare } from "@/lib/format";

interface ActionBarProps {
  items: Item[];
  onCopied: () => void;
}

export default function ActionBar({ items, onCopied }: ActionBarProps) {
  const hasItems = items.length > 0;

  const handleCopy = async () => {
    const text = formatForWhatsApp(items);
    const success = await copyToClipboard(text);
    if (success) {
      onCopied();
    }
  };

  const handleShare = async () => {
    const text = formatForWhatsApp(items);
    const shared = await shareViaWebShare(text);
    if (!shared) {
      // Fallback to copy
      await handleCopy();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <div className="max-w-lg mx-auto flex gap-3">
        <button
          onClick={handleCopy}
          disabled={!hasItems}
          className="flex-1 py-3 px-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          ✅ Aprobar y Copiar
        </button>
        {canShare() && (
          <button
            onClick={handleShare}
            disabled={!hasItems}
            className="py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📤
          </button>
        )}
      </div>
    </div>
  );
}
