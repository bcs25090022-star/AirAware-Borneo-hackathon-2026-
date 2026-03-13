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

  // Piecewise linear mapping to ensure the needle points to the correct equal-sized segment
  const getAngleForAqi = (val: number) => {
    if (val <= 50) return (val / 50) * 30;
    if (val <= 100) return 30 + ((val - 50) / 50) * 30;
    if (val <= 150) return 60 + ((val - 100) / 50) * 30;
    if (val <= 200) return 90 + ((val - 150) / 50) * 30;
    if (val <= 300) return 120 + ((val - 200) / 100) * 30;
    if (val <= 500) return 150 + ((val - 300) / 200) * 30;
    return 180;
  };

  const angle = getAngleForAqi(currentAqi);
  
  const radius = 100;
  const innerRadius = 75;
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

  const colors = ['#22C55E', '#FACC15', '#FB923C', '#EF4444', '#8B5CF6', '#4C1D95'];
  const ticks = [
    { val: 0, angle: 0 },
    { val: 50, angle: 30 },
    { val: 100, angle: 60 },
    { val: 150, angle: 90 },
    { val: 200, angle: 120 },
    { val: 300, angle: 150 },
    { val: 500, angle: 180 }
  ];
  const categories = ['Good', 'Moderate', 'Sensitive', 'Unhealthy', 'Very Unhealthy', 'Hazardous'];

  return (
    <div className="flex flex-col items-center select-none">
      <svg className="w-full h-auto max-w-[400px]" viewBox="0 0 300 190">
        {/* Semicircle Segments */}
        {colors.map((color, i) => {
          const startAngle = i * 30;
          const endAngle = (i + 1) * 30;
          return (
            <path
              key={i}
              d={describeArc(centerX, centerY, radius, startAngle, endAngle)}
              fill="none"
              stroke={color}
              strokeWidth="25"
            />
          );
        })}

        {/* Numeric Tick Labels */}
        {ticks.map((tick) => {
          const pos = polarToCartesian(centerX, centerY, radius + 22, tick.angle);
          return (
            <text
              key={tick.val}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              className="text-[10px] font-black fill-slate-500"
            >
              {tick.val}
            </text>
          );
        })}

        {/* Needle */}
        <g transform={`rotate(${angle - 90}, ${centerX}, ${centerY})`} style={{ transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <path
            d={`M ${centerX - 3} ${centerY} L ${centerX} ${centerY - radius + 10} L ${centerX + 3} ${centerY} Z`}
            fill="#1E293B"
          />
          <circle cx={centerX} cy={centerY} r="8" fill="#1E293B" />
          <circle cx={centerX} cy={centerY} r="3" fill="#94A3B8" />
        </g>

        {/* Central AQI Value */}
        <text x={centerX} y={centerY - 10} textAnchor="middle" className="text-6xl font-black fill-slate-800">
          {Math.round(currentAqi)}
        </text>
      </svg>

      {/* Simplified Legend */}
      <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-md">
        {colors.map((color, i) => (
          <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-100 shadow-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">{categories[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
