import { UserProfile, Badge, Quest, MemeCoin } from '../types/meme-coin';

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
      riskTolerance: 3,
      spyPoints: 0,
      level: 1,
      badges: this.getDefaultBadges(),
      totalScanned: 0
    };
  }

  getDefaultBadges(): Badge[] {
    return [
      {
        id: 'first-scan',
        name: 'First Contact',
        description: 'Performed your first meme coin scan',
        icon: '🔍',
        earned: false
      },
      {
        id: 'rug-detector',
        name: 'Rug Detector',
        description: 'Identified 5 high-risk coins',
        icon: '🚨',
        earned: false
      },
      {
        id: 'gem-hunter',
        name: 'Gem Hunter',
        description: 'Found 3 high-reward, low-risk coins',
        icon: '💎',
        earned: false
      },
      {
        id: 'whale-spotter',
        name: 'Whale Spotter',
        description: 'Detected whale concentration in a coin',
        icon: '🐋',
        earned: false
      },
      {
        id: 'volume-analyst',
        name: 'Volume Analyst',
        description: 'Analyzed 50 different coins',
        icon: '📊',
        earned: false
      },
      {
        id: 'risk-master',
        name: 'Risk Master',
        description: 'Correctly assessed risk levels 25 times',
        icon: '🎯',
        earned: false
      },
      {
        id: 'spy-veteran',
        name: 'Spy Veteran',
        description: 'Reached 1000 spy points',
        icon: '🕵️‍♂️',
        earned: false
      }
    ];
  }

  getActiveQuests(): Quest[] {
    return [
      {
        id: 'daily-scan',
        name: 'Daily Reconnaissance',
        description: 'Scan 10 coins today',
        target: 10,
        current: 0,
        reward: 50,
        completed: false
      },
      {
        id: 'risk-assessment',
        name: 'Risk Assessment Training',
        description: 'Identify 3 high-risk coins',
        target: 3,
        current: 0,
        reward: 75,
        completed: false
      },
      {
        id: 'gem-discovery',
        name: 'Gem Discovery Mission',
        description: 'Find 1 coin with reward score > 7',
        target: 1,
        current: 0,
        reward: 100,
        completed: false
      }
    ];
  }

  loadProfile(): UserProfile {
    const saved = localStorage.getItem('spy-profile');
    if (saved) {
      try {
        const profile = JSON.parse(saved);
        // Merge with default badges to ensure all badges exist
        const defaultBadges = this.getDefaultBadges();
        profile.badges = defaultBadges.map(defaultBadge => {
          const existingBadge = profile.badges?.find((b: Badge) => b.id === defaultBadge.id);
          return existingBadge || defaultBadge;
        });
        return profile;
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
    return this.getDefaultProfile();
  }

  saveProfile(profile: UserProfile): void {
    localStorage.setItem('spy-profile', JSON.stringify(profile));
  }

  awardPoints(profile: UserProfile, points: number, reason: string): UserProfile {
    const newProfile = { ...profile };
    newProfile.spyPoints += points;
    
    // Level up logic
    const newLevel = Math.floor(newProfile.spyPoints / 500) + 1;
    if (newLevel > newProfile.level) {
      newProfile.level = newLevel;
      this.showLevelUpNotification(newLevel);
    }
    
    this.saveProfile(newProfile);
    return newProfile;
  }

  checkAndAwardBadges(profile: UserProfile, coins: MemeCoin[]): UserProfile {
    const newProfile = { ...profile };
    let badgesEarned = 0;

    // First scan badge
    if (!newProfile.badges.find(b => b.id === 'first-scan')?.earned && newProfile.totalScanned > 0) {
      this.earnBadge(newProfile, 'first-scan');
      badgesEarned++;
    }

    // Rug detector badge
    const highRiskCoins = coins.filter(c => c.riskScore >= 7).length;
    if (!newProfile.badges.find(b => b.id === 'rug-detector')?.earned && highRiskCoins >= 5) {
      this.earnBadge(newProfile, 'rug-detector');
      badgesEarned++;
    }

    // Gem hunter badge
    const gems = coins.filter(c => c.rewardScore >= 7 && c.riskScore <= 4).length;
    if (!newProfile.badges.find(b => b.id === 'gem-hunter')?.earned && gems >= 3) {
      this.earnBadge(newProfile, 'gem-hunter');
      badgesEarned++;
    }

    // Whale spotter badge
    const whaleCoins = coins.filter(c => 
      c.holders && c.holders.data[0]?.percent > 0.3
    ).length;
    if (!newProfile.badges.find(b => b.id === 'whale-spotter')?.earned && whaleCoins > 0) {
      this.earnBadge(newProfile, 'whale-spotter');
      badgesEarned++;
    }

    // Volume analyst badge
    if (!newProfile.badges.find(b => b.id === 'volume-analyst')?.earned && newProfile.totalScanned >= 50) {
      this.earnBadge(newProfile, 'volume-analyst');
      badgesEarned++;
    }

    // Spy veteran badge
    if (!newProfile.badges.find(b => b.id === 'spy-veteran')?.earned && newProfile.spyPoints >= 1000) {
      this.earnBadge(newProfile, 'spy-veteran');
      badgesEarned++;
    }

    if (badgesEarned > 0) {
      this.saveProfile(newProfile);
    }

    return newProfile;
  }

  private earnBadge(profile: UserProfile, badgeId: string): void {
    const badge = profile.badges.find(b => b.id === badgeId);
    if (badge) {
      badge.earned = true;
      badge.earnedAt = new Date();
      this.showBadgeNotification(badge);
    }
  }

  private showLevelUpNotification(level: number): void {
    // This would typically trigger a toast or modal
    console.log(`🎉 Level Up! You are now a Level ${level} Spy!`);
  }

  private showBadgeNotification(badge: Badge): void {
    // This would typically trigger a toast or modal
    console.log(`🏆 Badge Earned: ${badge.icon} ${badge.name}`);
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