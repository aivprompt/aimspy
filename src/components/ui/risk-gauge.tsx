import React from 'react';
import { cn } from '@/lib/utils';

interface RiskGaugeProps {
  value: number; // 0-10
  type: 'risk' | 'reward' | 'legit';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  value,
  type,
  size = 'md',
  showLabel = true,
  animated = true
}) => {
  const percentage = Math.min(Math.max(value * 10, 0), 100);
  
  const sizeClasses = {
    sm: 'h-2 text-xs',
    md: 'h-3 text-sm',
    lg: 'h-4 text-base'
  };

  const getColor = () => {
    switch (type) {
      case 'risk':
        if (value <= 3) return 'bg-spy-green';
        if (value <= 6) return 'bg-spy-yellow';
        return 'bg-spy-red';
      case 'reward':
        if (value >= 7) return 'bg-spy-green';
        if (value >= 4) return 'bg-spy-yellow';
        return 'bg-muted';
      case 'legit':
        if (value >= 7) return 'bg-spy-green';
        if (value >= 4) return 'bg-spy-yellow';
        return 'bg-spy-red';
      default:
        return 'bg-primary';
    }
  };

  const getGlow = () => {
    switch (type) {
      case 'risk':
        return value > 6 ? 'glow-danger' : value > 3 ? 'glow-reward' : 'glow-green';
      case 'reward':
        return value >= 7 ? 'glow-reward' : '';
      case 'legit':
        return value >= 7 ? 'glow-green' : '';
      default:
        return '';
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'risk':
        if (value <= 3) return 'Low Risk';
        if (value <= 6) return 'Medium Risk';
        return 'High Risk';
      case 'reward':
        if (value >= 7) return 'High Reward';
        if (value >= 4) return 'Medium Reward';
        return 'Low Reward';
      case 'legit':
        if (value >= 7) return 'Legitimate';
        if (value >= 4) return 'Questionable';
        return 'Suspicious';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className={cn('font-medium capitalize', sizeClasses[size])}>
            {type}
          </span>
          <span className={cn('font-bold', sizeClasses[size])}>
            {value.toFixed(1)}/10
          </span>
        </div>
      )}
      
      <div className={cn(
        'w-full bg-muted rounded-full overflow-hidden spy-border',
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full transition-all duration-1000 ease-out relative',
            getColor(),
            animated && getGlow(),
            animated && 'animate-pulse-glow'
          )}
          style={{ width: `${percentage}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-scan-line" />
          )}
        </div>
      </div>
      
      {showLabel && size !== 'sm' && (
        <div className={cn('text-center font-medium', sizeClasses[size])}>
          {getLabel()}
        </div>
      )}
    </div>
  );
};