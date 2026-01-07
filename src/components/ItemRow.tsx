"use client";

import { Item, Unit, UNITS } from "@/types";

interface ItemRowProps {
  item: Item;
  onUpdate: (id: string, updates: Partial<Item>) => void;
  onDelete: (id: string) => void;
}

export default function ItemRow({ item, onUpdate, onDelete }: ItemRowProps) {
  const handleQuantityChange = (delta: number) => {
    const current = item.quantity ?? 0;
    const newQty = Math.max(0, current + delta);
    onUpdate(item.id, { quantity: newQty });
  };

  const handleMultiply = (factor: number) => {
    const current = item.quantity ?? 1;
    onUpdate(item.id, { quantity: current * factor });
  };

  return (
    <div
      className={`p-3 rounded-xl border ${
        item.needsReview
          ? "border-amber-200 bg-amber-50"
          : "border-gray-100 bg-white"
      }`}
    >
      {/* Item name row */}
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={item.name}
          onChange={(e) => onUpdate(item.id, { name: e.target.value })}
          className="flex-1 font-medium text-gray-800 bg-transparent focus:outline-none focus:bg-gray-50 px-2 py-1 rounded"
        />
        <button
          onClick={() => onDelete(item.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
        >
          ✕
        </button>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Quick chips */}
        <div className="flex gap-1">
          <button
            onClick={() => handleQuantityChange(1)}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            +1
          </button>
          <button
            onClick={() => handleQuantityChange(0.5)}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            +0.5
          </button>
          <button
            onClick={() => handleMultiply(2)}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            x2
          </button>
          <button
            onClick={() => handleMultiply(4)}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            x4
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-full">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
          >
            −
          </button>
          <input
            type="number"
            value={item.quantity ?? ""}
            onChange={(e) =>
              onUpdate(item.id, {
                quantity: e.target.value ? parseFloat(e.target.value) : null,
              })
            }
            placeholder="?"
            className="w-12 text-center bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={() => handleQuantityChange(1)}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
          >
            +
          </button>
        </div>

        {/* Unit selector */}
        <select
          value={item.unit || ""}
          onChange={(e) =>
            onUpdate(item.id, {
              unit: (e.target.value as Unit) || null,
            })
          }
          className="px-3 py-1 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">unidad</option>
          {UNITS.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>

      {/* Notes (optional, collapsible later) */}
      {item.notes && (
        <p className="text-xs text-gray-500 mt-2 italic">{item.notes}</p>
      )}
    </div>
  );
}
