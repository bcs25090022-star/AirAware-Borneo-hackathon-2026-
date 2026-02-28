import React, { useState, useEffect } from 'react';

interface AQIGaugeProps {
  aqi: number;
  size?: number;
}

export const AQIGauge: React.FC<AQIGaugeProps> = ({ aqi, size = 300 }) => {
  const [currentAqi, setCurrentAqi] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setCurrentAqi(aqi), 100);
    return () => clearTimeout(timer);
  }, [aqi]);

  const getAqiInfo = (val: number) => {
    if (val <= 50) return { color: '#22C55E', label: 'Good' };
    if (val <= 100) return { color: '#FACC15', label: 'Moderate' };
    if (val <= 150) return { color: '#FB923C', label: 'Sensitive' };
    if (val <= 200) return { color: '#EF4444', label: 'Unhealthy' };
    if (val <= 300) return { color: '#8B5CF6', label: 'Very Unhealthy' };
    return { color: '#7C3AED', label: 'Hazardous' };
  };

  const info = getAqiInfo(currentAqi);
  const angle = (currentAqi / 500) * 180;
  
  const radius = 100;
  const innerRadius = 60;
  const centerX = 150;
  const centerY = 150;

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');
  };

  const breakpoints = [0, 50, 100, 150, 200, 300, 500];
  const colors = ['#22C55E', '#FACC15', '#FB923C', '#EF4444', '#8B5CF6', '#7C3AED'];
  const labels = ['Good', 'Moderate', 'Sensitive', 'Unhealthy', 'Very Unhealthy', 'Hazardous'];

  return (
    <div className="flex flex-col items-center select-none">
      <svg width={size} height={size * 0.6} viewBox="0 0 300 180">
        {/* Segments */}
        {breakpoints.slice(0, -1).map((bp, i) => {
          const startAngle = (bp / 500) * 180;
          const endAngle = (breakpoints[i + 1] / 500) * 180;
          return (
            <path
              key={i}
              d={describeArc(centerX, centerY, radius, startAngle, endAngle)}
              fill="none"
              stroke={colors[i]}
              strokeWidth="12"
              strokeLinecap="butt"
            />
          );
        })}

        {/* Inner Arc */}
        <path
          d={describeArc(centerX, centerY, innerRadius, 0, 180)}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Numeric Labels */}
        {breakpoints.map((bp) => {
          const a = (bp / 500) * 180;
          const pos = polarToCartesian(centerX, centerY, radius + 15, a);
          return (
            <text
              key={bp}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              className="text-[10px] font-bold fill-slate-400"
            >
              {bp}
            </text>
          );
        })}

        {/* Needle */}
        <g transform={`rotate(${angle - 90}, ${centerX}, ${centerY})`} style={{ transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          <path
            d={`M ${centerX - 2} ${centerY} L ${centerX} ${centerY - radius + 5} L ${centerX + 2} ${centerY} Z`}
            fill="#1E293B"
          />
          <circle cx={centerX} cy={centerY} r="6" fill="#1E293B" />
        </g>

        {/* AQI Number - Placed inside the inner arc area */}
        <text x={centerX} y={centerY - 25} textAnchor="middle" className="text-6xl font-black fill-primary">
          {Math.round(currentAqi)}
        </text>
      </svg>

      {/* Category Labels Below Gauge */}
      <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-sm">
        {labels.map((label, i) => (
          <div key={label} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-50 border border-slate-100">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i] }} />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
