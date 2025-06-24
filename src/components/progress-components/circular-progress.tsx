import React from "react";
import { getTextColorClass } from "./get-percentage-color";

export default function CircularProgress({
  value,
  isColored = false,
  order = "ascending",
}: {
  value: number;
  isColored?: boolean;
  order?: "ascending" | "descending";
}) {
  const radius = 40; // Smaller radius for better fit
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const colorClass = isColored
    ? getTextColorClass(value, order)
    : "text-primary";

  return (
    <div className="relative inline-flex items-center justify-center w-full h-40">
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
