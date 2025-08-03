import { useEffect, useState, useMemo } from "react";
import { useBirdeyePolling } from "@/hooks/useHeliusPolling";

interface BubbleData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  x: number;
  y: number;
  size: number;
  color: string;
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

    const maxMarketCap = Math.max(...coins.map(coin => coin.marketCap || 0));
    const minSize = 30;
    const maxSize = 120;

    return coins.slice(0, 50).map((coin, index) => {
      const marketCapRatio = (coin.marketCap || 0) / maxMarketCap;
      const size = minSize + (maxSize - minSize) * marketCapRatio;
      
      // Generate color based on 24h change
      const change = coin.priceChange24h || 0;
      let color;
      if (change > 20) color = "#10b981"; // green-500
      else if (change > 5) color = "#22c55e"; // green-400
      else if (change > 0) color = "#65a30d"; // lime-600
      else if (change > -5) color = "#dc2626"; // red-600
      else if (change > -20) color = "#b91c1c"; // red-700
      else color = "#7f1d1d"; // red-900

      return {
        id: coin.address,
        symbol: coin.symbol,
        name: coin.name,
        price: coin.price,
        change24h: change,
        marketCap: coin.marketCap || 0,
        x: Math.random() * (dimensions.width - size),
        y: Math.random() * (dimensions.height - size),
        size,
        color
      };
    });
  }, [coins, dimensions]);

  useEffect(() => {
    setBubbles(processedBubbles);
  }, [processedBubbles]);

  useEffect(() => {
    if (bubbles.length === 0) return;

    const interval = setInterval(() => {
      setBubbles(prev => prev.map(bubble => ({
        ...bubble,
        x: Math.max(0, Math.min(dimensions.width - bubble.size, bubble.x + (Math.random() - 0.5) * 2)),
        y: Math.max(0, Math.min(dimensions.height - bubble.size, bubble.y + (Math.random() - 0.5) * 2))
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, [bubbles.length, dimensions]);

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading crypto bubbles...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="block"
        style={{ background: 'transparent' }}
      >
        {bubbles.map((bubble) => (
          <g key={bubble.id}>
            <circle
              cx={bubble.x + bubble.size / 2}
              cy={bubble.y + bubble.size / 2}
              r={bubble.size / 2}
              fill={bubble.color}
              opacity={0.8}
              stroke="#ffffff"
              strokeWidth={1}
              className="transition-all duration-2000 ease-in-out cursor-pointer hover:opacity-100"
            />
            <text
              x={bubble.x + bubble.size / 2}
              y={bubble.y + bubble.size / 2 - 5}
              textAnchor="middle"
              className="fill-white text-xs font-bold pointer-events-none"
              fontSize={Math.max(10, bubble.size / 8)}
            >
              {bubble.symbol}
            </text>
            <text
              x={bubble.x + bubble.size / 2}
              y={bubble.y + bubble.size / 2 + 8}
              textAnchor="middle"
              className="fill-white text-xs pointer-events-none"
              fontSize={Math.max(8, bubble.size / 10)}
            >
              {bubble.change24h > 0 ? '+' : ''}{bubble.change24h.toFixed(1)}%
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default CryptoBubbles;