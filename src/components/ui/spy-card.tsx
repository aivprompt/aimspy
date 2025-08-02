import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RiskGauge } from './risk-gauge';
import { MemeCoin } from '@/types/meme-coin';
import { cn } from '@/lib/utils';
import { ExternalLink, TrendingUp, TrendingDown, Users, DollarSign, Pin, PinOff } from 'lucide-react';

interface SpyCardProps {
  coin: MemeCoin;
  onScan: (coin: MemeCoin) => void;
  onInvest?: (coin: MemeCoin) => void;
  onTogglePin?: () => void;
  isPinned?: boolean;
  isScanning?: boolean;
}

export const SpyCard: React.FC<SpyCardProps> = ({
  coin,
  onScan,
  onInvest,
  onTogglePin,
  isPinned = false,
  isScanning = false
}) => {
  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    if (amount >= 1) return `$${amount.toFixed(2)}`;
    if (amount >= 0.01) return `$${amount.toFixed(4)}`;
    if (amount >= 0.000001) return `$${amount.toFixed(8)}`;
    return `$${amount.toExponential(3)}`;
  };

  const formatAge = (seconds: number) => {
    // Handle if the input is in milliseconds instead of seconds
    const ageInSeconds = seconds > 86400000 ? Math.floor(seconds / 1000) : seconds;
    const hours = Math.floor(ageInSeconds / 3600);
    if (hours < 1) return `${Math.floor(ageInSeconds / 60)}m old`;
    if (hours < 24) return `${hours}h old`;
    return `${Math.floor(hours / 24)}d old`;
  };

  const getRiskLevel = () => {
    if (coin.riskScore <= 3) return { level: 'Low', color: 'bg-spy-green' };
    if (coin.riskScore <= 6) return { level: 'Medium', color: 'bg-spy-yellow' };
    return { level: 'High', color: 'bg-spy-red' };
  };

  const getRewardLevel = () => {
    if (coin.rewardScore >= 7) return { level: 'High', color: 'bg-spy-green' };
    if (coin.rewardScore >= 4) return { level: 'Medium', color: 'bg-spy-yellow' };
    return { level: 'Low', color: 'bg-muted' };
  };

  const riskLevel = getRiskLevel();
  const rewardLevel = getRewardLevel();

  return (
    <Card className={cn(
      'spy-border hover:glow-green transition-all duration-300 animate-fade-in',
      isScanning && 'animate-pulse-glow',
      coin.riskScore > 7 && 'border-spy-red/50',
      coin.rewardScore >= 7 && coin.riskScore <= 4 && 'border-spy-green/50'
    )}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              {coin.symbol}
              {coin.priceChange24h > 0 ? (
                <TrendingUp className="h-4 w-4 text-spy-green" />
              ) : (
                <TrendingDown className="h-4 w-4 text-spy-red" />
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground truncate">{coin.name}</p>
            <p className="text-xs text-muted-foreground">{formatAge(coin.age)}</p>
          </div>
          <div className="flex items-start gap-2">
            {onTogglePin && (
              <Button
                onClick={onTogglePin}
                variant="ghost"
                size="sm"
                className={cn(
                  'h-8 w-8 p-0',
                  isPinned ? 'text-spy-yellow hover:text-spy-yellow/80' : 'text-muted-foreground hover:text-spy-yellow'
                )}
              >
                {isPinned ? <Pin className="h-4 w-4 fill-current" /> : <PinOff className="h-4 w-4" />}
              </Button>
            )}
            <div className="text-right">
              <p className="text-lg font-bold">{formatMoney(coin.price)}</p>
              <p className={cn(
                'text-sm font-medium',
                coin.priceChange24h > 0 ? 'text-spy-green' : 'text-spy-red'
              )}>
                {coin.priceChange24h > 0 ? '+' : ''}{coin.priceChange24h.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">MC: {formatMoney(coin.marketCap)}</p>
              <p className="text-xs text-muted-foreground">Liq: {formatMoney(coin.liquidity)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{coin.holders?.total || 0} holders</p>
              <p className="text-xs text-muted-foreground">
                Top: {((coin.holders?.data[0]?.percent || 0) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Risk & Reward Gauges */}
        <div className="space-y-3">
          <RiskGauge value={coin.riskScore} type="risk" size="sm" />
          <RiskGauge value={coin.rewardScore} type="reward" size="sm" />
          <RiskGauge value={coin.legitScore} type="legit" size="sm" />
        </div>

        {/* Quick Status Badges */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className={cn('text-xs', riskLevel.color, 'text-white')}>
            {riskLevel.level} Risk
          </Badge>
          <Badge variant="outline" className={cn('text-xs', rewardLevel.color, 'text-white')}>
            {rewardLevel.level} Reward
          </Badge>
          {coin.legitScore >= 7 && (
            <Badge variant="outline" className="text-xs bg-spy-green text-white">
              ✓ Legit
            </Badge>
          )}
          {coin.volume24h > 500000 && (
            <Badge variant="outline" className="text-xs bg-spy-blue text-white">
              🔥 Hot
            </Badge>
          )}
        </div>

        {/* Investment Recommendation */}
        {coin.recommendation && (
          <div className={cn(
            'p-3 rounded-lg spy-border',
            coin.recommendation.shouldInvest ? 'bg-spy-green/10' : 'bg-spy-red/10'
          )}>
            <p className="text-sm font-medium mb-1">
              {coin.recommendation.shouldInvest ? '✅ Recommended' : '❌ Avoid'}
            </p>
            {coin.recommendation.shouldInvest && (
              <p className="text-sm text-spy-green font-bold">
                Suggested: {formatMoney(coin.recommendation.suggestedAmount)}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {coin.recommendation.reasoning}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => onScan(coin)}
            disabled={isScanning}
            className="flex-1 spy-gradient hover:opacity-90"
            size="sm"
          >
            {isScanning ? 'Scanning...' : '🔍 Deep Scan'}
          </Button>
          
          {coin.dexScreenerUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(coin.dexScreenerUrl, '_blank')}
              className="spy-border"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};