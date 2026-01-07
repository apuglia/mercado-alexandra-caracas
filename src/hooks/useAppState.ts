"use client";

import { useState, useEffect, useCallback } from "react";
import { AppState, Item, MergeMode, LLMItem } from "@/types";
import { parseGroceryList } from "@/lib/claude";
import { mergeItems, replaceItems } from "@/lib/merge";

const STORAGE_KEY = "mercado-app-state";

const initialState: AppState = {
  rawInput: "",
  items: [],
  mergeMode: "merge",
  lastGeneratedAt: null,
};

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Remove apiKey from old saved state if present
        const { apiKey, ...rest } = parsed;
        setState((prev) => ({ ...prev, ...rest }));
      } catch {
        // Ignore parse errors
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isHydrated]);

  const setRawInput = useCallback((rawInput: string) => {
    setState((prev) => ({ ...prev, rawInput }));
  }, []);

  const setMergeMode = useCallback((mergeMode: MergeMode) => {
    setState((prev) => ({ ...prev, mergeMode }));
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<Item>) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              // Mark as reviewed if quantity/unit changed manually
              confidence: 1.0,
              needsReview:
                updates.quantity === null || updates.quantity === undefined
                  ? item.needsReview
                  : false,
            }
          : item
      ),
    }));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }, []);

  const generateList = useCallback(async () => {
    if (!state.rawInput.trim()) {
      setError("Escribe algo para procesar");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const llmItems: LLMItem[] = await parseGroceryList(state.rawInput);

      const newItems =
        state.mergeMode === "merge"
          ? mergeItems(state.items, llmItems, state.rawInput)
          : replaceItems(llmItems, state.rawInput);

      setState((prev) => ({
        ...prev,
        items: newItems,
        lastGeneratedAt: Date.now(),
        rawInput: "", // Clear input after processing
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }, [state.rawInput, state.mergeMode, state.items]);

  const clearAll = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    isLoading,
    error,
    isHydrated,
    setRawInput,
    setMergeMode,
    updateItem,
    deleteItem,
    generateList,
    clearAll,
    setError,
  };
}
