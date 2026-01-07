import { LLMItem } from "@/types";

export async function parseGroceryList(rawText: string): Promise<LLMItem[]> {
  const response = await fetch("/api/parse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rawText }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al procesar la lista");
  }

  const data = await response.json();
  return data.items;
}
