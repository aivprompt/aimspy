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
    
    // First try Helius for truly fresh newly minted tokens
    try {
      console.log("=== CHECKING HELIUS FOR FRESH MINTS ===");
      const heliusResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/helius-api`, {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        }
      });
      
      if (heliusResponse.ok) {
        const heliusData = await heliusResponse.json();
        console.log(`Helius returned ${heliusData.tokens?.length || 0} fresh tokens`);
        
        if (heliusData.tokens && heliusData.tokens.length > 0) {
          // We have fresh tokens! Return them
          console.log("=== RETURNING FRESH HELIUS TOKENS ===");
          return new Response(
            JSON.stringify({ 
              success: true, 
              coins: heliusData.tokens,
              timestamp: new Date().toISOString(),
              source: 'helius-fresh-mints'
            }),
            {
              headers: { 
                ...corsHeaders, 
                'Content-Type': 'application/json' 
              },
            },
          );
        }
      }
    } catch (error) {
      console.log("Helius API call failed:", error.message);
    }
    
    // If no fresh tokens from Helius, don't return old tokens as "fresh mints"
    console.log("=== NO FRESH TOKENS AVAILABLE ===");
    return new Response(
      JSON.stringify({ 
        success: true, 
        coins: [], // Return empty - no fresh mints available
        timestamp: new Date().toISOString(),
        source: 'no-fresh-mints',
        message: 'No newly minted tokens found in the last 24 hours'
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

function generateRealisticDemoData() {
  const realisticTokens = [
    { symbol: 'BONK', name: 'Bonk', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', basePrice: 0.000035 },
    { symbol: 'WIF', name: 'dogwifhat', address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', basePrice: 1.85 },
    { symbol: 'POPCAT', name: 'Popcat', address: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', basePrice: 0.45 },
    { symbol: 'MEW', name: 'cat in a dogs world', address: 'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5', basePrice: 0.0085 },
    { symbol: 'FWOG', name: 'FWOG', address: 'A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump', basePrice: 0.25 },
    { symbol: 'PONKE', name: 'Ponke', address: '5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC', basePrice: 0.34 },
    { symbol: 'PNUT', name: 'Peanut the Squirrel', address: '2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump', basePrice: 0.65 },
    { symbol: 'GOAT', name: 'Goatseus Maximus', address: 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump', basePrice: 0.55 },
    { symbol: 'CHILLGUY', name: 'Just a chill guy', address: 'Df6yfrKC8kZE3KNkrHERKzAetSxbrWeniQfyJY4Jpump', basePrice: 0.15 },
    { symbol: 'SLERF', name: 'Slerf', address: '7BgBvyjrZX1YKz4oh9mjb8ZScatkkwb8DzFx7LoiVkM3', basePrice: 0.28 }
  ];

  return realisticTokens.map((token, index) => {
    const now = Date.now();
    const ageInSeconds = Math.floor(Math.random() * 86400) + 3600; // 1 hour to 1 day old (FRESH!)
    const marketCapVariation = 0.8 + (Math.random() * 0.4); // 80% to 120% of base
    
    // Create realistic price with small variations from base price
    const priceVariation = 0.85 + (Math.random() * 0.3); // 85% to 115% of base price
    const currentPrice = token.basePrice * priceVariation;
    
    // Calculate realistic market cap based on price
    const estimatedSupply = token.symbol === 'BONK' ? 90000000000000 : // 90T for BONK
                           token.symbol === 'WIF' ? 998900000000 : // ~999B for WIF
                           Math.floor(Math.random() * 10000000000) + 1000000000; // 1B to 10B for others
    
    const marketCap = currentPrice * estimatedSupply * marketCapVariation;
    
    const coin = {
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      marketCap: Math.floor(marketCap),
      price: currentPrice,
      priceChange1h: (Math.random() - 0.5) * 10, // -5% to +5%
      priceChange24h: (Math.random() - 0.5) * 30, // -15% to +15%
      volume24h: Math.floor(Math.random() * 15000000) + 500000, // $500k to $15.5M
      liquidity: Math.floor(Math.random() * 2000000) + 100000, // $100k to $2.1M
      age: ageInSeconds,
      holders: generateMockHolderData(),
      legitScore: 0,
      riskScore: 0,
      rewardScore: 0,
      dexScreenerUrl: `https://dexscreener.com/solana/${token.address}`
    };

    // Calculate scores
    coin.legitScore = calculateLegitScore(coin);
    coin.riskScore = calculateRiskScore(coin);
    coin.rewardScore = calculateRewardScore(coin);

    return coin;
  });
}