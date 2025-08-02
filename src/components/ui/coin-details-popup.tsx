import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  BarChart3,
  Clock,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';
import type { MemeCoin } from '@/types/meme-coin';

interface CoinDetailsPopupProps {
  coin: MemeCoin | null;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CoinDetailsPopup: React.FC<CoinDetailsPopupProps> = ({ 
  coin, 
  children, 
  open, 
  onOpenChange 
}) => {
  const formatMoney = (amount: number): string => {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
    if (amount >= 1) return `$${amount.toFixed(2)}`;
    if (amount >= 0.01) return `$${amount.toFixed(4)}`;
    if (amount >= 0.000001) return `$${amount.toFixed(8)}`;
    return `$${amount.toExponential(3)}`;
  };

  const formatAge = (ageInSeconds: number): string => {
    const minutes = Math.floor(ageInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const getRiskLevel = (score: number): { label: string, color: string } => {
    if (score <= 2) return { label: 'Very Low', color: 'text-green-500' };
    if (score <= 4) return { label: 'Low', color: 'text-green-400' };
    if (score <= 6) return { label: 'Medium', color: 'text-yellow-500' };
    if (score <= 8) return { label: 'High', color: 'text-orange-500' };
    return { label: 'Very High', color: 'text-red-500' };
  };

  // Early return if no coin is provided
  if (!coin) {
    return null;
  }

  const riskLevel = getRiskLevel(coin.riskScore);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 spy-border bg-card/95 backdrop-blur-lg" side="right">
        <Card className="border-0 bg-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {coin.symbol.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <div className="font-bold">{coin.symbol}</div>
                  <div className="text-sm text-muted-foreground">{coin.name}</div>
                </div>
              </div>
              <Badge variant={coin.priceChange1h >= 0 ? "default" : "destructive"}>
                {coin.priceChange1h >= 0 ? '+' : ''}{coin.priceChange1h.toFixed(1)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Price and Market Data */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <DollarSign className="h-3 w-3" />
                  Price
                </div>
                <div className="font-mono font-bold">{formatMoney(coin.price)}</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <BarChart3 className="h-3 w-3" />
                  Market Cap
                </div>
                <div className="font-mono font-bold">{formatMoney(coin.marketCap)}</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Zap className="h-3 w-3" />
                  Volume 24h
                </div>
                <div className="font-mono font-bold">{formatMoney(coin.volume24h)}</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  Holders
                </div>
                <div className="font-mono font-bold">
                  {coin.holders?.total.toLocaleString() || 'N/A'}
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="space-y-2">
              <div className="text-sm font-semibold">Risk Assessment</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center space-y-1">
                  <div className="text-xs text-muted-foreground">Risk</div>
                  <div className={cn("text-sm font-bold", riskLevel.color)}>
                    {coin.riskScore.toFixed(1)}/10
                  </div>
                  <div className="text-xs">{riskLevel.label}</div>
                </div>
                
                <div className="text-center space-y-1">
                  <div className="text-xs text-muted-foreground">Reward</div>
                  <div className="text-sm font-bold text-green-500">
                    {coin.rewardScore.toFixed(1)}/10
                  </div>
                  <div className="text-xs">
                    {coin.rewardScore > 7 ? 'High' : coin.rewardScore > 4 ? 'Medium' : 'Low'}
                  </div>
                </div>
                
                <div className="text-center space-y-1">
                  <div className="text-xs text-muted-foreground">Legit</div>
                  <div className="text-sm font-bold text-blue-500">
                    {coin.legitScore.toFixed(1)}/10
                  </div>
                  <div className="text-xs">
                    {coin.legitScore > 7 ? 'High' : coin.legitScore > 4 ? 'Medium' : 'Low'}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Changes */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">1h Change</span>
                <div className={cn("flex items-center gap-1", 
                  coin.priceChange1h >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {coin.priceChange1h >= 0 ? 
                    <TrendingUp className="h-3 w-3" /> : 
                    <TrendingDown className="h-3 w-3" />
                  }
                  <span className="text-sm font-mono">
                    {coin.priceChange1h > 0 ? '+' : ''}{coin.priceChange1h.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">24h Change</span>
                <div className={cn("flex items-center gap-1", 
                  coin.priceChange24h >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {coin.priceChange24h >= 0 ? 
                    <TrendingUp className="h-3 w-3" /> : 
                    <TrendingDown className="h-3 w-3" />
                  }
                  <span className="text-sm font-mono">
                    {coin.priceChange24h > 0 ? '+' : ''}{coin.priceChange24h.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Age
                </div>
                <span className="font-mono">{formatAge(coin.age)}</span>
              </div>
              
              {coin.liquidity && (
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Liquidity</span>
                  <span className="font-mono">{formatMoney(coin.liquidity)}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              {coin.dexScreenerUrl && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="flex-1"
                >
                  <a href={coin.dexScreenerUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    DexScreener
                  </a>
                </Button>
              )}
              
              <Button variant="outline" size="sm" className="flex-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Deep Scan
              </Button>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};