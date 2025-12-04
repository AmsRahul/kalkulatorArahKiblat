import React from 'react';

interface DataRowProps {
  label: string;
  degrees: number;
  minutes: number;
  seconds: number;
  suffix?: string;
  highlight?: boolean;
}

const DataRow: React.FC<DataRowProps> = ({ 
  label, 
  degrees, 
  minutes, 
  seconds, 
  suffix,
  highlight = false 
}) => {
  return (
    <div className={`flex items-baseline gap-3 py-1 ${highlight ? 'text-primary font-semibold' : ''}`}>
      <span className="text-sm text-muted-foreground min-w-[120px]">{label}</span>
      <div className="flex items-baseline gap-1 font-mono">
        <span className="text-lg font-semibold">{degrees}°</span>
        <span className="text-base">{minutes}'</span>
        <span className="text-base">{seconds}"</span>
        {suffix && <span className="text-sm text-muted-foreground ml-2">{suffix}</span>}
      </div>
    </div>
  );
};

export default DataRow;
