import { Item, LLMItem } from "@/types";

export function normalizeKey(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]/g, "")
    .replace(/s$/, ""); // basic singularization
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function llmItemToItem(llmItem: LLMItem, rawSnippet: string): Item {
  const needsReview = llmItem.quantity === null || llmItem.confidence < 0.7;
  return {
    id: generateId(),
    name: llmItem.name,
    quantity: llmItem.quantity,
    unit: llmItem.unit,
    confidence: llmItem.confidence,
    needsReview,
    sourceSnippets: [rawSnippet],
  };
}

export function mergeItems(
  existingItems: Item[],
  newLLMItems: LLMItem[],
  rawText: string
): Item[] {
  const result = new Map<string, Item>();

  // Add existing items to map
  for (const item of existingItems) {
    const key = normalizeKey(item.name);
    result.set(key, { ...item });
  }

  // Merge or add new items
  for (const llmItem of newLLMItems) {
    const key = normalizeKey(llmItem.name);
    const existing = result.get(key);

    if (existing) {
      // Item exists - merge
      const merged = mergeTwo(existing, llmItem, rawText);
      result.set(key, merged);
    } else {
      // New item
      result.set(key, llmItemToItem(llmItem, rawText));
    }
  }

  return Array.from(result.values());
}

function mergeTwo(existing: Item, newItem: LLMItem, rawText: string): Item {
  // If both have quantities and same unit, sum them
  if (
    existing.quantity !== null &&
    newItem.quantity !== null &&
    existing.unit === newItem.unit
  ) {
    return {
      ...existing,
      quantity: existing.quantity + newItem.quantity,
      confidence: Math.max(existing.confidence, newItem.confidence),
      needsReview: false,
      sourceSnippets: [...existing.sourceSnippets, rawText],
    };
  }

  // If existing was manually edited (high confidence), keep it
  if (existing.confidence >= 0.9 && !existing.needsReview) {
    return {
      ...existing,
      sourceSnippets: [...existing.sourceSnippets, rawText],
    };
  }

  // If new has higher confidence, prefer new but mark for review
  if (newItem.confidence > existing.confidence) {
    return {
      ...existing,
      quantity: newItem.quantity ?? existing.quantity,
      unit: newItem.unit ?? existing.unit,
      confidence: newItem.confidence,
      needsReview: true,
      sourceSnippets: [...existing.sourceSnippets, rawText],
    };
  }

  // Keep existing, mark for review if conflict
  return {
    ...existing,
    needsReview: true,
    sourceSnippets: [...existing.sourceSnippets, rawText],
  };
}

export function replaceItems(newLLMItems: LLMItem[], rawText: string): Item[] {
  return newLLMItems.map((item) => llmItemToItem(item, rawText));
}
