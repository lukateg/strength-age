import React from "react";
import { getTextColorClass } from "./get-percentage-color";

export default function CircularProgress({
  value,
  isColored = false,
  order = "ascending",
  animate = true,
}: {
  value: number;
  isColored?: boolean;
  order?: "ascending" | "descending";
  animate?: boolean;
}) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (value / 100) * circumference;

  const colorClass = isColored
    ? getTextColorClass(value, order)
    : "text-primary";

  return (
    <>
      {/* Global CSS animations - only injected once */}
      {animate && (
        <style>
          {`
            @keyframes circle-progress {
              from { stroke-dashoffset: var(--start-offset); }
              to { stroke-dashoffset: var(--end-offset); }
            }
            @keyframes text-reveal {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .progress-animate-circle {
              animation: circle-progress 0.5s ease-in-out 0.1s forwards;
            }
            .progress-animate-text {
              opacity: 0;
              animation: text-reveal 0.3s ease-in-out 0.8s forwards;
            }
          `}
        </style>
      )}

      <div
        className="relative inline-flex items-center justify-center w-full h-40"
        style={
          animate
            ? ({
                "--start-offset": circumference,
                "--end-offset": targetOffset,
              } as React.CSSProperties)
            : {}
        }
      >
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox="0 0 100 100"
        >
          <circle
            className="text-muted stroke-current"
            strokeWidth="6"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          <circle
            className={`${colorClass} stroke-current ${
              animate
                ? "progress-animate-circle"
                : "transition-all duration-200 ease-in-out"
            }`}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={animate ? circumference : targetOffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
        </svg>

        <div className="absolute flex flex-col items-center inset-0 justify-center">
          <div
            className={`text-4xl ${animate ? "progress-animate-text" : ""}`}
            style={
              animate
                ? { animation: `text-reveal 0.3s ease-in-out 0.1s forwards` }
                : {}
            }
          >
            {Math.round(value)}%
          </div>
        </div>
      </div>
    </>
  );
}
