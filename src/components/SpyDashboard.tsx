import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { SpyCard } from '@/components/ui/spy-card';
import { LatestMints } from '@/components/ui/latest-mints';
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
  AlertTriangle,
  RefreshCw,
  Pin,
  PinOff,
  Zap,
  X,
  ExternalLink,
  Droplets,
  Calendar
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const SpyDashboard: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(GameService.getInstance().getDefaultProfile());
  const [coins, setCoins] = useState<MemeCoin[]>([]);
  const [pinnedCoins, setPinnedCoins] = useState<Set<string>>(new Set());
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<Date | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<MemeCoin | null>(null);
  const [showDeepScanModal, setShowDeepScanModal] = useState(false);
  const [deepScanResults, setDeepScanResults] = useState<MemeCoin | null>(null);
  
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
    
    // Show detailed scan results after 2 seconds
    setTimeout(() => {
      setSelectedCoin(null);
      setDeepScanResults(coin);
      setShowDeepScanModal(true);
      
      toast({
        title: "🔍 Deep Scan Complete",
        description: `Analyzed ${coin.symbol}. +${points} Spy Points!`,
      });
    }, 2000);
  };

  const togglePinCoin = (coinAddress: string) => {
    const newPinnedCoins = new Set(pinnedCoins);
    if (pinnedCoins.has(coinAddress)) {
      newPinnedCoins.delete(coinAddress);
    } else {
      newPinnedCoins.add(coinAddress);
    }
    setPinnedCoins(newPinnedCoins);
  };

  const refreshUnpinnedTargets = async () => {
    if (coins.length === 0) return;
    
    setIsScanning(true);
    toast({
      title: "🔄 Refreshing Targets",
      description: "Finding new unpinned targets...",
    });

    try {
      const newCoins = await api.fetchNewMemeCoins();
      const enrichedCoins = newCoins.map(coin => ({
        ...coin,
        recommendation: gameService.calculateInvestmentRecommendation(
          coin, 
          profile.cashflow, 
          profile.riskTolerance
        )
      }));

      // Keep pinned coins and fill remaining slots with new coins
      const pinnedCoinList = coins.filter(coin => pinnedCoins.has(coin.address));
      const unpinnedNewCoins = enrichedCoins.filter(coin => !pinnedCoins.has(coin.address));
      
      const slotsToFill = 3 - pinnedCoinList.length;
      const finalCoins = [...pinnedCoinList, ...unpinnedNewCoins.slice(0, slotsToFill)];
      
      setCoins(finalCoins);
      
      toast({
        title: "✅ Targets Refreshed",
        description: `Updated ${slotsToFill} unpinned targets`,
      });

    } catch (error) {
      toast({
        title: "❌ Refresh Failed",
        description: "Unable to refresh targets. Try again later.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectCoinFromMints = (selectedCoin: MemeCoin) => {
    // Add selected coin to main coins array if not already present
    const isAlreadyInCoins = coins.some(coin => coin.address === selectedCoin.address);
    
    if (!isAlreadyInCoins) {
      // Add investment recommendation
      const enrichedCoin = {
        ...selectedCoin,
        recommendation: gameService.calculateInvestmentRecommendation(
          selectedCoin, 
          profile.cashflow, 
          profile.riskTolerance
        )
      };
      
      // Replace oldest unpinned coin or add if space available
      const pinnedCoinList = coins.filter(coin => pinnedCoins.has(coin.address));
      const unpinnedCoins = coins.filter(coin => !pinnedCoins.has(coin.address));
      
      if (pinnedCoinList.length < 3) {
        // Add to empty slot
        setCoins([...coins, enrichedCoin]);
      } else {
        // Replace oldest unpinned coin
        const newUnpinnedCoins = unpinnedCoins.slice(0, -1);
        setCoins([...pinnedCoinList, enrichedCoin, ...newUnpinnedCoins]);
      }
      
      toast({
        title: "🎯 Target Added",
        description: `${selectedCoin.symbol} added to your targets`,
      });
    } else {
      toast({
        title: "ℹ️ Already Tracked",
        description: `${selectedCoin.symbol} is already in your targets`,
      });
    }
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

  // Show top 3 targets: pinned coins first, then best unpinned coins
  const displayCoins = useMemo(() => {
    const pinnedCoinList = coins.filter(coin => pinnedCoins.has(coin.address));
    const unpinnedCoins = coins
      .filter(coin => !pinnedCoins.has(coin.address))
      .sort((a, b) => (b.rewardScore - b.riskScore) - (a.rewardScore - a.riskScore));
    
    return [...pinnedCoinList, ...unpinnedCoins].slice(0, 3);
  }, [coins, pinnedCoins]);

  // Latest 20 minted coins (sorted by newest first) - separate from main targets
  const latestCoins = useMemo(() => {
    return [...coins]
      .sort((a, b) => a.age - b.age) // Newest first (smaller age)
      .slice(3, 23); // Skip first 3 (which are main targets) and take next 20
  }, [coins]);

  const topCoins = displayCoins
    .filter(c => c.recommendation?.shouldInvest)
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

      {/* Top 6 Targets */}
      {displayCoins.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Target className="h-6 w-6 text-spy-green" />
                  Top 3 Targets
                </h2>
                <Badge variant="outline">{displayCoins.length}/3 slots</Badge>
              {pinnedCoins.size > 0 && (
                <Badge className="spy-gradient">
                  <Pin className="h-3 w-3 mr-1" />
                  {pinnedCoins.size} pinned
                </Badge>
              )}
            </div>
            
            {displayCoins.length > 0 && (
              <Button
                onClick={refreshUnpinnedTargets}
                disabled={isScanning}
                variant="outline"
                size="sm"
                className="spy-border"
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", isScanning && "animate-spin")} />
                Refresh Unpinned
              </Button>
            )}
          </div>
          
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCoins.slice(0, 3).map(coin => (
              <SpyCard
                key={coin.address}
                coin={coin}
                onScan={handleCoinScan}
                onTogglePin={() => togglePinCoin(coin.address)}
                isPinned={pinnedCoins.has(coin.address)}
                isScanning={selectedCoin?.address === coin.address}
              />
            ))}
          </div>
        </div>
      )}

      {/* Latest Mints */}
      {latestCoins.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-spy-yellow animate-pulse" />
            Fresh Mints
            <Badge variant="outline">Live Feed</Badge>
          </h2>
          
          <LatestMints
            coins={latestCoins}
            onSelectCoin={handleSelectCoinFromMints}
            className="max-w-full"
          />
        </div>
      )}

      {/* Deep Scan Results Modal */}
      <Dialog open={showDeepScanModal} onOpenChange={setShowDeepScanModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto spy-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-spy-blue" />
              Deep Scan Analysis: {deepScanResults?.symbol}
            </DialogTitle>
          </DialogHeader>
          
          {deepScanResults && (
            <div className="space-y-6">
              {/* Overview */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="spy-border">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="font-bold text-lg">{deepScanResults.name}</h3>
                      <p className="text-muted-foreground">{deepScanResults.symbol}</p>
                      <p className="text-2xl font-bold mt-2">{formatMoney(deepScanResults.price)}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="spy-border">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Market Cap:</span>
                        <span className="font-semibold">{formatMoney(deepScanResults.marketCap)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Volume 24h:</span>
                        <span className="font-semibold">{formatMoney(deepScanResults.volume24h)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Liquidity:</span>
                        <span className="font-semibold">{formatMoney(deepScanResults.liquidity)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Analysis */}
              <Card className="spy-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5" />
                    Risk Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className={cn(
                        "text-2xl font-bold",
                        deepScanResults.legitScore >= 7 ? "text-spy-green" :
                        deepScanResults.legitScore >= 5 ? "text-spy-yellow" : "text-spy-red"
                      )}>
                        {deepScanResults.legitScore}/10
                      </div>
                      <p className="text-sm text-muted-foreground">Legitimacy</p>
                    </div>
                    <div className="text-center">
                      <div className={cn(
                        "text-2xl font-bold",
                        deepScanResults.riskScore <= 3 ? "text-spy-green" :
                        deepScanResults.riskScore <= 6 ? "text-spy-yellow" : "text-spy-red"
                      )}>
                        {deepScanResults.riskScore}/10
                      </div>
                      <p className="text-sm text-muted-foreground">Risk Level</p>
                    </div>
                    <div className="text-center">
                      <div className={cn(
                        "text-2xl font-bold",
                        deepScanResults.rewardScore >= 7 ? "text-spy-green" :
                        deepScanResults.rewardScore >= 5 ? "text-spy-yellow" : "text-spy-red"
                      )}>
                        {deepScanResults.rewardScore}/10
                      </div>
                      <p className="text-sm text-muted-foreground">Reward Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance */}
              <Card className="spy-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>1h Change:</span>
                    <span className={cn(
                      "font-semibold",
                      deepScanResults.priceChange1h >= 0 ? "text-spy-green" : "text-spy-red"
                    )}>
                      {deepScanResults.priceChange1h >= 0 ? "+" : ""}{deepScanResults.priceChange1h.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>24h Change:</span>
                    <span className={cn(
                      "font-semibold",
                      deepScanResults.priceChange24h >= 0 ? "text-spy-green" : "text-spy-red"
                    )}>
                      {deepScanResults.priceChange24h >= 0 ? "+" : ""}{deepScanResults.priceChange24h.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Age:
                    </span>
                    <span className="font-semibold">
                      {Math.floor(deepScanResults.age / 86400)} days
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Recommendation */}
              {deepScanResults.recommendation && (
                <Card className={cn(
                  "spy-border",
                  deepScanResults.recommendation.shouldInvest ? "glow-green" : "glow-red"
                )}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="h-5 w-5" />
                      AI Recommendation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-sm font-semibold",
                        deepScanResults.recommendation.shouldInvest 
                          ? "bg-spy-green/20 text-spy-green" 
                          : "bg-spy-red/20 text-spy-red"
                      )}>
                        {deepScanResults.recommendation.shouldInvest ? "INVEST" : "AVOID"}
                      </span>
                      {deepScanResults.recommendation.shouldInvest && (
                        <span className="text-lg font-bold text-spy-green">
                          {formatMoney(deepScanResults.recommendation.suggestedAmount)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {deepScanResults.recommendation.reasoning}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* External Links */}
              {deepScanResults.dexScreenerUrl ? (
                <div className="flex gap-2">
                  <Button
                    onClick={() => window.open(deepScanResults.dexScreenerUrl, '_blank')}
                    variant="outline"
                    className="spy-border flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on DexScreener
                  </Button>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">This is demo data - DexScreener link not available</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

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