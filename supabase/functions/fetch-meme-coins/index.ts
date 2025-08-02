import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Meme coins fetcher function started")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Fetching live Solana meme coins...")
    
    // Fetch from multiple DexScreener endpoints for better data coverage
    const promises = [
      fetch('https://api.dexscreener.com/latest/dex/pairs/solana').catch(e => ({ pairs: [] })),
      fetch('https://api.dexscreener.com/latest/dex/tokens/trending').catch(e => ({ pairs: [] })),
      fetch('https://api.dexscreener.com/latest/dex/search/?q=solana').catch(e => ({ pairs: [] }))
    ];

    const responses = await Promise.all(promises);
    let allPairs: any[] = [];

    // Collect all pairs from different endpoints
    for (const response of responses) {
      if (response && typeof response.json === 'function') {
        const data = await response.json();
        if (data.pairs) {
          // Filter for Solana pairs only
          const solanaPairs = data.pairs.filter((p: any) => p.chainId === 'solana');
          allPairs = [...allPairs, ...solanaPairs];
        }
      } else if (response && response.pairs) {
        const solanaPairs = response.pairs.filter((p: any) => p.chainId === 'solana');
        allPairs = [...allPairs, ...solanaPairs];
      }
    }

    console.log(`Total pairs collected: ${allPairs.length}`);

    // Remove duplicates based on baseToken address
    const uniquePairs = allPairs.filter((pair, index, self) => 
      index === self.findIndex(p => p.baseToken?.address === pair.baseToken?.address)
    );

    console.log(`Unique pairs after deduplication: ${uniquePairs.length}`);

    // Filter for interesting meme coins with less strict criteria
    const filteredPairs = uniquePairs.filter((pair: any) => {
      const marketCap = pair.fdv || pair.marketCap || 0;
      const volume = pair.volume?.h24 || 0;
      const liquidity = pair.liquidity?.usd || 0;
      
      return (
        pair.baseToken && 
        pair.baseToken.symbol &&
        pair.baseToken.symbol !== 'SOL' &&
        pair.baseToken.symbol !== 'USDC' &&
        pair.baseToken.symbol !== 'USDT' &&
        marketCap > 1000 && // Min $1k market cap
        marketCap < 50000000 && // Max $50M market cap
        liquidity > 500 && // Min $500 liquidity
        volume > 100 // Min $100 24h volume
      );
    });

    console.log(`Filtered pairs: ${filteredPairs.length}`);

    // Sort by volume and market cap for quality
    filteredPairs.sort((a: any, b: any) => {
      const aScore = (a.volume?.h24 || 0) + (a.fdv || 0) * 0.1;
      const bScore = (b.volume?.h24 || 0) + (b.fdv || 0) * 0.1;
      return bScore - aScore;
    });

    // Process the top pairs into our format
    const coins = filteredPairs.slice(0, 20).map((pair: any) => {
      const ageInSeconds = pair.pairCreatedAt ? 
        Math.floor((Date.now() - pair.pairCreatedAt) / 1000) : 
        Math.floor(Math.random() * 86400) + 3600; // Random age if not available

      const coin = {
        address: pair.baseToken.address,
        symbol: pair.baseToken.symbol || 'UNKNOWN',
        name: pair.baseToken.name || pair.baseToken.symbol || 'Unknown Token',
        marketCap: pair.fdv || pair.marketCap || 0,
        price: parseFloat(pair.priceUsd || '0'),
        priceChange1h: parseFloat(pair.priceChange?.h1 || '0'),
        priceChange24h: parseFloat(pair.priceChange?.h24 || '0'),
        volume24h: parseFloat(pair.volume?.h24 || '0'),
        liquidity: parseFloat(pair.liquidity?.usd || '0'),
        age: ageInSeconds,
        holders: generateMockHolderData(), // We'll use mock holder data for now
        legitScore: 0,
        riskScore: 0,
        rewardScore: 0,
        dexScreenerUrl: pair.url
      };

      // Calculate scores
      coin.legitScore = calculateLegitScore(coin);
      coin.riskScore = calculateRiskScore(coin);
      coin.rewardScore = calculateRewardScore(coin);

      return coin;
    });

    console.log(`Final processed coins: ${coins.length}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        coins,
        timestamp: new Date().toISOString(),
        source: 'live_dexscreener'
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      },
    );

  } catch (error) {
    console.error('Error fetching meme coins:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        coins: [], // Return empty array on error so frontend can handle
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      },
    );
  }
});

function generateMockHolderData() {
  const total = Math.floor(Math.random() * 2000) + 100;
  const data = [];
  
  for (let i = 0; i < 10; i++) {
    data.push({
      address: generateRandomAddress(),
      percent: Math.random() * (i === 0 ? 0.3 : 0.05),
      amount: Math.floor(Math.random() * 1000000)
    });
  }
  
  return { total, data };
}

function generateRandomAddress(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function calculateLegitScore(coin: any): number {
  let score = 0;
  
  if (coin.holders && coin.holders.total > 500) score += 2;
  if (coin.holders && coin.holders.total > 1000) score += 1;
  
  if (coin.holders && coin.holders.data.length > 0) {
    const topHolderPercent = coin.holders.data[0].percent;
    if (topHolderPercent < 0.1) score += 3;
    else if (topHolderPercent < 0.2) score += 2;
    else if (topHolderPercent < 0.3) score += 1;
  }
  
  if (coin.liquidity > 50000) score += 2;
  if (coin.liquidity > 100000) score += 1;
  
  const ageInHours = coin.age / 3600;
  if (ageInHours > 12) score += 1;
  if (ageInHours > 24) score += 1;
  
  return Math.min(score, 10);
}

function calculateRiskScore(coin: any): number {
  let risk = 0;
  
  if (coin.legitScore < 3) risk += 4;
  if (coin.liquidity < 10000) risk += 3;
  if (Math.abs(coin.priceChange1h) > 50) risk += 2;
  if (coin.holders && coin.holders.data[0]?.percent > 0.5) risk += 3;
  
  const ageInHours = coin.age / 3600;
  if (ageInHours < 6) risk += 2;
  if (ageInHours < 1) risk += 2;
  
  return Math.min(risk, 10);
}

function calculateRewardScore(coin: any): number {
  let reward = 0;
  
  if (coin.priceChange1h > 10) reward += 2;
  if (coin.priceChange24h > 20) reward += 2;
  if (coin.volume24h > 100000) reward += 3;
  if (coin.volume24h > 500000) reward += 2;
  
  if (coin.marketCap > 100000 && coin.marketCap < 500000) reward += 2;
  
  if (coin.holders && coin.holders.total > 1000) reward += 1;
  
  return Math.min(reward, 10);
}