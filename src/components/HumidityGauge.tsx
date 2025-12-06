import React from 'react';

interface HumidityGaugeProps {
  value: number;
}

const HumidityGauge = ({ value }: HumidityGaugeProps) => {
  const safeValue = Math.max(0, Math.min(100, value || 0));

  return (
    <div className="flex flex-col items-center justify-center h-full w-full pt-2">
      <div className="text-4xl font-bold text-primary">
        {`${safeValue.toFixed(0)}%`}
      </div>
      <div className="w-full bg-secondary/50 rounded-full h-3 mt-3 overflow-hidden border border-primary/20">
        <div
          className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
};

export default HumidityGauge;