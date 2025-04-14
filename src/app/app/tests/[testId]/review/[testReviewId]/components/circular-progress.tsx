import React from "react";

export default function CircularProgress({ value }: { value: number }) {
  const circumference = 2 * Math.PI * 60; // increased radius to 60
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90 w-48 h-48">
        {" "}
        <circle
          className="text-muted stroke-current"
          strokeWidth="6"
          fill="transparent"
          r="60"
          cx="96"
          cy="96"
        />
        <circle
          className="text-primary stroke-current transition-all duration-1000 ease-in-out"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r="60"
          cx="96"
          cy="96"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        {/* <Trophy className="w-8 h-8 mb-2 text-primary" /> */}
        <div className="text-4xl ">{Math.round(value)}%</div>
      </div>
    </div>
  );
}
