export function formatPrice(cents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export const colorLabels: Record<string, string> = {
  rouge: "Vin rouge",
  blanc: "Vin blanc",
  rose: "Vin rosé",
  bulles: "Bulles",
  "sans-alcool": "Sans alcool",
};

export function colorLabel(color: string) {
  return colorLabels[color] ?? color;
}

export function bottleTone(color: string) {
  if (color === "blanc") return "white";
  if (color === "rose") return "rose";
  if (color === "bulles") return "sparkling";
  if (color === "sans-alcool") return "alcohol-free";
  return "red";
}
