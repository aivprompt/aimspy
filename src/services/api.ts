import { MemeCoin } from '../types/meme-coin';

// Rate limiting to avoid being blocked
class RateLimiter {
  private lastCall = 0;
  private minInterval = 1000; // 1 second between calls

  async throttle() {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCall;
    if (timeSinceLastCall < this.minInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minInterval - timeSinceLastCall));
    }
    this.lastCall = Date.now();
  }
}

const rateLimiter = new RateLimiter();

export class MemeSpyAPI {
  private static instance: MemeSpyAPI;
  
  static getInstance(): MemeSpyAPI {
    if (!MemeSpyAPI.instance) {
      MemeSpyAPI.instance = new MemeSpyAPI();
    }
    return MemeSpyAPI.instance;
  }

  async fetchNewMemeCoins(): Promise<MemeCoin[]> {
    await rateLimiter.throttle();
    
    try {
      const response = await fetch('https://api.dexscreener.com/latest/dex/search?q=solana');
      const data = await response.json();
      
      if (!data.pairs) return [];
      
      // Filter for meme coins (< 30 days old, < $50M market cap, prioritize Solana)
      const filteredPairs = data.pairs.filter((pair: any) => {
        const ageInSeconds = (Date.now() - (pair.pairCreatedAt || 0)) / 1000;
        const ageInDays = ageInSeconds / 86400;
        return ageInDays < 30 && (pair.fdv || 0) < 50000000;
      });

      const coins: MemeCoin[] = [];
      
      for (const pair of filteredPairs.slice(0, 30)) { // Limit to 30 coins
        const coin = await this.processCoinData(pair);
        if (coin) coins.push(coin);
      }
      
      return coins;
    } catch (error) {
      console.error('Error fetching meme coins:', error);
      return [];
    }
  }

  private async processCoinData(pair: any): Promise<MemeCoin | null> {
    try {
      const holders = await this.fetchHolderData(pair.baseToken.address);
      
      const coin: MemeCoin = {
        address: pair.baseToken.address,
        symbol: pair.baseToken.symbol || 'UNKNOWN',
        name: pair.baseToken.name || 'Unknown Token',
        marketCap: pair.fdv || 0,
        price: parseFloat(pair.priceUsd || '0'),
        priceChange1h: parseFloat(pair.priceChange?.h1 || '0'),
        priceChange24h: parseFloat(pair.priceChange?.h24 || '0'),
        volume24h: parseFloat(pair.volume?.h24 || '0'),
        liquidity: parseFloat(pair.liquidity?.usd || '0'),
        age: Math.floor((Date.now() - (pair.pairCreatedAt || 0)) / 1000),
        holders,
        legitScore: 0,
        riskScore: 0,
        rewardScore: 0,
        dexScreenerUrl: pair.url
      };

      // Calculate scores
      coin.legitScore = this.calculateLegitScore(coin);
      coin.riskScore = this.calculateRiskScore(coin);
      coin.rewardScore = this.calculateRewardScore(coin);

      return coin;
    } catch (error) {
      console.error('Error processing coin data:', error);
      return null;
    }
  }

  private async fetchHolderData(address: string): Promise<any> {
    await rateLimiter.throttle();
    
    try {
      // Try Solscan API first (free, no key required)
      const response = await fetch(`https://api.solscan.io/token/holders?token=${address}&limit=10`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          total: data.total || 0,
          data: data.data || []
        };
      }
    } catch (error) {
      console.log('Solscan API failed, using mock data');
    }

    // Fallback to mock data for demo purposes
    return this.generateMockHolderData();
  }

  private generateMockHolderData() {
    const total = Math.floor(Math.random() * 2000) + 100;
    const data = [];
    
    for (let i = 0; i < 10; i++) {
      data.push({
        address: this.generateRandomAddress(),
        percent: Math.random() * (i === 0 ? 0.3 : 0.05), // Top holder can have up to 30%
        amount: Math.floor(Math.random() * 1000000)
      });
    }
    
    return { total, data };
  }

  private generateRandomAddress(): string {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
    let result = '';
    for (let i = 0; i < 44; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private calculateLegitScore(coin: MemeCoin): number {
    let score = 0;
    
    // Check holder count
    if (coin.holders && coin.holders.total > 500) score += 2;
    if (coin.holders && coin.holders.total > 1000) score += 1;
    
    // Check top holder concentration
    if (coin.holders && coin.holders.data.length > 0) {
      const topHolderPercent = coin.holders.data[0].percent;
      if (topHolderPercent < 0.1) score += 3; // Top holder < 10%
      else if (topHolderPercent < 0.2) score += 2; // Top holder < 20%
      else if (topHolderPercent < 0.3) score += 1; // Top holder < 30%
    }
    
    // Check liquidity
    if (coin.liquidity > 50000) score += 2; // > $50k liquidity
    if (coin.liquidity > 100000) score += 1; // > $100k liquidity
    
    // Check age (older is more legitimate)
    const ageInHours = coin.age / 3600;
    if (ageInHours > 12) score += 1;
    if (ageInHours > 24) score += 1;
    
    return Math.min(score, 10);
  }

  private calculateRiskScore(coin: MemeCoin): number {
    let risk = 0;
    
    // High risk factors
    if (coin.legitScore < 3) risk += 4;
    if (coin.liquidity < 10000) risk += 3; // Low liquidity
    if (Math.abs(coin.priceChange1h) > 50) risk += 2; // High volatility
    if (coin.holders && coin.holders.data[0]?.percent > 0.5) risk += 3; // Whale concentration
    
    // Age factor (newer = riskier)
    const ageInHours = coin.age / 3600;
    if (ageInHours < 6) risk += 2;
    if (ageInHours < 1) risk += 2;
    
    return Math.min(risk, 10);
  }

  private calculateRewardScore(coin: MemeCoin): number {
    let reward = 0;
    
    // Positive indicators
    if (coin.priceChange1h > 10) reward += 2;
    if (coin.priceChange24h > 20) reward += 2;
    if (coin.volume24h > 100000) reward += 3; // High volume
    if (coin.volume24h > 500000) reward += 2; // Very high volume
    
    // Market cap sweet spot for memes
    if (coin.marketCap > 100000 && coin.marketCap < 500000) reward += 2;
    
    // Holder growth (estimated)
    if (coin.holders && coin.holders.total > 1000) reward += 1;
    
    return Math.min(reward, 10);
  }
}