import React from "react";

const MiniPieChart = ({
  percentage,
  size = 20,
  strokeWidth = 3,
  progressColor,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  progressColor: string;
}) => {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  const colorClassMap: Record<string, string> = {
    "red-500": "text-red-500",
    "orange-500": "text-orange-500",
    "yellow-500": "text-yellow-500",
    "green-500": "text-green-500",
  };

  const colorClass = colorClassMap[progressColor] ?? "text-primary";

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
