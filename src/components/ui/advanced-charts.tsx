import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CoinDetailsPopup } from '@/components/ui/coin-details-popup';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart,
  Activity,
  Zap,
  Target,
  Eye
} from 'lucide-react';
import type { MemeCoin } from '@/types/meme-coin';

interface ChartPanelProps {
  className?: string;
}

interface DataPoint {
  value: number;
  timestamp: number;
}

export const RealtimeChartPanel: React.FC<ChartPanelProps> = ({ className }) => {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [currentValue, setCurrentValue] = useState(847);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('up');

  useEffect(() => {
    // Initialize with some data points
    const initialPoints = Array.from({ length: 20 }, (_, i) => ({
      value: 800 + Math.random() * 100,
      timestamp: Date.now() - (20 - i) * 2000
    }));
    setDataPoints(initialPoints);

    const interval = setInterval(() => {
      const newValue = currentValue + (Math.random() - 0.5) * 50;
      const newPoint = {
        value: newValue,
        timestamp: Date.now()
      };

      setDataPoints(prev => {
        const updated = [...prev.slice(1), newPoint];
        return updated;
      });

      setTrend(newValue > currentValue ? 'up' : newValue < currentValue ? 'down' : 'stable');
      setCurrentValue(newValue);
    }, 2000);

    return () => clearInterval(interval);
  }, [currentValue]);

  const maxValue = Math.max(...dataPoints.map(p => p.value));
  const minValue = Math.min(...dataPoints.map(p => p.value));
  const range = maxValue - minValue;

  const createPath = () => {
    if (dataPoints.length < 2) return '';
    
    const width = 100;
    const height = 40;
    
    const points = dataPoints.map((point, index) => {
      const x = (index / (dataPoints.length - 1)) * width;
      const y = height - ((point.value - minValue) / range) * height;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  return (
    <Card className={cn("spy-border bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4 text-primary animate-pulse" />
          Real-time Analytics
          <Badge variant="outline" className="ml-auto">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-mono font-bold flex items-center gap-2">
              {Math.round(currentValue).toLocaleString()}
              {trend === 'up' && <TrendingUp className="h-5 w-5 text-green-500" />}
              {trend === 'down' && <TrendingDown className="h-5 w-5 text-red-500" />}
            </div>
            <div className="text-xs text-muted-foreground">Transactions/Hour</div>
          </div>
        </div>

        <div className="relative h-20 bg-muted/20 rounded border overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Fill area */}
            <path
              d={`${createPath()} L 100,40 L 0,40 Z`}
              fill="url(#chartGradient)"
            />
            
            {/* Line */}
            <path
              d={createPath()}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
            />
            
            {/* Animated dots */}
            {dataPoints.slice(-5).map((point, index) => {
              const x = ((dataPoints.length - 5 + index) / (dataPoints.length - 1)) * 100;
              const y = 40 - ((point.value - minValue) / range) * 40;
              return (
                <circle
                  key={point.timestamp}
                  cx={x}
                  cy={y}
                  r="0.5"
                  fill="hsl(var(--primary))"
                  opacity={0.6 + index * 0.1}
                />
              );
            })}
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-mono text-green-500">{Math.round(maxValue)}</div>
            <div className="text-muted-foreground">Peak</div>
          </div>
          <div className="text-center">
            <div className="font-mono">{Math.round((maxValue + minValue) / 2)}</div>
            <div className="text-muted-foreground">Avg</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-red-500">{Math.round(minValue)}</div>
            <div className="text-muted-foreground">Low</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const CircularProgressPanel: React.FC<ChartPanelProps> = ({ className }) => {
  const [progress, setProgress] = useState(68);
  const [subMetrics, setSubMetrics] = useState([45, 78, 23]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => Math.max(20, Math.min(95, prev + (Math.random() - 0.5) * 10)));
      setSubMetrics(prev => prev.map(metric => 
        Math.max(10, Math.min(90, metric + (Math.random() - 0.5) * 8))
      ));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className={cn("spy-border bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Target className="h-4 w-4 text-primary" />
          System Performance
          <Badge variant="outline" className="ml-auto">
            {progress > 80 ? "Optimal" : progress > 60 ? "Good" : "Warning"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
              />
              
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000"
              />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-mono font-bold">{Math.round(progress)}%</div>
                <div className="text-xs text-muted-foreground">Overall</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {['CPU', 'RAM', 'I/O'].map((label, index) => (
            <div key={label} className="text-center space-y-1">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000"
                  style={{ width: `${subMetrics[index]}%` }}
                />
              </div>
              <div className="text-xs font-mono">{Math.round(subMetrics[index])}%</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-primary animate-pulse" />
            <span className="text-xs text-muted-foreground">Auto-optimizing</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface LiveCoin extends Partial<MemeCoin> {
  symbol: string;
  image: string;
  activity: number;
  change24h: number;
}

export const HeatmapPanel: React.FC<ChartPanelProps> = ({ className }) => {
  const [liveCoins, setLiveCoins] = useState<LiveCoin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<MemeCoin | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    // Initialize with mock data - in real app this would fetch from MemeSpyAPI
    const generateMockCoins = (): LiveCoin[] => {
      const symbols = ['PEPE', 'DOGE', 'SHIB', 'FLOKI', 'BONK', 'WIF', 'BOME', 'MEW', 'POPCAT', 'BRETT', 'PONKE', 'MOUTAI', 'MYRO', 'SLERF', 'BODEN', 'TREMP', 'SMOG', 'PEPED', 'APED', 'NEIRO', 'MOODENG', 'GIGA', 'RETARD', 'WOJAK'];
      return Array.from({ length: 24 }, (_, i) => {
        const basePrice = Math.random() * 10;
        const marketCap = Math.random() * 1000000000;
        return {
          symbol: symbols[i] || `COIN${i}`,
          image: `https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?w=32&h=32&fit=crop&crop=face`,
          activity: Math.random() * 100,
          change24h: (Math.random() - 0.5) * 200,
          // Additional MemeCoin properties for popup
          address: `${symbols[i] || `COIN${i}`}Address${i}`,
          name: `${symbols[i] || `Coin ${i}`} Token`,
          price: basePrice,
          priceChange1h: (Math.random() - 0.5) * 20,
          priceChange24h: (Math.random() - 0.5) * 200,
          volume24h: Math.random() * 50000000,
          liquidity: Math.random() * 10000000,
          age: Math.random() * 2592000, // Up to 30 days
          marketCap,
          holders: {
            total: Math.floor(Math.random() * 10000) + 100,
            data: []
          },
          legitScore: Math.random() * 10,
          riskScore: Math.random() * 10,
          rewardScore: Math.random() * 10,
          dexScreenerUrl: `https://dexscreener.com/solana/${symbols[i] || `coin${i}`}`
        };
      });
    };

    setLiveCoins(generateMockCoins());

    const interval = setInterval(() => {
      setLiveCoins(prev => 
        prev.map(coin => ({
          ...coin,
          activity: Math.max(0, Math.min(100, coin.activity + (Math.random() - 0.5) * 20)),
          change24h: Math.max(-100, Math.min(100, coin.change24h + (Math.random() - 0.5) * 20))
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getActivityClass = (activity: number) => {
    if (activity > 80) return 'bg-red-500/80 animate-pulse';
    if (activity > 60) return 'bg-orange-500/70';
    if (activity > 40) return 'bg-yellow-500/60';
    if (activity > 20) return 'bg-green-500/50';
    return 'bg-blue-500/40';
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const handleCoinClick = (coin: LiveCoin) => {
    const memeCoin: MemeCoin = {
      address: coin.address || `${coin.symbol}Address`,
      symbol: coin.symbol,
      name: coin.name || `${coin.symbol} Token`,
      marketCap: coin.marketCap || Math.random() * 1000000000,
      price: coin.price || Math.random() * 10,
      priceChange1h: coin.priceChange1h || (Math.random() - 0.5) * 20,
      priceChange24h: coin.priceChange24h || coin.change24h,
      volume24h: coin.volume24h || Math.random() * 50000000,
      liquidity: coin.liquidity || Math.random() * 10000000,
      age: coin.age || Math.random() * 2592000,
      holders: coin.holders || {
        total: Math.floor(Math.random() * 10000) + 100,
        data: []
      },
      legitScore: coin.legitScore || Math.random() * 10,
      riskScore: coin.riskScore || Math.random() * 10,
      rewardScore: coin.rewardScore || Math.random() * 10,
      dexScreenerUrl: coin.dexScreenerUrl
    };
    setSelectedCoin(memeCoin);
    setPopoverOpen(true);
  };

  return (
    <Card className={cn("spy-border bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <BarChart3 className="h-4 w-4 text-primary animate-pulse" />
          Live Meme Coin Activity
          <Badge variant="outline" className="ml-auto animate-pulse">LIVE</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-6 gap-1">
          {liveCoins.map((coin, index) => (
            <CoinDetailsPopup
              key={`${coin.symbol}-${index}`}
              coin={selectedCoin as MemeCoin}
              open={popoverOpen && selectedCoin?.symbol === coin.symbol}
              onOpenChange={(open) => {
                setPopoverOpen(open);
                if (!open) setSelectedCoin(null);
              }}
            >
              <div
                className={cn(
                  "relative aspect-square rounded-lg border border-border/20 overflow-hidden transition-all duration-1000 hover:scale-105 cursor-pointer",
                  getActivityClass(coin.activity)
                )}
                onClick={() => handleCoinClick(coin)}
                title={`${coin.symbol}: ${coin.activity.toFixed(1)}% activity, ${coin.change24h > 0 ? '+' : ''}${coin.change24h.toFixed(1)}%`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                  <div className="w-6 h-6 rounded-full bg-muted/80 border border-border/40 flex items-center justify-center mb-1">
                    <span className="text-[8px] font-bold text-foreground/80">
                      {coin.symbol.slice(0, 3)}
                    </span>
                  </div>
                  <div className={cn("text-[7px] font-mono font-bold", getChangeColor(coin.change24h))}>
                    {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(0)}%
                  </div>
                </div>
                
                {/* Activity intensity overlay */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"
                  style={{ opacity: Math.max(0.2, coin.activity / 100) }}
                />
              </div>
            </CoinDetailsPopup>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Cool</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-blue-500/40" />
            <div className="w-3 h-3 rounded-sm bg-green-500/50" />
            <div className="w-3 h-3 rounded-sm bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-sm bg-orange-500/70" />
            <div className="w-3 h-3 rounded-sm bg-red-500/80 animate-pulse" />
          </div>
          <span className="text-muted-foreground">Hot 🔥</span>
        </div>

        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Hottest Coin</span>
            <span className="font-mono text-red-400">
              {liveCoins.reduce((hottest, coin) => 
                coin.activity > hottest.activity ? coin : hottest, 
                liveCoins[0] || { symbol: 'N/A', activity: 0 }
              ).symbol}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const MiniChartGrid: React.FC<ChartPanelProps> = ({ className }) => {
  const [chartData, setChartData] = useState<{ [key: string]: number[] }>({});

  useEffect(() => {
    const charts = ['BTC', 'ETH', 'SOL', 'MATIC'];
    const initData = charts.reduce((acc, chart) => {
      acc[chart] = Array.from({ length: 10 }, () => Math.random() * 100 + 50);
      return acc;
    }, {} as { [key: string]: number[] });
    
    setChartData(initData);

    const interval = setInterval(() => {
      setChartData(prev => {
        const updated = { ...prev };
        charts.forEach(chart => {
          updated[chart] = [
            ...updated[chart].slice(1),
            updated[chart][updated[chart].length - 1] + (Math.random() - 0.5) * 10
          ];
        });
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const createMiniPath = (data: number[]) => {
    if (data.length < 2) return '';
    
    const maxVal = Math.max(...data);
    const minVal = Math.min(...data);
    const range = maxVal - minVal || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60;
      const y = 20 - ((value - minVal) / range) * 20;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  return (
    <Card className={cn("spy-border bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Eye className="h-4 w-4 text-primary" />
          Market Trackers
          <Badge variant="outline" className="ml-auto">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(chartData).map(([symbol, data]) => {
          const current = data[data.length - 1] || 0;
          const previous = data[data.length - 2] || 0;
          const change = current - previous;
          const isPositive = change >= 0;
          
          return (
            <div key={symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-sm font-bold w-12">{symbol}</div>
                <div className="relative w-16 h-6">
                  <svg className="w-full h-full" viewBox="0 0 60 20" preserveAspectRatio="none">
                    <path
                      d={createMiniPath(data)}
                      fill="none"
                      stroke={isPositive ? "hsl(var(--green-500))" : "hsl(var(--red-500))"}
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-sm font-mono">
                  ${current.toFixed(2)}
                </div>
                <div className={cn("flex items-center gap-1 text-xs", 
                  isPositive ? "text-green-500" : "text-red-500"
                )}>
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(change).toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};