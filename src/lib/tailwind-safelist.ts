// This file ensures Tailwind includes all the color classes used by the percentage color system
// The classes are listed here so Tailwind can detect them during the build process

export const percentageColorClasses = [
  // Background colors
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-yellow-400",
  "bg-green-400",
  "bg-green-500",

  // Text colors
  "text-red-500",
  "text-orange-500",
  "text-yellow-500",
  "text-yellow-400",
  "text-green-400",
  "text-green-500",
] as const;
