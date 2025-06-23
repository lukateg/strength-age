// This file ensures Tailwind includes all the color classes used by the percentage color system
// The classes are listed here so Tailwind can detect them during the build process

export const percentageColorClasses = [
  // Background colors
  "bg-red-600",
  "bg-red-500",
  "bg-red-400",
  "bg-orange-600",
  "bg-orange-500",
  "bg-orange-400",
  "bg-yellow-600",
  "bg-yellow-500",
  "bg-yellow-400",
  "bg-green-500",

  // Text colors
  "text-red-600",
  "text-red-500",
  "text-red-400",
  "text-orange-600",
  "text-orange-500",
  "text-orange-400",
  "text-yellow-600",
  "text-yellow-500",
  "text-yellow-400",
  "text-green-500",
] as const;
