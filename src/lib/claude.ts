import { LLMItem, Unit } from "@/types";

const SYSTEM_PROMPT = `Eres un asistente que parsea listas de compras en español.
Extrae cada item y devuelve JSON con este formato exacto:
{
  "items": [
    {"name": "Pollo", "quantity": 2, "unit": "kg", "confidence": 1.0},
    {"name": "Arroz", "quantity": null, "unit": null, "confidence": 0.5}
  ]
}

Reglas:
- Normaliza nombres (mayúscula inicial, singular)
- Unidades válidas: unid, kg, g, L, ml, docena, paquete, caja, botella, lata, bolsa
- Si no hay cantidad clara, pon quantity: null y confidence: 0.5
- Interpreta "x4" como quantity: 4, unit: "unid"
- Ignora emojis pero úsalos como contexto (🍅 = tomate)
- SOLO devuelve el JSON, sin texto adicional`;

export async function parseGroceryList(
  rawText: string,
  apiKey: string
): Promise<LLMItem[]> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Parsea esta lista de compras:\n\n${rawText}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Error al procesar la lista");
  }

  const data = await response.json();
  const content = data.content[0]?.text;

  if (!content) {
    throw new Error("Respuesta vacía del API");
  }

  // Extract JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No se pudo extraer JSON de la respuesta");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  // Validate and clean items
  return (parsed.items || []).map((item: Partial<LLMItem>) => ({
    name: String(item.name || "").trim(),
    quantity: typeof item.quantity === "number" ? item.quantity : null,
    unit: isValidUnit(item.unit) ? item.unit : null,
    confidence: typeof item.confidence === "number" ? item.confidence : 0.5,
  }));
}

function isValidUnit(unit: unknown): unit is Unit {
  const validUnits: Unit[] = [
    "unid", "kg", "g", "L", "ml",
    "docena", "paquete", "caja", "botella", "lata", "bolsa",
  ];
  return typeof unit === "string" && validUnits.includes(unit as Unit);
}
