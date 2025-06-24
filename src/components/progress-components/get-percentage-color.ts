// Tailwind classes that need to be included in the build:
// bg-red-600 bg-red-500 bg-red-400
// bg-orange-600 bg-orange-500 bg-orange-400
// bg-yellow-600 bg-yellow-500 bg-yellow-400
// bg-green-500
// text-red-600 text-red-500 text-red-400
// text-orange-600 text-orange-500 text-orange-400
// text-yellow-600 text-yellow-500 text-yellow-400
// text-green-500

export function getPercentageColor(
  percentage: number,
  order: "ascending" | "descending" = "ascending"
): string {
  const p = order === "ascending" ? percentage : 100 - percentage;

  if (p <= 25) {
    return "red-500";
  } else if (p <= 40) {
    return "orange-500";
  } else if (p <= 60) {
    return "yellow-500";
  } else if (p <= 75) {
    return "yellow-400";
  } else if (p <= 85) {
    return "green-400";
  } else {
    return "green-500";
  }
}

export function getBackgroundColorClass(
  percentage: number,
  order: "ascending" | "descending" = "ascending"
): string {
  const color = getPercentageColor(percentage, order);
  return `bg-${color}`;
}

export function getTextColorClass(
  percentage: number,
  order: "ascending" | "descending" = "ascending"
): string {
  const color = getPercentageColor(percentage, order);
  return `text-${color}`;
}

export function getColorValue(
  percentage: number,
  order: "ascending" | "descending" = "ascending"
): string {
  const color = getPercentageColor(percentage, order);

  // Map Tailwind color names to actual CSS color values
  const colorMap: Record<string, string> = {
    "red-500": "#ef4444",
    "orange-500": "#f97316",
    "yellow-500": "#eab308",
    "yellow-400": "#facc15",
    "green-400": "#4ade80",
    "green-500": "#22c55e",
  };

  return colorMap[color] ?? "#6b7280"; // fallback to gray
}
