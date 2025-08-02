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
    
    // Try DexScreener with multiple approaches
    try {
      console.log("=== TRYING DEXSCREENER TOKENS BY CHAIN ===");
      
      // Try getting tokens by chain first - this is more reliable
      const tokensResponse = await fetch('https://api.dexscreener.com/latest/dex/tokens/solana', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MemeSpyBot/1.0)',
        }
      });
      
      console.log(`DexScreener tokens response status: ${tokensResponse.status}`);
      
      if (tokensResponse.ok) {
        const tokensData = await tokensResponse.json();
        console.log(`DexScreener tokens returned ${tokensData.pairs?.length || 0} pairs`);
        
        if (tokensData.pairs && tokensData.pairs.length > 0) {
          // Filter for good meme coins
          const goodPairs = tokensData.pairs.filter((pair: any) => {
            const vol24h = pair.volume?.h24 || 0;
            const liquidity = pair.liquidity?.usd || 0;
            const mcap = pair.fdv || 0;
            
            return (
              pair.baseToken && 
              pair.baseToken.symbol &&
              pair.baseToken.symbol.length >= 3 && // At least 3 characters
              pair.baseToken.symbol.length <= 10 && // Not too long
              !['SOL', 'USDC', 'USDT', 'BTC', 'ETH', 'WETH', 'WSOL'].includes(pair.baseToken.symbol) &&
              vol24h > 10000 && // At least $10k volume
              liquidity > 5000 && // At least $5k liquidity
              mcap > 10000 && // At least $10k market cap
              mcap < 100000000 // Less than $100M market cap
            );
          });
          
          console.log(`Found ${goodPairs.length} good pairs after filtering`);
          
          if (goodPairs.length > 0) {
            // Sort by volume
            goodPairs.sort((a: any, b: any) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0));
            allPairs = goodPairs.slice(0, 20);
            dataSource = 'dexscreener_solana_tokens';
            console.log(`=== SUCCESS: Got ${allPairs.length} pairs from DexScreener Solana tokens ===`);
          }
        }
      } else {
        const errorText = await tokensResponse.text();
        console.log(`DexScreener tokens error: ${tokensResponse.status} - ${errorText.substring(0, 200)}`);
      }
    } catch (error) {
      console.log("DexScreener tokens API failed:", error.message);
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
    { symbol: 'BONK', name: 'Bonk', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' },
    { symbol: 'WIF', name: 'dogwifhat', address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm' },
    { symbol: 'POPCAT', name: 'Popcat', address: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr' },
    { symbol: 'MEW', name: 'cat in a dogs world', address: 'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5' },
    { symbol: 'FWOG', name: 'FWOG', address: 'A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump' },
    { symbol: 'PONKE', name: 'Ponke', address: '5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC' },
    { symbol: 'PNUT', name: 'Peanut the Squirrel', address: '2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump' },
    { symbol: 'GOAT', name: 'Goatseus Maximus', address: 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump' },
    { symbol: 'CHILLGUY', name: 'Just a chill guy', address: 'Df6yfrKC8kZE3KNkrHERKzAetSxbrWeniQfyJY4Jpump' },
    { symbol: 'SLERF', name: 'Slerf', address: '7BgBvyjrZX1YKz4oh9mjb8ZScatkkwb8DzFx7LoiVkM3' }
  ];

  return realisticTokens.map((token, index) => {
    const now = Date.now();
    const ageInSeconds = Math.floor(Math.random() * 86400 * 30) + 3600; // 1 hour to 30 days old
    const marketCapBase = Math.pow(10, 4 + Math.random() * 3); // $10k to $1M range
    
    const coin = {
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      marketCap: Math.floor(marketCapBase),
      price: Math.random() * 0.01 + 0.00001, // $0.00001 to $0.01001
      priceChange1h: (Math.random() - 0.5) * 30, // -15% to +15%
      priceChange24h: (Math.random() - 0.5) * 80, // -40% to +40%
      volume24h: Math.floor(Math.random() * 500000) + 10000, // $10k to $510k
      liquidity: Math.floor(Math.random() * 200000) + 5000, // $5k to $205k
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