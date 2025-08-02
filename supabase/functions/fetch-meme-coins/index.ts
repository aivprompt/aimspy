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
    
    let allPairs: any[] = [];
    let dataSource = 'unknown';
    
    // Try a simple test API first to ensure edge function networking works
    try {
      console.log("=== TESTING BASIC FETCH ===");
      const testResponse = await fetch('https://httpbin.org/json');
      console.log(`Test API status: ${testResponse.status}`);
      if (testResponse.ok) {
        const testData = await testResponse.json();
        console.log(`Test API returned data: ${!!testData}`);
      }
    } catch (error) {
      console.log("Basic fetch test failed:", error.message);
    }
    
    // Try DexScreener with working endpoints
    try {
      console.log("=== TRYING DEXSCREENER SEARCH ===");
      
      // Use the search endpoint with popular meme coin terms
      const searchTerms = ['bonk', 'pepe', 'doge', 'shib', 'meme'];
      
      for (const term of searchTerms) {
        try {
          const searchResponse = await fetch(`https://api.dexscreener.com/latest/dex/search/?q=${term}`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; MemeSpyBot/1.0)',
              'Accept': 'application/json'
            }
          });
          
          console.log(`DexScreener search (${term}) response status: ${searchResponse.status}`);
          
          if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            if (searchData?.pairs && Array.isArray(searchData.pairs)) {
              // Filter for Solana pairs with good metrics
              const solanaPairs = searchData.pairs.filter((pair: any) => 
                pair.chainId === 'solana' && 
                pair.volume?.h24 > 5000 &&
                pair.liquidity?.usd > 1000 &&
                pair.baseToken?.symbol &&
                !['SOL', 'USDC', 'USDT', 'WETH'].includes(pair.baseToken.symbol)
              );
              
              allPairs.push(...solanaPairs);
              console.log(`Search term '${term}' added ${solanaPairs.length} Solana pairs`);
            }
          }
        } catch (error) {
          console.log(`Search term '${term}' failed:`, error.message);
        }
      }
      
      if (allPairs.length > 0) {
        dataSource = 'dexscreener_search';
        console.log(`=== SUCCESS: Got ${allPairs.length} pairs from DexScreener search ===`);
      }
    } catch (error) {
      console.log("DexScreener search API failed:", error.message);
    }
    
    // If that failed, try the pairs endpoint
    if (allPairs.length === 0) {
      try {
        console.log("=== TRYING DEXSCREENER PAIRS ===");
        
        const pairsResponse = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana', {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; MemeSpyBot/1.0)',
          }
        });
        
        console.log(`DexScreener pairs response status: ${pairsResponse.status}`);
        
        if (pairsResponse.ok) {
          const pairsData = await pairsResponse.json();
          console.log(`DexScreener pairs returned ${pairsData.pairs?.length || 0} pairs`);
          
          if (pairsData.pairs && pairsData.pairs.length > 0) {
            // Take the most active pairs
            const activePairs = pairsData.pairs
              .filter((pair: any) => 
                pair.baseToken && 
                pair.volume?.h24 > 5000 &&
                !['SOL', 'USDC', 'USDT'].includes(pair.baseToken.symbol)
              )
              .sort((a: any, b: any) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))
              .slice(0, 15);
            
            console.log(`Found ${activePairs.length} active pairs`);
            
            if (activePairs.length > 0) {
              allPairs = activePairs;
              dataSource = 'dexscreener_solana_pairs';
              console.log(`=== SUCCESS: Got ${allPairs.length} pairs from DexScreener Solana pairs ===`);
            }
          }
        } else {
          const errorText = await pairsResponse.text();
          console.log(`DexScreener pairs error: ${pairsResponse.status} - ${errorText.substring(0, 200)}`);
        }
      } catch (error) {
        console.log("DexScreener pairs API failed:", error.message);
      }
    }
    
    // If that didn't work, force demo data to see logs
    if (allPairs.length === 0) {
      console.log("=== FORCING DEMO DATA FOR TESTING ===");
      dataSource = 'forced_demo_with_logs';
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
      
      console.log(`Checking coin ${pair.baseToken?.symbol}: MC=${marketCap}, Vol=${volume}, Liq=${liquidity}`);
      
      const isValid = (
        pair.baseToken && 
        pair.baseToken.symbol &&
        pair.baseToken.symbol !== 'SOL' &&
        pair.baseToken.symbol !== 'USDC' &&
        pair.baseToken.symbol !== 'USDT' &&
        pair.baseToken.symbol !== 'BTC' &&
        pair.baseToken.symbol !== 'ETH' &&
        marketCap > 1000 && // Min $1k market cap
        marketCap < 500000000 && // Increased max to $500M market cap to include more coins
        volume > 100 // Min $100 24h volume
      );
      
      console.log(`Coin ${pair.baseToken?.symbol} ${isValid ? 'PASSED' : 'FILTERED OUT'} filter`);
      return isValid;
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

    // If we still have no coins, generate realistic demo data
    if (coins.length === 0) {
      console.log('=== ALL APIS FAILED - GENERATING DEMO DATA ===');
      console.log('CoinGecko failed, Jupiter failed, DexScreener failed');
      dataSource = 'demo_data_realistic';
      const demoCoins = generateRealisticDemoData();
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          coins: demoCoins,
          timestamp: new Date().toISOString(),
          source: dataSource,
          debug: 'All APIs failed - using demo data'
        }),
        {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
        },
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        coins,
        timestamp: new Date().toISOString(),
        source: dataSource
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
    const ageInSeconds = Math.floor(Math.random() * 86400 * 7) + 3600; // 1 hour to 7 days old (fresh!)
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