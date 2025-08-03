import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Rocket, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  BarChart3,
  Target,
  Zap,
  Eye,
  RefreshCw
} from 'lucide-react';
import { MemeCoin } from '@/types/meme-coin';
import { useBirdeyePolling } from '@/hooks/useHeliusPolling';
import { RiskGauge } from '@/components/ui/risk-gauge';

export const AIMSDashboard: React.FC = () => {
  const { coins, isLoading, lastUpdate } = useBirdeyePolling();
  const [selectedCoin, setSelectedCoin] = useState<MemeCoin | null>(null);
  const [filterAge, setFilterAge] = useState<number>(30); // days

  // Filter coins to show only those created in the last X days
  const filteredCoins = coins.filter(coin => {
    const ageInDays = coin.age / (24 * 60 * 60);
    return ageInDays <= filterAge;
  });

  const totalScanned = filteredCoins.length;
  const legitimateCoins = filteredCoins.filter(coin => coin.legitScore >= 7).length;
  const dangerousCoins = filteredCoins.filter(coin => coin.riskScore >= 7).length;

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatAge = (ageInSeconds: number) => {
    const days = Math.floor(ageInSeconds / (24 * 60 * 60));
    const hours = Math.floor((ageInSeconds % (24 * 60 * 60)) / (60 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const getRiskLevel = (score: number) => {
    if (score <= 3) return { label: 'Low', color: 'bg-green-500' };
    if (score <= 6) return { label: 'Medium', color: 'bg-yellow-500' };
    return { label: 'High', color: 'bg-red-500' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Rocket className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              AIMS Dashboard
            </h1>
            <Zap className="h-8 w-8 text-cyan-400" />
          </div>
          <p className="text-slate-300 text-lg">
            Advanced Intelligence Meme Scanning • Newly Minted Solana Coins
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-blue-500/30 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Eye className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{totalScanned}</p>
                  <p className="text-slate-400 text-sm">Coins Scanned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-green-500/30 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{legitimateCoins}</p>
                  <p className="text-slate-400 text-sm">Legitimate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-red-500/30 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-8 w-8 text-red-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{dangerousCoins}</p>
                  <p className="text-slate-400 text-sm">High Risk</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <RefreshCw className={`h-8 w-8 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
                <div>
                  <p className="text-2xl font-bold text-white">{filterAge}d</p>
                  <p className="text-slate-400 text-sm">Age Filter</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coin List */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-slate-800/50 border-blue-500/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  <span>Recently Minted Coins</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Coins created in the last {filterAge} days • Last update: {lastUpdate?.toLocaleTimeString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredCoins.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    {isLoading ? 'Loading coins...' : 'No coins found matching criteria'}
                  </div>
                ) : (
                  filteredCoins.map((coin) => (
                    <div
                      key={coin.address}
                      onClick={() => setSelectedCoin(coin)}
                      className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-blue-500/50 cursor-pointer transition-all duration-200 hover:bg-slate-700/70"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-white">{coin.symbol}</h3>
                            <Badge variant={coin.priceChange24h >= 0 ? "default" : "destructive"}>
                              {coin.priceChange24h >= 0 ? '+' : ''}{coin.priceChange24h.toFixed(2)}%
                            </Badge>
                            <Badge variant="outline" className="text-slate-300">
                              {formatAge(coin.age)}
                            </Badge>
                          </div>
                          <p className="text-slate-400 text-sm">{coin.name}</p>
                          <div className="flex space-x-4 text-sm text-slate-300">
                            <span>MC: {formatCurrency(coin.marketCap)}</span>
                            <span>Vol: {formatCurrency(coin.volume24h)}</span>
                            <span>Price: {formatCurrency(coin.price)}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <RiskGauge value={coin.riskScore} type="risk" size="sm" />
                          <RiskGauge value={coin.legitScore} type="legit" size="sm" />
                          <RiskGauge value={coin.rewardScore} type="reward" size="sm" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coin Details */}
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-cyan-400" />
                  <span>Coin Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCoin ? (
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
                      <TabsTrigger value="overview" className="text-slate-300">Overview</TabsTrigger>
                      <TabsTrigger value="holders" className="text-slate-300">Holders</TabsTrigger>
                      <TabsTrigger value="risk" className="text-slate-300">Risk</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white">{selectedCoin.symbol}</h3>
                        <p className="text-slate-400">{selectedCoin.name}</p>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="space-y-1">
                            <p className="text-slate-400">Market Cap</p>
                            <p className="text-white font-medium">{formatCurrency(selectedCoin.marketCap)}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-slate-400">Price</p>
                            <p className="text-white font-medium">{formatCurrency(selectedCoin.price)}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-slate-400">24h Volume</p>
                            <p className="text-white font-medium">{formatCurrency(selectedCoin.volume24h)}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-slate-400">Age</p>
                            <p className="text-white font-medium">{formatAge(selectedCoin.age)}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-slate-400 text-sm mb-2">Scores</p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-300">Risk Score</span>
                                <RiskGauge value={selectedCoin.riskScore} type="risk" size="sm" showLabel />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-300">Legit Score</span>
                                <RiskGauge value={selectedCoin.legitScore} type="legit" size="sm" showLabel />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-300">Reward Score</span>
                                <RiskGauge value={selectedCoin.rewardScore} type="reward" size="sm" showLabel />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="holders" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-blue-400" />
                          <span className="text-white font-medium">
                            {selectedCoin.holders?.total || 0} Total Holders
                          </span>
                        </div>
                        
                        {selectedCoin.holders?.data?.slice(0, 5).map((holder, index) => (
                          <div key={holder.address} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                            <div>
                              <p className="text-slate-300 text-sm">#{index + 1}</p>
                              <p className="text-xs text-slate-400 font-mono">
                                {holder.address.slice(0, 8)}...{holder.address.slice(-8)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-white text-sm">{holder.percent.toFixed(2)}%</p>
                              <p className="text-slate-400 text-xs">{formatCurrency(holder.amount)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="risk" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        <div className="p-3 bg-slate-700/30 rounded-lg">
                          <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-400" />
                            <span>Risk Assessment</span>
                          </h4>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Overall Risk</span>
                              <span className={`font-medium ${
                                selectedCoin.riskScore <= 3 ? 'text-green-400' :
                                selectedCoin.riskScore <= 6 ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {getRiskLevel(selectedCoin.riskScore).label}
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-slate-400">Liquidity</span>
                              <span className="text-white">{formatCurrency(selectedCoin.liquidity)}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-slate-400">Age Factor</span>
                              <span className={`font-medium ${
                                selectedCoin.age < 86400 ? 'text-red-400' : 
                                selectedCoin.age < 604800 ? 'text-yellow-400' : 'text-green-400'
                              }`}>
                                {selectedCoin.age < 86400 ? 'Very New' :
                                 selectedCoin.age < 604800 ? 'New' : 'Established'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {selectedCoin.recommendation && (
                          <div className="p-3 bg-slate-700/30 rounded-lg">
                            <h4 className="text-white font-medium mb-2">Recommendation</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Action</span>
                                <Badge variant={selectedCoin.recommendation.shouldInvest ? "default" : "destructive"}>
                                  {selectedCoin.recommendation.shouldInvest ? 'Consider' : 'Avoid'}
                                </Badge>
                              </div>
                              {selectedCoin.recommendation.shouldInvest && (
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Suggested Amount</span>
                                  <span className="text-white">{formatCurrency(selectedCoin.recommendation.suggestedAmount)}</span>
                                </div>
                              )}
                              <p className="text-slate-300 text-xs mt-2">{selectedCoin.recommendation.reasoning}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Target className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                    <p>Select a coin to view detailed analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};