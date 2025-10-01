import React from 'react';

interface EfficiencyGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function EfficiencyGauge({ score, size = 'md', showLabel = true }: EfficiencyGaugeProps) {
  const dimensions = {
    sm: { size: 80, strokeWidth: 8 },
    md: { size: 120, strokeWidth: 12 },
    lg: { size: 160, strokeWidth: 16 }
  };

  const { size: gaugeSize, strokeWidth } = dimensions[size];
  const radius = (gaugeSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (value: number) => {
    if (value >= 90) return '#10B981'; // green-500
    if (value >= 75) return '#F59E0B'; // amber-500
    if (value >= 60) return '#F97316'; // orange-500
    return '#EF4444'; // red-500
  };

  const getScoreGradient = (value: number) => {
    if (value >= 90) return 'from-green-400 to-green-600';
    if (value >= 75) return 'from-yellow-400 to-yellow-600';
    if (value >= 60) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={gaugeSize} height={gaugeSize} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={gaugeSize / 2}
            cy={gaugeSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-700"
          />
          
          {/* Progress circle */}
          <circle
            cx={gaugeSize / 2}
            cy={gaugeSize / 2}
            r={radius}
            stroke={getScoreColor(score)}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: 'drop-shadow(0 0 6px currentColor)',
            }}
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold bg-gradient-to-r ${getScoreGradient(score)} bg-clip-text text-transparent`}
                style={{ fontSize: size === 'lg' ? '2rem' : size === 'md' ? '1.5rem' : '1.25rem' }}>
            {Math.round(score)}%
          </span>
          {size !== 'sm' && (
            <span className="text-gray-400 text-xs mt-1">Efficiency</span>
          )}
        </div>
      </div>
      
      {showLabel && size === 'sm' && (
        <span className="text-gray-400 text-xs mt-2">Efficiency</span>
      )}
    </div>
  );
}