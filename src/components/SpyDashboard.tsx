import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { SpyCard } from '@/components/ui/spy-card';
import { useToast } from '@/hooks/use-toast';
import { MemeSpyAPI } from '@/services/api';
import { GameService } from '@/services/game';
import { MemeCoin, UserProfile, ScanResult } from '@/types/meme-coin';
import { cn } from '@/lib/utils';
import { 
  Search, 
  TrendingUp, 
  Shield, 
  Trophy, 
  Target,
  Activity,
  DollarSign,
  Users,
  Clock,
  AlertTriangle
} from 'lucide-react';

export const SpyDashboard: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(GameService.getInstance().getDefaultProfile());
  const [coins, setCoins] = useState<MemeCoin[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<Date | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<MemeCoin | null>(null);
  
  const { toast } = useToast();
  const api = MemeSpyAPI.getInstance();
  const gameService = GameService.getInstance();

  useEffect(() => {
    // Load user profile on mount
    const savedProfile = gameService.loadProfile();
    setProfile(savedProfile);
    
    // Auto-scan on first load
    if (savedProfile.totalScanned === 0) {
      handleScan();
    }
  }, []);

  const handleProfileUpdate = (updates: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    gameService.saveProfile(newProfile);
  };

  const handleScan = async () => {
    setIsScanning(true);
    toast({
      title: "🕵️‍♂️ Initiating Scan",
      description: "Searching for new meme coins on Solana...",
    });

    try {
      const newCoins = await api.fetchNewMemeCoins();
      
      // Add investment recommendations
      const enrichedCoins = newCoins.map(coin => ({
        ...coin,
        recommendation: gameService.calculateInvestmentRecommendation(
          coin, 
          profile.cashflow, 
          profile.riskTolerance
        )
      }));

      setCoins(enrichedCoins);
      setLastScan(new Date());

      // Create scan result
      const result: ScanResult = {
        coins: enrichedCoins,
        timestamp: new Date(),
        totalScanned: enrichedCoins.length,
        newFinds: enrichedCoins.length,
        legitimateCoins: enrichedCoins.filter(c => c.legitScore >= 6).length,
        dangerousCoins: enrichedCoins.filter(c => c.riskScore >= 7).length
      };
      setScanResult(result);

      // Update profile
      const updatedProfile = {
        ...profile,
        totalScanned: profile.totalScanned + enrichedCoins.length
      };

      // Award points and check badges
      const profileWithPoints = gameService.awardPoints(updatedProfile, 25, 'Completed scan');
      const finalProfile = gameService.checkAndAwardBadges(profileWithPoints, enrichedCoins);
      
      setProfile(finalProfile);

      toast({
        title: "✅ Scan Complete",
        description: `Found ${enrichedCoins.length} meme coins. +25 Spy Points!`,
      });

    } catch (error) {
      toast({
        title: "❌ Scan Failed",
        description: "Unable to connect to spy network. Try again later.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleCoinScan = (coin: MemeCoin) => {
    setSelectedCoin(coin);
    const points = 5;
    const updatedProfile = gameService.awardPoints(profile, points, `Deep scanned ${coin.symbol}`);
    setProfile(updatedProfile);
    
    toast({
      title: "🔍 Deep Scan Complete",
      description: `Analyzed ${coin.symbol}. +${points} Spy Points!`,
    });
  };

  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(2)}`;
  };

  const getRiskToleranceLabel = (value: number) => {
    const labels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
    return labels[value - 1] || 'Medium';
  };

  const topCoins = coins
    .filter(c => c.recommendation?.shouldInvest)
    .sort((a, b) => (b.rewardScore - b.riskScore) - (a.rewardScore - a.riskScore))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold spy-gradient bg-clip-text text-transparent">
          🕵️‍♂️ AI Meme Spy HQ
        </h1>
        <p className="text-muted-foreground">
          Advanced Intelligence for Solana Meme Coin Operations
        </p>
      </div>

      {/* Profile & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spy Profile */}
        <Card className="spy-border glow-green">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-spy-green" />
              Agent Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Level {profile.level} Spy</span>
              <Badge className="spy-gradient">{profile.spyPoints} Points</Badge>
            </div>
            
            <div className="space-y-2">
              <Label>Available Cashflow</Label>
              <Input
                type="number"
                value={profile.cashflow}
                onChange={(e) => handleProfileUpdate({ cashflow: Number(e.target.value) })}
                className="spy-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Risk Tolerance: {getRiskToleranceLabel(profile.riskTolerance)}</Label>
              <Slider
                value={[profile.riskTolerance]}
                onValueChange={(value) => handleProfileUpdate({ riskTolerance: value[0] })}
                max={5}
                min={1}
                step={1}
                className="py-4"
              />
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Total Scanned: {profile.totalScanned} coins</p>
              <p>Badges Earned: {profile.badges.filter(b => b.earned).length}/{profile.badges.length}</p>
            </div>
          </CardContent>
        </Card>

        {/* Mission Control */}
        <Card className="spy-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-spy-blue" />
              Mission Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleScan}
              disabled={isScanning}
              className="w-full spy-gradient hover:opacity-90"
              size="lg"
            >
              {isScanning ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                  Scanning Network...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Start Mission
                </>
              )}
            </Button>

            {lastScan && (
              <p className="text-sm text-muted-foreground text-center">
                Last scan: {lastScan.toLocaleTimeString()}
              </p>
            )}

            {scanResult && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-center p-2 spy-border rounded">
                  <p className="font-bold text-spy-green">{scanResult.legitimateCoins}</p>
                  <p className="text-xs">Legitimate</p>
                </div>
                <div className="text-center p-2 spy-border rounded">
                  <p className="font-bold text-spy-red">{scanResult.dangerousCoins}</p>
                  <p className="text-xs">High Risk</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="spy-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-spy-yellow" />
              Intel Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topCoins.length > 0 ? (
              <>
                <div className="text-sm">
                  <p className="font-medium text-spy-green">🎯 Top Recommendations:</p>
                  {topCoins.map((coin, index) => (
                    <div key={coin.address} className="flex justify-between py-1">
                      <span className="truncate">{coin.symbol}</span>
                      <span className="text-spy-green">{formatMoney(coin.recommendation?.suggestedAmount || 0)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Total suggested allocation: {formatMoney(topCoins.reduce((sum, coin) => sum + (coin.recommendation?.suggestedAmount || 0), 0))}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No investment opportunities detected</p>
                <p className="text-xs">Run a scan to find meme coins</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Badges Display */}
      {profile.badges.some(b => b.earned) && (
        <Card className="spy-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-spy-yellow" />
              Agent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {profile.badges
                .filter(badge => badge.earned)
                .map(badge => (
                  <Badge key={badge.id} className="spy-gradient text-white">
                    {badge.icon} {badge.name}
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coins Grid */}
      {coins.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-spy-green" />
            Intelligence Report
            <Badge variant="outline">{coins.length} targets</Badge>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coins.map(coin => (
              <SpyCard
                key={coin.address}
                coin={coin}
                onScan={handleCoinScan}
                isScanning={selectedCoin?.address === coin.address}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {coins.length === 0 && !isScanning && (
        <Card className="spy-border text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="text-6xl">🕵️‍♂️</div>
              <h3 className="text-xl font-bold">Ready for your first mission?</h3>
              <p className="text-muted-foreground">
                Click "Start Mission" to begin scanning for meme coins on Solana
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};