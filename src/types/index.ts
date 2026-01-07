export type Unit =
  | "unid"
  | "kg"
  | "g"
  | "L"
  | "ml"
  | "docena"
  | "paquete"
  | "caja"
  | "botella"
  | "lata"
  | "bolsa";

export const UNITS: Unit[] = [
  "unid",
  "kg",
  "g",
  "L",
  "ml",
  "docena",
  "paquete",
  "caja",
  "botella",
  "lata",
  "bolsa",
];

export type Item = {
  id: string;
  name: string;
  quantity: number | null;
  unit: Unit | null;
  notes?: string;
  confidence: number;
  needsReview: boolean;
  sourceSnippets: string[];
};

export type MergeMode = "merge" | "replace";

export type AppState = {
  rawInput: string;
  items: Item[];
  mergeMode: MergeMode;
  lastGeneratedAt: number | null;
};

export type LLMItem = {
  name: string;
  quantity: number | null;
  unit: Unit | null;
  confidence: number;
};
