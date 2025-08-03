import { useEffect, useState, useMemo } from "react";
import { useBirdeyePolling } from "@/hooks/useHeliusPolling";
import { Sparkles, TrendingUp, TrendingDown, Zap } from "lucide-react";

interface BubbleData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  age: number;
  x: number;
  y: number;
  size: number;
  color: string;
  gradient: string;
  pulse: boolean;
  trail: { x: number; y: number }[];
}

const CryptoBubbles = () => {
  const { coins, isLoading } = useBirdeyePolling();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: Math.min(600, window.innerHeight * 0.6)
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const processedBubbles = useMemo(() => {
    if (!coins.length || dimensions.width === 0) return [];

    // Filter for coins created in the last 30 days (2,592,000 seconds)
    const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
    const newCoins = coins.filter(coin => coin.age <= thirtyDaysInSeconds);

    if (newCoins.length === 0) return [];

    const maxMarketCap = Math.max(...newCoins.map(coin => coin.marketCap || 0));
    const minSize = 40;
    const maxSize = 150;

    return newCoins.slice(0, 30).map((coin, index) => {
      const marketCapRatio = (coin.marketCap || 0) / maxMarketCap;
      const size = minSize + (maxSize - minSize) * marketCapRatio;
      
      // Generate vibrant colors and gradients based on 24h change
      const change = coin.priceChange24h || 0;
      const ageInDays = coin.age / (24 * 60 * 60);
      
      let color, gradient;
      if (change > 50) {
        color = "#00ff88";
        gradient = "url(#moonGreen)";
      } else if (change > 20) {
        color = "#10b981";
        gradient = "url(#hotGreen)";
      } else if (change > 5) {
        color = "#22c55e";
        gradient = "url(#warmGreen)";
      } else if (change > 0) {
        color = "#65a30d";
        gradient = "url(#neutralGreen)";
      } else if (change > -10) {
        color = "#f59e0b";
        gradient = "url(#warning)";
      } else if (change > -25) {
        color = "#dc2626";
        gradient = "url(#danger)";
      } else {
        color = "#7f1d1d";
        gradient = "url(#critical)";
      }

      // Very new coins (< 1 day) get special treatment
      const isVeryNew = ageInDays < 1;
      const pulse = isVeryNew || Math.abs(change) > 30;

      return {
        id: coin.address,
        symbol: coin.symbol,
        name: coin.name,
        price: coin.price,
        change24h: change,
        marketCap: coin.marketCap || 0,
        age: coin.age,
        x: Math.random() * (dimensions.width - size),
        y: Math.random() * (dimensions.height - size),
        size,
        color,
        gradient,
        pulse,
        trail: []
      };
    });
  }, [coins, dimensions]);

  useEffect(() => {
    setBubbles(processedBubbles);
  }, [processedBubbles]);

  useEffect(() => {
    if (bubbles.length === 0) return;

    const interval = setInterval(() => {
      setBubbles(prev => prev.map(bubble => {
        const newX = Math.max(bubble.size/2, Math.min(dimensions.width - bubble.size/2, bubble.x + (Math.random() - 0.5) * 3));
        const newY = Math.max(bubble.size/2, Math.min(dimensions.height - bubble.size/2, bubble.y + (Math.random() - 0.5) * 3));
        
        // Update trail
        const newTrail = [...bubble.trail, { x: bubble.x, y: bubble.y }].slice(-3);
        
        return {
          ...bubble,
          x: newX,
          y: newY,
          trail: newTrail
        };
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, [bubbles.length, dimensions]);

  const newCoinsCount = useMemo(() => {
    const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
    return coins.filter(coin => coin.age <= thirtyDaysInSeconds).length;
  }, [coins]);

  if (isLoading) {
    return (
      <div className="relative w-full h-96 bg-gradient-to-br from-background via-primary/10 to-background overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-3 text-foreground">
            <Sparkles className="w-6 h-6 animate-pulse text-primary" />
            <span className="text-xl font-medium">Scanning fresh meme coins...</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background border border-border/20 rounded-xl">
      {/* Header with stats */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border/20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {newCoinsCount} Fresh Memes (30 Days)
          </span>
        </div>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-muted-foreground">Live</span>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 bg-card/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-border/20">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-muted-foreground">Pumping</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span className="text-muted-foreground">Dumping</span>
          </div>
        </div>
      </div>

      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="block"
        style={{ background: 'transparent' }}
      >
        {/* Define gradients for bubbles */}
        <defs>
          <radialGradient id="moonGreen" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#00ff88" stopOpacity="1" />
            <stop offset="70%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#065f46" stopOpacity="0.6" />
          </radialGradient>
          <radialGradient id="hotGreen" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="1" />
            <stop offset="70%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#064e3b" stopOpacity="0.6" />
          </radialGradient>
          <radialGradient id="warmGreen" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="1" />
            <stop offset="70%" stopColor="#22c55e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#166534" stopOpacity="0.6" />
          </radialGradient>
          <radialGradient id="neutralGreen" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#84cc16" stopOpacity="1" />
            <stop offset="70%" stopColor="#65a30d" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#365314" stopOpacity="0.6" />
          </radialGradient>
          <radialGradient id="warning" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#92400e" stopOpacity="0.6" />
          </radialGradient>
          <radialGradient id="danger" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#f87171" stopOpacity="1" />
            <stop offset="70%" stopColor="#dc2626" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.6" />
          </radialGradient>
          <radialGradient id="critical" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#991b1b" stopOpacity="1" />
            <stop offset="70%" stopColor="#7f1d1d" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#450a0a" stopOpacity="0.6" />
          </radialGradient>
          
          {/* Glow filters */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
          
          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>

        {/* Render bubble trails */}
        {bubbles.map((bubble) => (
          <g key={`${bubble.id}-trail`}>
            {bubble.trail.map((point, i) => (
              <circle
                key={i}
                cx={point.x + bubble.size / 2}
                cy={point.y + bubble.size / 2}
                r={(bubble.size / 6) * (i + 1) / bubble.trail.length}
                fill={bubble.color}
                opacity={0.2 * (i + 1) / bubble.trail.length}
              />
            ))}
          </g>
        ))}

        {/* Render main bubbles */}
        {bubbles.map((bubble) => {
          const ageInDays = bubble.age / (24 * 60 * 60);
          const isVeryNew = ageInDays < 1;
          const centerX = bubble.x + bubble.size / 2;
          const centerY = bubble.y + bubble.size / 2;
          const radius = bubble.size / 2;

          return (
            <g key={bubble.id} className="cursor-pointer group">
              {/* Outer glow for very new coins */}
              {isVeryNew && (
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={radius + 8}
                  fill="none"
                  stroke="#00ff88"
                  strokeWidth="2"
                  opacity="0.6"
                  className="animate-pulse"
                />
              )}

              {/* Main bubble */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill={bubble.gradient}
                stroke={isVeryNew ? "#00ff88" : "#ffffff20"}
                strokeWidth={isVeryNew ? "2" : "1"}
                opacity="0.9"
                filter={bubble.pulse ? "url(#strongGlow)" : "url(#glow)"}
                className={`transition-all duration-1500 ease-in-out group-hover:opacity-100 ${
                  bubble.pulse ? "animate-pulse" : ""
                }`}
              />

              {/* Symbol text */}
              <text
                x={centerX}
                y={centerY - radius * 0.1}
                textAnchor="middle"
                className="fill-white text-xs font-bold pointer-events-none drop-shadow-lg"
                fontSize={Math.max(8, radius * 0.25)}
              >
                {bubble.symbol}
              </text>

              {/* Change percentage */}
              <text
                x={centerX}
                y={centerY + radius * 0.3}
                textAnchor="middle"
                className="fill-white text-xs pointer-events-none drop-shadow-lg"
                fontSize={Math.max(6, radius * 0.2)}
              >
                {bubble.change24h > 0 ? '+' : ''}{bubble.change24h.toFixed(1)}%
              </text>

              {/* Age indicator for very new coins */}
              {isVeryNew && (
                <g>
                  <circle
                    cx={centerX + radius * 0.6}
                    cy={centerY - radius * 0.6}
                    r="6"
                    fill="#00ff88"
                    className="animate-pulse"
                  />
                  <text
                    x={centerX + radius * 0.6}
                    y={centerY - radius * 0.6 + 2}
                    textAnchor="middle"
                    className="fill-black text-xs font-bold pointer-events-none"
                    fontSize="8"
                  >
                    ✨
                  </text>
                </g>
              )}

              {/* Trend arrow for significant changes */}
              {Math.abs(bubble.change24h) > 20 && (
                <g>
                  <circle
                    cx={centerX - radius * 0.6}
                    cy={centerY - radius * 0.6}
                    r="8"
                    fill={bubble.change24h > 0 ? "#10b981" : "#dc2626"}
                    opacity="0.9"
                  />
                  <text
                    x={centerX - radius * 0.6}
                    y={centerY - radius * 0.6 + 2}
                    textAnchor="middle"
                    className="fill-white text-xs font-bold pointer-events-none"
                    fontSize="10"
                  >
                    {bubble.change24h > 0 ? '🚀' : '💥'}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Empty state */}
      {bubbles.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">No fresh meme coins found</p>
            <p className="text-sm text-muted-foreground">Waiting for new launches in the last 30 days...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoBubbles;