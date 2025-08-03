import { UserProfile, MemeCoin } from '../types/meme-coin';

export class GameService {
  private static instance: GameService;
  
  static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  getDefaultProfile(): UserProfile {
    return {
      cashflow: 1000,
      riskTolerance: 3
    };
  }

  loadProfile(): UserProfile {
    const saved = localStorage.getItem('user-profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
    return this.getDefaultProfile();
  }

  saveProfile(profile: UserProfile): void {
    localStorage.setItem('user-profile', JSON.stringify(profile));
  }

  calculateInvestmentRecommendation(coin: MemeCoin, userCashflow: number, userRisk: number) {
    // Investment formula based on risk tolerance and coin scores
    const riskFactor = userRisk / 5; // Normalize to 0-1
    const rewardFactor = coin.rewardScore / 10; // Normalize to 0-1
    const riskPenalty = coin.riskScore / 10; // Normalize to 0-1
    
    // Base investment percentage (max 10% of portfolio for any single coin)
    const baseInvestment = Math.min(
      userCashflow * 0.1, // Max 10% of portfolio
      userCashflow * riskFactor * rewardFactor * (1 - riskPenalty)
    );

    const shouldInvest = coin.riskScore <= 6 && coin.rewardScore >= 4 && coin.legitScore >= 3;
    
    let reasoning = '';
    if (!shouldInvest) {
      if (coin.riskScore > 6) reasoning = 'High risk detected - avoid investment';
      else if (coin.rewardScore < 4) reasoning = 'Low reward potential - better opportunities available';
      else if (coin.legitScore < 3) reasoning = 'Legitimacy concerns - potential rug pull risk';
    } else {
      reasoning = `Good opportunity: Risk ${coin.riskScore}/10, Reward ${coin.rewardScore}/10, Legit ${coin.legitScore}/10`;
    }

    return {
      shouldInvest,
      suggestedAmount: shouldInvest ? Math.max(baseInvestment, 0) : 0,
      reasoning
    };
  }
}