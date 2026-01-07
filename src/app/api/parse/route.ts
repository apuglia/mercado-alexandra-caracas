import { NextRequest, NextResponse } from "next/server";

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

const VALID_UNITS = [
  "unid", "kg", "g", "L", "ml",
  "docena", "paquete", "caja", "botella", "lata", "bolsa",
];

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key no configurada en el servidor" },
      { status: 500 }
    );
  }

  try {
    const { rawText } = await request.json();

    if (!rawText || typeof rawText !== "string") {
      return NextResponse.json(
        { error: "Texto requerido" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
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
      return NextResponse.json(
        { error: error.error?.message || "Error al procesar la lista" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.content[0]?.text;

    if (!content) {
      return NextResponse.json(
        { error: "Respuesta vacía del API" },
        { status: 500 }
      );
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "No se pudo extraer JSON de la respuesta" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate and clean items
    const items = (parsed.items || []).map((item: Record<string, unknown>) => ({
      name: String(item.name || "").trim(),
      quantity: typeof item.quantity === "number" ? item.quantity : null,
      unit: typeof item.unit === "string" && VALID_UNITS.includes(item.unit) ? item.unit : null,
      confidence: typeof item.confidence === "number" ? item.confidence : 0.5,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Parse error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
