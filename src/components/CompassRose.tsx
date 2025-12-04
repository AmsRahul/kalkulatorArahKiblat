import React from "react";

interface CompassRoseProps {
  qiblaAngle: number;
  buildingAngle?: number;
  size?: number;
}

const CompassRose: React.FC<CompassRoseProps> = ({
  qiblaAngle,
  buildingAngle,
  size = 200,
}) => {
  const center = size / 2;
  const radius = size / 2 - 10;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="select-none drop-shadow-xl"
    >
      <defs>
        {/* Soft gradient */}
        <radialGradient id="compassGradient" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="hsl(var(--card))" />
          <stop offset="100%" stopColor="hsl(var(--muted))" />
        </radialGradient>

        {/* Inner glow */}
        <radialGradient id="innerGlow" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="url(#compassGradient)"
        stroke="hsl(var(--border))"
        strokeWidth="3"
      />

      {/* Inner glow overlay */}
      <circle cx={center} cy={center} r={radius - 6} fill="url(#innerGlow)" />

      {/* Minor ticks (every 30°) */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = center + (radius - 18) * Math.cos(angle);
        const y1 = center + (radius - 18) * Math.sin(angle);
        const x2 = center + (radius - 10) * Math.cos(angle);
        const y2 = center + (radius - 10) * Math.sin(angle);

        return (
          <line
            key={`tick-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="hsl(var(--foreground))"
            strokeWidth={i % 3 === 0 ? 2.2 : 1}
            opacity={i % 3 === 0 ? 0.7 : 0.4}
          />
        );
      })}

      {/* Cardinal directions
      <text
        x={center}
        y={28}
        textAnchor="middle"
        className="text-sm font-extrabold fill-primary tracking-wide"
      >
        U
      </text>
      <text
        x={size - 25}
        y={center + 5}
        textAnchor="middle"
        className="text-sm font-extrabold fill-foreground tracking-wide"
      >
        T
      </text>
      <text
        x={center}
        y={size - 15}
        textAnchor="middle"
        className="text-sm font-extrabold fill-foreground tracking-wide"
      >
        S
      </text>
      <text
        x={25}
        y={center + 5}
        textAnchor="middle"
        className="text-sm font-extrabold fill-foreground tracking-wide"
      >
        B
      </text> */}

      {/* Degree labels */}
      <text
        x={center}
        y={45}
        textAnchor="middle"
        className="text-[10px] fill-muted-foreground"
      >
        0°
      </text>
      <text
        x={size - 35}
        y={center + 4}
        textAnchor="middle"
        className="text-[10px] fill-muted-foreground"
      >
        90°
      </text>
      <text
        x={center}
        y={size - 30}
        textAnchor="middle"
        className="text-[10px] fill-muted-foreground"
      >
        180°
      </text>
      <text
        x={35}
        y={center + 4}
        textAnchor="middle"
        className="text-[10px] fill-muted-foreground"
      >
        270°
      </text>

      {/* Building Direction (dashed) */}
      {buildingAngle !== undefined && (
        <g transform={`rotate(${buildingAngle - 90}, ${center}, ${center})`}>
          <line
            x1={center}
            y1={center}
            x2={center + radius - 40}
            y2={center}
            stroke="hsl(var(--destructive))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="4 3"
          />
          <polygon
            points={`${center + radius - 40},${center - 6} 
                     ${center + radius - 30},${center} 
                     ${center + radius - 40},${center + 6}`}
            fill="hsl(var(--destructive))"
          />
        </g>
      )}

      {/* Qibla Direction */}
      <g transform={`rotate(${qiblaAngle - 90}, ${center}, ${center})`}>
        <line
          x1={center}
          y1={center}
          x2={center + radius - 25}
          y2={center}
          stroke="hsl(var(--qibla-teal))"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <polygon
          points={`${center + radius - 25},${center - 7} 
                   ${center + radius - 12},${center} 
                   ${center + radius - 25},${center + 7}`}
          fill="hsl(var(--qibla-teal))"
        />
      </g>

      {/* Center dot */}
      <circle
        cx={center}
        cy={center}
        r={7}
        fill="hsl(var(--qibla-gold))"
        stroke="hsl(var(--background))"
        strokeWidth="2"
      />
    </svg>
  );
};

export default CompassRose;
