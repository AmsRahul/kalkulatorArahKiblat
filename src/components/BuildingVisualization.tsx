import React from 'react';

interface BuildingVisualizationProps {
  qiblaAngle: number;
  buildingAngle: number;
}

const BuildingVisualization: React.FC<BuildingVisualizationProps> = ({ qiblaAngle, buildingAngle }) => {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-auto max-w-md">
      {/* Background with subtle pattern */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.5"/>
        </pattern>
        <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--muted))" />
          <stop offset="100%" stopColor="hsl(var(--border))" />
        </linearGradient>
        <linearGradient id="roofGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      <rect width="300" height="200" fill="url(#grid)" />

      {/* Shaf lines (prayer rows) */}
      <g transform={`rotate(${buildingAngle - 270}, 180, 100)`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={120 + i * 15}
            y1={60}
            x2={120 + i * 15}
            y2={140}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="1"
            strokeDasharray="4,4"
            opacity="0.4"
          />
        ))}
      </g>

      {/* Building outline (3D isometric) */}
      <g transform="translate(130, 70)">
        {/* Floor */}
        <polygon
          points="0,50 70,20 140,50 70,80"
          fill="url(#buildingGradient)"
          stroke="hsl(var(--foreground))"
          strokeWidth="1.5"
        />
        {/* Left wall */}
        <polygon
          points="0,50 0,30 70,0 70,20"
          fill="hsl(var(--muted))"
          stroke="hsl(var(--foreground))"
          strokeWidth="1.5"
          opacity="0.8"
        />
        {/* Right wall */}
        <polygon
          points="70,0 70,20 140,50 140,30"
          fill="hsl(var(--accent))"
          stroke="hsl(var(--foreground))"
          strokeWidth="1.5"
          opacity="0.6"
        />
        {/* Roof highlight */}
        <polygon
          points="0,30 70,0 140,30 70,60"
          fill="url(#roofGradient)"
          stroke="hsl(var(--foreground))"
          strokeWidth="1"
        />
      </g>

      {/* Kaaba icon */}
      <g transform="translate(25, 55)">
        <rect
          x="0"
          y="0"
          width="35"
          height="40"
          fill="hsl(var(--foreground))"
          rx="2"
        />
        {/* Gold band (Kiswah) */}
        <rect
          x="0"
          y="8"
          width="35"
          height="8"
          fill="hsl(var(--qibla-gold))"
        />
        {/* Door */}
        <rect
          x="12"
          y="20"
          width="11"
          height="20"
          fill="hsl(var(--qibla-gold))"
          rx="1"
        />
      </g>

      {/* Qibla direction arrow from Kaaba to building */}
      <line
        x1="60"
        y1="75"
        x2="160"
        y2="95"
        stroke="hsl(var(--foreground))"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
      />
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="hsl(var(--foreground))"
          />
        </marker>
      </defs>

      {/* Label */}
      <text x="175" y="60" className="text-xs font-medium fill-foreground uppercase tracking-wider">
        Garis Shaf
      </text>
    </svg>
  );
};

export default BuildingVisualization;
