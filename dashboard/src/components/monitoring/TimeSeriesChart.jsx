import { useState, useMemo } from "react";

const colorMap = {
  blue: { stroke: "#60a5fa", fill: "rgba(96,165,250,0.1)", dot: "#3b82f6" },
  green: { stroke: "#4ade80", fill: "rgba(74,222,128,0.1)", dot: "#22c55e" },
  purple: { stroke: "#c084fc", fill: "rgba(192,132,252,0.1)", dot: "#a855f7" },
  yellow: { stroke: "#facc15", fill: "rgba(250,204,21,0.08)", dot: "#eab308" },
  cyan: { stroke: "#22d3ee", fill: "rgba(34,211,238,0.1)", dot: "#06b6d4" },
  red: { stroke: "#f87171", fill: "rgba(248,113,113,0.1)", dot: "#ef4444" },
  orange: { stroke: "#fb923c", fill: "rgba(251,146,60,0.1)", dot: "#f97316" },
};

const TimeSeriesChart = ({
  series,
  labels,
  height = 200,
  showGrid = true,
  showAxis = true,
  className = "",
}) => {
  const [hoverIndex, setHoverIndex] = useState(null);

  const padding = { top: 16, right: 16, bottom: 28, left: 44 };
  const chartW = 700;
  const chartH = height;
  const plotW = chartW - padding.left - padding.right;
  const plotH = chartH - padding.top - padding.bottom;

  // Calculate global min/max across all series
  const allValues = series.flatMap((s) => s.data);
  const maxVal = Math.max(...allValues, 1);
  const minVal = Math.min(...allValues, 0);
  const range = maxVal - minVal || 1;

  const xScale = (i) => padding.left + (i / Math.max(labels.length - 1, 1)) * plotW;
  const yScale = (v) => padding.top + plotH - ((v - minVal) / range) * plotH;

  // Grid lines (5 horizontal)
  const gridLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (i / 4) * plotH;
      lines.push({ y, label: Math.round(maxVal - (i / 4) * range) });
    }
    return lines;
  }, [plotH, maxVal, range]);

  // Build path data
  const buildPath = (data) =>
    data
      .map((v, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(v)}`)
      .join(" ");

  const buildArea = (data) =>
    `${buildPath(data)} L ${xScale(data.length - 1)} ${padding.top + plotH} L ${xScale(0)} ${padding.top + plotH} Z`;

  // X-axis labels (show every 3rd)
  const xLabels = labels.filter((_, i) => i % 3 === 0 || i === labels.length - 1);

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${chartW} ${chartH}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        onMouseLeave={() => setHoverIndex(null)}
      >
        {/* Grid lines */}
        {showGrid &&
          gridLines.map((gl, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={gl.y}
                x2={chartW - padding.right}
                y2={gl.y}
                stroke="#1e293b"
                strokeWidth="1"
              />
              {showAxis && (
                <text
                  x={padding.left - 8}
                  y={gl.y + 4}
                  textAnchor="end"
                  className="fill-slate-600 text-[10px]"
                >
                  {gl.label}
                </text>
              )}
            </g>
          ))}

        {/* X-axis labels */}
        {showAxis &&
          xLabels.map((label, i) => {
            const idx = labels.indexOf(label);
            return (
              <text
                key={i}
                x={xScale(idx)}
                y={chartH - 6}
                textAnchor="middle"
                className="fill-slate-600 text-[10px]"
              >
                {label}
              </text>
            );
          })}

        {/* Area fills */}
        {series.map((s) => {
          const c = colorMap[s.color] || colorMap.blue;
          return (
            <path
              key={`area-${s.name}`}
              d={buildArea(s.data)}
              fill={c.fill}
            />
          );
        })}

        {/* Lines */}
        {series.map((s) => {
          const c = colorMap[s.color] || colorMap.blue;
          return (
            <path
              key={`line-${s.name}`}
              d={buildPath(s.data)}
              fill="none"
              stroke={c.stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}

        {/* Hover crosshair */}
        {hoverIndex !== null && (
          <>
            <line
              x1={xScale(hoverIndex)}
              y1={padding.top}
              x2={xScale(hoverIndex)}
              y2={padding.top + plotH}
              stroke="#475569"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
            {series.map((s) => {
              const c = colorMap[s.color] || colorMap.blue;
              const y = yScale(s.data[hoverIndex]);
              return (
                <circle
                  key={`dot-${s.name}`}
                  cx={xScale(hoverIndex)}
                  cy={y}
                  r={3}
                  fill={c.dot}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />
              );
            })}
          </>
        )}

        {/* Invisible hit area for hover */}
        <rect
          x={padding.left}
          y={padding.top}
          width={plotW}
          height={plotH}
          fill="transparent"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const svg = e.currentTarget.closest("svg");
            const svgRect = svg.getBoundingClientRect();
            const scaleX = plotW / svgRect.width;
            const mx = (e.clientX - svgRect.left - padding.left * (svgRect.width / chartW)) * (chartW / svgRect.width);
            const idx = Math.round((mx / plotW) * (labels.length - 1));
            setHoverIndex(Math.max(0, Math.min(labels.length - 1, idx)));
          }}
        />
      </svg>

      {/* Tooltip */}
      {hoverIndex !== null && (
        <div
          className="absolute z-10 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 shadow-xl pointer-events-none"
          style={{
            left: `${(xScale(hoverIndex) / chartW) * 100}%`,
            top: "0",
            transform: "translate(-50%, -110%)",
          }}
        >
          <p className="text-xs text-slate-500 mb-1">{labels[hoverIndex]}</p>
          {series.map((s) => (
            <p key={s.name} className="text-xs text-slate-300 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full`} style={{ backgroundColor: colorMap[s.color]?.stroke }} />
              {s.name}: <span className="font-medium text-white">{s.data[hoverIndex]}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeSeriesChart;
