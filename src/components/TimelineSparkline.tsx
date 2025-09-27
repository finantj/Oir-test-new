"use client";

type Point = { year: number; count: number };

function buildPath(points: Point[], width: number, height: number) {
  if (points.length === 0) return "";
  const minYear = Math.min(...points.map((p) => p.year));
  const maxYear = Math.max(...points.map((p) => p.year));
  const minCount = 0;
  const maxCount = Math.max(...points.map((p) => p.count));
  const yearRange = maxYear - minYear || 1;
  const countRange = maxCount - minCount || 1;
  const toX = (year: number) => ((year - minYear) / yearRange) * width;
  const toY = (count: number) => height - ((count - minCount) / countRange) * height;
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${toX(point.year).toFixed(2)} ${toY(point.count).toFixed(2)}`)
    .join(" ");
}

export default function TimelineSparkline({ data }: { data: Point[] }) {
  const width = 320;
  const height = 80;
  const path = buildPath(data, width, height);

  return (
    <div className="h-24 w-full">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" role="img" aria-label="Dataset timeline sparkline">
        <defs>
          <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4b36b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#d4b36b" stopOpacity="0" />
          </linearGradient>
        </defs>
        {path && (
          <>
            <path d={`${path} L ${width} ${height} L 0 ${height} Z`} fill="url(#sparkline-fill)" />
            <path d={path} fill="none" stroke="#d4b36b" strokeWidth={3} strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  );
}
