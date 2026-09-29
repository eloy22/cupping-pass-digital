export const USUAL_ORDERS = [
  "Flat White",
  "Café con Leche/Latte",
  "Doble Espresso",
  "Filtro Batch Brew",
  "Iced Latte",
] as const;

export const MILK_TYPES = [
  "Bebida de Avena Barista",
  "Leche Fresca Entera",
  "Solo/Negro",
  "Bebida de Soja",
] as const;

export const FLAVOR_PROFILES = [
  "Dulce & Chocolate",
  "Afrutado & Cítrico",
  "Me fío del Barista",
] as const;

export const DECAF_OPTIONS = [
  { label: "No", value: false },
  { label: "Sí, descafeinado al agua", value: true },
] as const;

export const STAMP_GOAL = 5;

type Hopper = { name: string; origin: string; notes: string };

const HOPPERS: Record<string, Hopper> = {
  "Dulce & Chocolate": {
    name: "Tolva 1 — Blend Casa",
    origin: "Brasil Cerrado + Colombia Huila",
    notes: "Cacao tostado, avellana, panela",
  },
  "Afrutado & Cítrico": {
    name: "Tolva 2 — Single Origin",
    origin: "Etiopía Guji, lavado",
    notes: "Bergamota, melocotón, jazmín",
  },
  "Me fío del Barista": {
    name: "Tolva del Barista",
    origin: "Kenia Nyeri, SL28",
    notes: "Grosella negra, caña de azúcar, cuerpo jugoso",
  },
};

export function recommendedHopper(flavorProfile: string): Hopper {
  return HOPPERS[flavorProfile] ?? HOPPERS["Me fío del Barista"]!;
}
