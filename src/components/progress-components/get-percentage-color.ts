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

  if (p <= 10) {
    return "red-600";
  } else if (p <= 20) {
    return "red-500";
  } else if (p <= 30) {
    return "red-400";
  } else if (p <= 40) {
    return "orange-600";
  } else if (p <= 50) {
    return "orange-500";
  } else if (p <= 60) {
    return "orange-400";
  } else if (p <= 70) {
    return "yellow-600";
  } else if (p <= 80) {
    return "yellow-500";
  } else if (p <= 90) {
    return "yellow-400";
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
