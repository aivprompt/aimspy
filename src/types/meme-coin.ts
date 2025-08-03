export interface MemeCoin {
  address: string;
  symbol: string;
  name: string;
  marketCap: number;
  price: number;
  priceChange1h: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  age: number; // in seconds
  holders?: {
    total: number;
    data: Array<{
      address: string;
      percent: number;
      amount: number;
    }>;
  };
  legitScore: number; // 0-10
  riskScore: number; // 0-10
  rewardScore: number; // 0-10
  recommendation?: {
    shouldInvest: boolean;
    suggestedAmount: number;
    reasoning: string;
  };
  dexScreenerUrl?: string;
  socialSignals?: {
    twitterMentions: number;
    sentiment: 'positive' | 'negative' | 'neutral';
  };
}

export interface UserProfile {
  cashflow: number;
  riskTolerance: number; // 1-5 scale
}

export interface LeaderboardEntry {
  rank: number;
  coin: MemeCoin;
  score: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ScanResult {
  coins: MemeCoin[];
  timestamp: Date;
  totalScanned: number;
  newFinds: number;
  legitimateCoins: number;
  dangerousCoins: number;
}