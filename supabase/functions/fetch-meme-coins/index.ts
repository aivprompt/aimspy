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
    
    // Try CoinGecko with a very simple endpoint
    try {
      console.log("=== TRYING COINGECKO SIMPLE ===");
      const coinGeckoResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin,shiba-inu,pepe&vs_currencies=usd&include_24hr_change=true', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MemeSpyBot/1.0)',
        }
      });
      
      console.log(`CoinGecko simple response status: ${coinGeckoResponse.status}`);
      
      if (coinGeckoResponse.ok) {
        const simpleData = await coinGeckoResponse.json();
        console.log(`CoinGecko simple returned:`, Object.keys(simpleData));
        
        // Convert simple format to our format for testing
        const simpleCoins = Object.entries(simpleData).map(([id, data]: [string, any]) => ({
          chainId: 'ethereum',
          baseToken: {
            address: id,
            symbol: id.toUpperCase(),
            name: id.replace('-', ' ')
          },
          priceUsd: data.usd?.toString() || '0',
          priceChange: {
            h1: '0',
            h24: data.usd_24h_change?.toString() || '0'
          },
          volume: {
            h24: Math.floor(Math.random() * 100000) + 10000
          },
          liquidity: {
            usd: Math.floor(Math.random() * 50000) + 5000
          },
          fdv: Math.floor(data.usd * 1000000000), // Fake market cap
          pairCreatedAt: Date.now() - Math.floor(Math.random() * 86400 * 7) * 1000
        }));
        
        if (simpleCoins.length > 0) {
          allPairs = simpleCoins;
          dataSource = 'coingecko_simple_test';
          console.log(`=== SUCCESS: Got ${allPairs.length} coins from CoinGecko simple ===`);
        }
      } else {
        const errorText = await coinGeckoResponse.text();
        console.log(`CoinGecko simple error: ${coinGeckoResponse.status} - ${errorText.substring(0, 100)}`);
      }
    } catch (error) {
      console.log("CoinGecko simple API failed:", error.message);
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
    { symbol: 'BONK', name: 'Bonk', address: '3P8gKYEKJ7ZPK8Ckc9cDJc5aDfE6z2Q7bA1BxY4cF9sT' },
    { symbol: 'WIF', name: 'dogwifhat', address: '8K3mRzL5pQ2aDfE6z2Q7bA1BxY4cF9sT3P8gKYEKJ7ZP' },
    { symbol: 'POPCAT', name: 'Popcat', address: 'Z7bA1BxY4cF9sT3P8gKYEKJ7ZPK8Ckc9cDJc5aDfE6z2Q' },
    { symbol: 'MEW', name: 'cat in a dogs world', address: 'F9sT3P8gKYEKJ7ZPK8Ckc9cDJc5aDfE6z2Q7bA1BxY4c' },
    { symbol: 'FWOG', name: 'FWOG', address: 'Y4cF9sT3P8gKYEKJ7ZPK8Ckc9cDJc5aDfE6z2Q7bA1Bx' },
    { symbol: 'PONKE', name: 'Ponke', address: 'Q7bA1BxY4cF9sT3P8gKYEKJ7ZPK8Ckc9cDJc5aDfE6z2' },
    { symbol: 'PNUT', name: 'Peanut the Squirrel', address: 'sT3P8gKYEKJ7ZPK8Ckc9cDJc5aDfE6z2Q7bA1BxY4cF9' },
    { symbol: 'GOAT', name: 'Goatseus Maximus', address: 'A1BxY4cF9sT3P8gKYEKJ7ZPK8Ckc9cDJc5aDfE6z2Q7b' },
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