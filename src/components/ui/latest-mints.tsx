import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { MemeCoin } from '@/types/meme-coin';
import { cn } from '@/lib/utils';
import { Clock, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import useSound from 'use-sound';

interface LatestMintsProps {
  coins: MemeCoin[];
  onSelectCoin: (coin: MemeCoin) => void;
  className?: string;
}

export const LatestMints: React.FC<LatestMintsProps> = ({
  coins,
  onSelectCoin,
  className
}) => {
  const [previousCoinsLength, setPreviousCoinsLength] = useState(coins.length);
  const [newCoinAnimations, setNewCoinAnimations] = useState<Set<string>>(new Set());
  
  // Sound effect for new coins
  const [playMintSound] = useSound('/coin-mint.mp3', { volume: 0.5 });

  useEffect(() => {
    // Detect new coins and trigger animation/sound
    if (coins.length > previousCoinsLength) {
      const newCoins = coins.slice(0, coins.length - previousCoinsLength);
      const newAddresses = new Set(newCoins.map(coin => coin.address));
      
      // Play sound for new coins
      playMintSound();
      
      // Add animation for new coins
      setNewCoinAnimations(newAddresses);
      
      // Remove animation after 2 seconds
      setTimeout(() => {
        setNewCoinAnimations(new Set());
      }, 2000);
    }
    
    setPreviousCoinsLength(coins.length);
  }, [coins.length, previousCoinsLength, playMintSound]);

  const formatAge = (ageInSeconds: number) => {
    const minutes = Math.floor(ageInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${ageInSeconds}s ago`;
  };

  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    if (amount >= 1) return `$${amount.toFixed(2)}`;
    if (amount >= 0.01) return `$${amount.toFixed(4)}`;
    if (amount >= 0.000001) return `$${amount.toFixed(8)}`;
    return `$${amount.toExponential(3)}`;
  };

  const getRiskLevel = (score: number) => {
    if (score >= 7) return { label: 'High', color: 'text-red-500' };
    if (score >= 4) return { label: 'Med', color: 'text-yellow-500' };
    return { label: 'Low', color: 'text-green-500' };
  };

  return (
    <Card className={cn("spy-border", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-spy-yellow animate-pulse" />
          Live Minting Feed
          <Badge variant="outline" className="text-xs">
            {coins.length}/20
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
        {coins.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Waiting for new mints...</p>
          </div>
        ) : (
          coins.map((coin) => {
            const risk = getRiskLevel(coin.riskScore);
            const isNewCoin = newCoinAnimations.has(coin.address);
            
            return (
              <div
                key={coin.address}
                className={cn(
                  "relative p-3 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer group",
                  isNewCoin && "animate-[scale-in_0.5s_ease-out,fade-in_0.5s_ease-out] border-spy-green shadow-lg shadow-spy-green/20"
                )}
                onClick={() => onSelectCoin(coin)}
              >
                {/* New coin sparkle animation */}
                {isNewCoin && (
                  <div className="absolute -top-1 -right-1 animate-ping">
                    <div className="h-3 w-3 bg-spy-yellow rounded-full"></div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-2">
                  {/* Coin Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-spy-blue to-spy-green flex items-center justify-center text-white text-xs font-bold">
                    {coin.symbol.slice(0, 2)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {coin.symbol}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", risk.color)}
                        >
                          {risk.label}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatAge(coin.age)}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{coin.name}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Cap:</span>
                    <span className="ml-1 font-medium">{formatMoney(coin.marketCap)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Price:</span>
                    <span className="ml-1 font-medium">${coin.price.toFixed(6)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Liq:</span>
                    <span className="ml-1 font-medium">{formatMoney(coin.liquidity)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">1h:</span>
                    <span className={cn(
                      "ml-1 font-medium flex items-center gap-1",
                      coin.priceChange1h >= 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {coin.priceChange1h >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                      {coin.priceChange1h.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t border-border/50">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      Risk: {coin.riskScore}/10
                    </span>
                    <span className="text-spy-green">
                      Reward: {coin.rewardScore}/10
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};