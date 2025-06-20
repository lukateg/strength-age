import React from "react";

export default function CircularProgress({
  value,
  progressColor,
}: {
  value: number;
  progressColor?: string;
}) {
  const radius = 40; // Smaller radius for better fit
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  // This mapping ensures Tailwind generates the necessary classes
  const colorClassMap: Record<string, string> = {
    "red-500": "text-red-500",
    "orange-500": "text-orange-500",
    "yellow-500": "text-yellow-500",
    "green-500": "text-green-500",
  };

  const colorClass = progressColor
    ? (colorClassMap[progressColor] ?? "text-primary")
    : "text-primary";

  return (
    <div className="relative inline-flex items-center justify-center w-40 h-40">
      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-muted stroke-current"
          strokeWidth="6"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          className={`${colorClass} stroke-current transition-all duration-1000 ease-in-out`}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        {/* <Trophy className="w-8 h-8 mb-2 text-primary" /> */}
        <div className="text-4xl">{Math.round(value)}%</div>
      </div>
    </div>
  );
}
