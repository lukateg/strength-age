import React from "react";
import { getTextColorClass } from "@/components/progress-components/get-percentage-color";

const MiniPieChart = ({
  percentage,
  size = 20,
  strokeWidth = 3,
  isColored = false,
  order = "ascending",
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  order?: "ascending" | "descending";
  isColored?: boolean;
}) => {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  const colorClass = isColored
    ? getTextColorClass(percentage, order)
    : "text-primary";

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="transform -rotate-90"
    >
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="transparent"
        stroke="hsl(var(--muted))"
        strokeWidth={strokeWidth}
      />
      <circle
        className={`${colorClass} stroke-current transition-all duration-1000 ease-in-out`}
        cx={center}
        cy={center}
        r={r}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default MiniPieChart;
