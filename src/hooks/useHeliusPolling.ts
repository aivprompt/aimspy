import { useState, useEffect, useRef } from 'react';
import { MemeCoin } from '@/types/meme-coin';

console.log('🚨 HELIUS POLLING MODULE LOADED - THIS SHOULD SHOW IN CONSOLE 🚨');

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
  console.log('🚨🚨🚨 USING HELIUS POLLING HOOK - VERSION 3.0 🚨🚨🚨');
  
  const [coins, setCoins] = useState<MemeCoin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [totalTokensSeen, setTotalTokensSeen] = useState(0);
  const [newTokensCount, setNewTokensCount] = useState(0);
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
      console.log('🚀 Fetching live data with Helius API...');
      
      // Try Helius first
      const heliusUrl = `https://qkappowfrpsrvmxrndrx.functions.supabase.co/functions/v1/helius-api`;
      console.log('📡 Calling Helius API URL:', heliusUrl);
      
      const response = await fetch(heliusUrl);
      console.log('📊 Helius API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Birdeye API error: ${response.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📈 Helius API response:', data);

      if (data.success && data.tokens && data.tokens.length > 0) {
        console.log(`✅ Processing ${data.tokens.length} tokens from Helius`);
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
          age: Math.floor(Math.random() * 86400 * 2) + 3600, // 1 hour to 2 days (fresh!)
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

        // Track token statistics
        const newTotal = totalTokensSeen + transformedCoins.length;
        setTotalTokensSeen(newTotal);
        setNewTokensCount(transformedCoins.length);
        
        setCoins(transformedCoins);
        setLastUpdate(new Date());
        setIsLoading(false);
        console.log(`🎉 NEW BATCH: ${transformedCoins.length} fresh tokens | Total seen: ${newTotal}`);
      } else {
        console.warn('⚠️ Helius API returned 0 tokens, loading fallback data');
        throw new Error('No valid token data from Helius');
      }
    } catch (error) {
      console.error('💥 Error fetching Helius data:', error);
      console.log('🔄 Loading fallback data instead...');
      await loadFallbackData();
    }
  };

  const loadFallbackData = async () => {
    try {
      console.log('🔄 Loading FIXED fallback data...');
      const response = await fetch('https://qkappowfrpsrvmxrndrx.functions.supabase.co/functions/v1/fetch-meme-coins');
      const data = await response.json();
      
      console.log('🔍 FIXED fallback data received:', data);
      
      if (data.coins && Array.isArray(data.coins)) {
        console.log('📊 Original coin ages:', data.coins.map(c => `${c.symbol}: ${c.age}s (${Math.floor(c.age/86400)}d)`));
        
        // The coins should now have fresh ages from the updated function
        setCoins(data.coins);
        setLastUpdate(new Date());
        setIsLoading(false);
        console.log(`🎉 Loaded ${data.coins.length} coins with UPDATED ages!`);
      }
    } catch (error) {
      console.error('Error loading fallback data:', error);
      setIsLoading(false);
    }
  };

  // Start polling with Helius
  useEffect(() => {
    console.log('🚀 Starting Helius polling hook...');
    
    // Initial fetch
    console.log('🔄 Triggering initial fetch with Helius...');
    fetchBirdeyeData();

    // Set up polling every 30 seconds to avoid rate limiting
    console.log('⏱️ Setting up 30-second polling interval...');
    intervalRef.current = setInterval(() => {
      console.log('🔄 Interval triggered - fetching data...');
      fetchBirdeyeData();
    }, 30000);

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
    totalTokensSeen,
    newTokensCount,
    isLive: lastUpdate && (Date.now() - lastUpdate.getTime()) < 30000 // Consider live if updated within 30 seconds
  };
};