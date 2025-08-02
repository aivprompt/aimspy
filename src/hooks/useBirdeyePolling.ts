import { useState, useEffect, useRef } from 'react';
import { MemeCoin } from '@/types/meme-coin';

interface BirdeyeTokenData {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
}

export const useBirdeyePolling = () => {
  const [coins, setCoins] = useState<MemeCoin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Popular Solana meme coin addresses
  const memeTokenAddresses = [
    'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', // WIF
    'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK
    '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', // POPCAT
    'A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump', // PNUT
    'ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82', // BOME
    'HezGkYR4zFrMnzHN5mfTKYrZqiJSVB9c9gHXKRs1E5Ak', // PEPE (Solana)
    'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump', // SHIB (Solana)
  ];

  const fetchBirdeyeData = async () => {
    try {
      console.log('🚀 Fetching Birdeye data with updated API key...');
      
      // Create batch request for multiple tokens
      const tokenParams = memeTokenAddresses.join(',');
      const apiUrl = `https://qkappowfrpsrvmxrndrx.functions.supabase.co/functions/v1/birdeye-api?tokens=${tokenParams}`;
      console.log('📡 Calling API URL:', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('📊 API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Birdeye API error: ${response.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📈 Birdeye API response:', data);

      if (data.success && data.tokens) {
        console.log(`✅ Processing ${data.tokens.length} tokens from Birdeye`);
        const transformedCoins: MemeCoin[] = data.tokens.map((token: BirdeyeTokenData, index: number) => ({
          address: token.address,
          symbol: token.symbol || `TOKEN${index}`,
          name: token.name || token.symbol || `Token ${index}`,
          price: token.price || 0,
          priceChange1h: (token.priceChange24h || 0) / 24, // Approximate 1h from 24h
          priceChange24h: token.priceChange24h || 0,
          volume24h: token.volume24h || 0,
          marketCap: token.marketCap || 0,
          liquidity: token.liquidity || 0,
          age: Math.random() * 86400, // Random age since Birdeye doesn't provide this
          holders: {
            total: Math.floor(Math.random() * 5000) + 500,
            data: []
          },
          legitScore: Math.min(10, Math.max(0, (token.liquidity || 0) / 100000)), // Based on liquidity
          riskScore: Math.min(10, Math.max(0, 10 - (token.liquidity || 0) / 100000)), // Inverse of liquidity
          rewardScore: Math.min(10, Math.max(0, Math.abs(token.priceChange24h || 0) / 10)), // Based on volatility
          dexScreenerUrl: `https://dexscreener.com/solana/${token.address}`,
          lastUpdated: new Date().toISOString()
        }));

        setCoins(transformedCoins);
        setLastUpdate(new Date());
        setIsLoading(false);
        console.log(`🎉 Updated ${transformedCoins.length} coins from Birdeye LIVE DATA!`);
      } else {
        console.warn('⚠️ Birdeye API returned no tokens, using fallback data');
        throw new Error('No valid token data from Birdeye');
      }
    } catch (error) {
      console.error('💥 Error fetching Birdeye data:', error);
      console.log('🔄 Loading fallback data instead...');
      await loadFallbackData();
    }
  };

  const loadFallbackData = async () => {
    try {
      console.log('Loading fallback data from existing API...');
      const response = await fetch('https://qkappowfrpsrvmxrndrx.functions.supabase.co/functions/v1/fetch-meme-coins');
      const data = await response.json();
      
      if (data.coins && Array.isArray(data.coins)) {
        setCoins(data.coins);
        setLastUpdate(new Date());
        setIsLoading(false);
        console.log(`Loaded ${data.coins.length} fallback coins`);
      }
    } catch (error) {
      console.error('Error loading fallback data:', error);
      setIsLoading(false);
    }
  };

  // Start polling
  useEffect(() => {
    console.log('🚀 Starting Birdeye polling hook...');
    
    // Initial fetch
    console.log('🔄 Triggering initial fetch...');
    fetchBirdeyeData();

    // Set up polling every 3 seconds for testing
    console.log('⏱️ Setting up 3-second polling interval...');
    intervalRef.current = setInterval(() => {
      console.log('🔄 Interval triggered - fetching data...');
      fetchBirdeyeData();
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return {
    coins,
    isLoading,
    lastUpdate,
    isLive: lastUpdate && (Date.now() - lastUpdate.getTime()) < 30000 // Consider live if updated within 30 seconds
  };
};