export function getPercentageColor(
  percentage: number,
  order: "ascending" | "descending" = "ascending"
): string {
  const p = order === "ascending" ? percentage : 100 - percentage;

  if (p <= 25) {
    return "red-500";
  } else if (p <= 50) {
    return "orange-500";
  } else if (p <= 70) {
    return "yellow-500";
  } else {
    return "green-500";
  }
}
