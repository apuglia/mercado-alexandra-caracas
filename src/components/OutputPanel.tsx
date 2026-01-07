"use client";

import { Item } from "@/types";
import ItemRow from "./ItemRow";

interface OutputPanelProps {
  items: Item[];
  onUpdateItem: (id: string, updates: Partial<Item>) => void;
  onDeleteItem: (id: string) => void;
}

export default function OutputPanel({
  items,
  onUpdateItem,
  onDeleteItem,
}: OutputPanelProps) {
  const readyItems = items.filter((item) => !item.needsReview);
  const reviewItems = items.filter((item) => item.needsReview);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
        <p className="text-gray-400">
          Tu lista limpia aparecerá aquí
        </p>
        <p className="text-gray-300 text-sm mt-2">
          Escribe arriba y toca &quot;Generar lista&quot;
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <h2 className="font-semibold text-gray-800 mb-4">Lista limpia</h2>

      {/* Ready items */}
      {readyItems.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-600">✅</span>
            <span className="text-sm font-medium text-gray-600">
              Listo ({readyItems.length})
            </span>
          </div>
          <div className="space-y-2">
            {readyItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onUpdate={onUpdateItem}
                onDelete={onDeleteItem}
              />
            ))}
          </div>
        </div>
      )}

      {/* Needs review items */}
      {reviewItems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-500">⚠️</span>
            <span className="text-sm font-medium text-gray-600">
              Falta cantidad ({reviewItems.length})
            </span>
          </div>
          <div className="space-y-2">
            {reviewItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onUpdate={onUpdateItem}
                onDelete={onDeleteItem}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
