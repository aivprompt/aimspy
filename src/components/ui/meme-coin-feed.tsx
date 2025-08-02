import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CoinDetailsPopup } from '@/components/ui/coin-details-popup';
import { cn } from '@/lib/utils';
import { useLiveMemeCoinFeed } from '@/hooks/useLiveMemeCoinFeed';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap,
  DollarSign,
  BarChart3,
  Users,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';
import type { MemeCoin } from '@/types/meme-coin';

interface MemeCoinFeedProps {
  className?: string;
}

export const MemeCoinFeed: React.FC<MemeCoinFeedProps> = ({ className }) => {
  const [selectedCoin, setSelectedCoin] = useState<MemeCoin | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  const { coins, isConnected, connectionStatus } = useLiveMemeCoinFeed();

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
    const hours = Math.floor(ageInSeconds / 3600);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d`;
    return `${hours}h`;
  };

  const handleCoinClick = (coin: MemeCoin) => {
    setSelectedCoin(coin);
    setPopoverOpen(true);
  };

  return (
    <Card className={cn("spy-border bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          {isConnected ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          Live Meme Coin Feed
          <Badge 
            variant="outline" 
            className={cn("ml-auto", {
              "text-green-500 border-green-500": connectionStatus === 'live',
              "text-yellow-500 border-yellow-500": connectionStatus === 'connected',
              "text-red-500 border-red-500": connectionStatus === 'error',
              "text-gray-500 border-gray-500": connectionStatus === 'disconnected'
            })}
          >
            {connectionStatus.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
        {coins.map((coin, index) => (
          <CoinDetailsPopup
            key={`${coin.symbol}-${index}`}
            coin={selectedCoin}
            open={popoverOpen && selectedCoin?.symbol === coin.symbol}
            onOpenChange={(open) => {
              setPopoverOpen(open);
              if (!open) setSelectedCoin(null);
            }}
          >
            <div
              className="p-3 rounded-lg border border-border/30 bg-muted/20 hover:bg-muted/40 transition-all duration-200 cursor-pointer"
              onClick={() => handleCoinClick(coin)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {coin.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-sm">{coin.symbol}</div>
                    <div className="text-xs text-muted-foreground">{formatAge(coin.age)}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-mono text-sm">{formatMoney(coin.price)}</div>
                  <div className={cn("flex items-center gap-1 text-xs", 
                    coin.priceChange1h >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {coin.priceChange1h >= 0 ? 
                      <TrendingUp className="h-3 w-3" /> : 
                      <TrendingDown className="h-3 w-3" />
                    }
                    {coin.priceChange1h > 0 ? '+' : ''}{coin.priceChange1h.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">MC:</span>
                  <span className="font-mono">{formatMoney(coin.marketCap)}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Vol:</span>
                  <span className="font-mono">{formatMoney(coin.volume24h)}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">H:</span>
                  <span className="font-mono">{coin.holders?.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CoinDetailsPopup>
        ))}
        
        {coins.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="h-8 w-8 mx-auto mb-2 animate-pulse" />
            <p>Scanning for new meme coins...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};