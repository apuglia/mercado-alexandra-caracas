import { LLMItem } from "@/types";

export async function parseGroceryList(rawText: string): Promise<LLMItem[]> {
  const response = await fetch("/api/parse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rawText }),
  });

  const text = await response.text();

  if (!text) {
    throw new Error("El servidor no respondio. Verifica la API key.");
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("Response was not JSON:", text);
    throw new Error("Error del servidor. Revisa los logs.");
  }

  if (!response.ok) {
    throw new Error(data.error || "Error al procesar la lista");
  }

  return data.items;
}
