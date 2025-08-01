import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { SpyCard } from '@/components/ui/spy-card';
import { LatestMints } from '@/components/ui/latest-mints';
import { 
  NetworkActivityPanel, 
  SystemMonitorPanel, 
  SecurityStatusPanel, 
  DataProcessingPanel, 
  MarketOverviewPanel 
} from '@/components/ui/dashboard-panels';
import { 
  RealtimeChartPanel, 
  CircularProgressPanel, 
  HeatmapPanel, 
  MiniChartGrid 
} from '@/components/ui/advanced-charts';
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
  Calendar,
  Command,
  BarChart3,
  Cpu,
  Globe,
  Radar,
  Monitor,
  Eye,
  Settings
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
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-4 space-y-4">

        {/* Command Center Header */}
        <Card className="spy-border bg-card/30 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Command className="h-8 w-8 text-primary animate-pulse" />
              AIMS Command Center
              <Badge variant="outline" className="ml-auto">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                System Online
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column - System Monitoring */}
          <div className="lg:col-span-3 space-y-4">
            <NetworkActivityPanel />
            <SystemMonitorPanel />
            <SecurityStatusPanel />
          </div>

          {/* Center Column - Main Analytics */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Mission Control Panel */}
            <Card className="spy-border bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Mission Control
                  <Badge variant="outline" className="ml-auto">
                    {isScanning ? "Scanning..." : "Ready"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleScan}
                  disabled={isScanning}
                  className="w-full spy-gradient hover:opacity-90 text-lg py-6"
                  size="lg"
                >
                  {isScanning ? (
                    <>
                      <Radar className="h-5 w-5 mr-3 animate-spin" />
                      Scanning Network...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-3" />
                      Initiate Deep Scan
                    </>
                  )}
                </Button>

                {scanResult && (
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div className="text-center p-3 spy-border rounded bg-background/50">
                      <p className="font-bold text-primary text-lg">{scanResult.totalScanned}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="text-center p-3 spy-border rounded bg-background/50">
                      <p className="font-bold text-green-500 text-lg">{scanResult.legitimateCoins}</p>
                      <p className="text-xs text-muted-foreground">Safe</p>
                    </div>
                    <div className="text-center p-3 spy-border rounded bg-background/50">
                      <p className="font-bold text-red-500 text-lg">{scanResult.dangerousCoins}</p>
                      <p className="text-xs text-muted-foreground">Risk</p>
                    </div>
                    <div className="text-center p-3 spy-border rounded bg-background/50">
                      <p className="font-bold text-yellow-500 text-lg">{scanResult.newFinds}</p>
                      <p className="text-xs text-muted-foreground">New</p>
                    </div>
                  </div>
                )}

                {lastScan && (
                  <div className="text-center py-2 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      Last scan: {lastScan.toLocaleTimeString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RealtimeChartPanel />
              <CircularProgressPanel />
            </div>

            {/* Agent Profile - Redesigned */}
            <Card className="spy-border bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Agent Profile
                  <Badge className="spy-gradient ml-auto">
                    Level {profile.level} • {profile.spyPoints} Points
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Available Cashflow</Label>
                    <Input
                      type="number"
                      value={profile.cashflow}
                      onChange={(e) => handleProfileUpdate({ cashflow: Number(e.target.value) })}
                      className="spy-border bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Risk Tolerance: {getRiskToleranceLabel(profile.riskTolerance)}
                    </Label>
                    <Slider
                      value={[profile.riskTolerance]}
                      onValueChange={(value) => handleProfileUpdate({ riskTolerance: value[0] })}
                      max={5}
                      min={1}
                      step={1}
                      className="py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{profile.totalScanned}</div>
                    <div className="text-xs text-muted-foreground">Coins Scanned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {profile.badges.filter(b => b.earned).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Badges Earned</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Data Processing & Analytics */}
          <div className="lg:col-span-3 space-y-4">
            <DataProcessingPanel />
            <MarketOverviewPanel />
            <HeatmapPanel />
            <MiniChartGrid />
          </div>
        </div>

        {/* Secondary Dashboard Grid - Targets and Live Data */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          {/* Badges Display */}
          {profile.badges.some(b => b.earned) && (
            <div className="lg:col-span-1">
              <Card className="spy-border bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Trophy className="h-4 w-4 text-primary" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    {profile.badges
                      .filter(badge => badge.earned)
                      .map(badge => (
                        <Badge key={badge.id} className="spy-gradient text-white text-xs">
                          {badge.icon} {badge.name}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Top 3 Targets */}
          {displayCoins.length > 0 && (
            <div className={cn("lg:col-span-3", !profile.badges.some(b => b.earned) && "lg:col-span-4")}>
              <Card className="spy-border bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Priority Targets
                      <Badge variant="outline">{displayCoins.length}/3 slots</Badge>
                      {pinnedCoins.size > 0 && (
                        <Badge className="spy-gradient">
                          <Pin className="h-3 w-3 mr-1" />
                          {pinnedCoins.size} pinned
                        </Badge>
                      )}
                    </CardTitle>
                    
                    {displayCoins.length > 0 && (
                      <Button
                        onClick={refreshUnpinnedTargets}
                        disabled={isScanning}
                        variant="outline"
                        size="sm"
                        className="spy-border"
                      >
                        <RefreshCw className={cn("h-4 w-4 mr-2", isScanning && "animate-spin")} />
                        Refresh
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Latest Mints Section */}
        {latestCoins.length > 0 && (
          <Card className="spy-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary animate-pulse" />
                Fresh Mints
                <Badge variant="outline">Live Feed</Badge>
                <Badge className="ml-auto">
                  {latestCoins.length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LatestMints
                coins={latestCoins}
                onSelectCoin={handleSelectCoinFromMints}
                className="max-w-full"
              />
            </CardContent>
          </Card>
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
    </div>
  );
};