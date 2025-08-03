import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Clock, 
  Wallet, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  BarChart2, 
  ShieldCheck 
} from 'lucide-react';
import type { MemeCoin } from '@/types/meme-coin';

// Mock fetch - Replace with real Helius/DexScreener/Solana RPC integration
const fetchNewlyMintedCoins = async (): Promise<MemeCoin[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Array.from({ length: 15 }, (_, i) => ({
    address: `Addr${i + 1}...${i + 10}`,
    symbol: ['WIF', 'BONK', 'POPCAT', 'PNUT', 'BOME', 'PEPE', 'DOGE', 'SHIB', 'FLOKI', 'MEW', 'BRETT', 'PONKE', 'MOUTAI', 'MYRO', 'SLERF'][i % 15],
    name: `Meme Coin ${i + 1}`,
    price: Math.random() * 0.1,
    marketCap: Math.random() * 100000000,
    volume24h: Math.random() * 5000000,
    liquidity: Math.random() * 1000000,
    age: Math.floor(Math.random() * 2592000), // Up to 30 days in seconds
    priceChange24h: (Math.random() - 0.5) * 200,
    priceChange1h: (Math.random() - 0.5) * 50,
    holders: {
      total: Math.floor(Math.random() * 10000) + 100,
      data: Array.from({ length: 10 }, () => ({
        address: `Wallet${Math.floor(Math.random() * 1000)}...`,
        amount: Math.random() * 1000000,
        percent: Math.random() * 20,
      })).sort((a, b) => b.amount - a.amount)
    },
    riskScore: Math.random() * 10,
    rewardScore: Math.random() * 10,
    legitScore: Math.random() * 10,
    dexScreenerUrl: `https://dexscreener.com/solana/coin${i + 1}`
  })).sort((a, b) => a.age - b.age); // Sort by age (newest first)
};

export const AIMSDashboard: React.FC = () => {
  const [coins, setCoins] = useState<MemeCoin[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<MemeCoin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<MemeCoin | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [network, setNetwork] = useState('mainnet');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchNewlyMintedCoins();
      setCoins(data);
      setFilteredCoins(data);
      setSelectedCoin(data[0] || null);
      setLoading(false);
    };
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [network]);

  useEffect(() => {
    const filtered = coins.filter(coin => 
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCoins(filtered);
  }, [searchQuery, coins]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-blue-600 font-semibold">Loading Solana Meme Coin Data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-blue-600">AIMS Solana Explorer</h1>
          <Select value={network} onValueChange={setNetwork}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mainnet">Mainnet</SelectItem>
              <SelectItem value="testnet">Testnet</SelectItem>
              <SelectItem value="devnet">Devnet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 w-96">
          <Input 
            placeholder="Search by symbol or address..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                New Coins (30d)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{coins.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Avg 24h Change
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {((coins.reduce((sum, c) => sum + c.priceChange24h, 0) / coins.length) || 0).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Avg Risk Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {((coins.reduce((sum, c) => sum + c.riskScore, 0) / coins.length) || 0).toFixed(1)}/10
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Total Holders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {coins.reduce((sum, c) => sum + c.holders.total, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coin List Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Minted Coins</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Market Cap</TableHead>
                    <TableHead>24h Change</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCoins.map(coin => (
                    <TableRow 
                      key={coin.address} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedCoin(coin)}
                    >
                      <TableCell className="font-medium">{coin.symbol}</TableCell>
                      <TableCell>{coin.address}</TableCell>
                      <TableCell>{Math.floor(coin.age / 86400)} days</TableCell>
                      <TableCell>${coin.price.toFixed(6)}</TableCell>
                      <TableCell>${(coin.marketCap / 1000000).toFixed(2)}M</TableCell>
                      <TableCell className={coin.priceChange24h > 0 ? 'text-green-600' : 'text-red-600'}>
                        {coin.priceChange24h.toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        <Badge variant={coin.riskScore > 7 ? 'destructive' : coin.riskScore < 4 ? 'secondary' : 'secondary'}>
                          {Math.round(coin.riskScore)}/10
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); window.open(coin.dexScreenerUrl, '_blank'); }}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Selected Coin Details */}
        {selectedCoin && (
          <Card>
            <CardHeader>
              <CardTitle>{selectedCoin.symbol} Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="holders">Holders</TabsTrigger>
                  <TabsTrigger value="developer">Developer</TabsTrigger>
                  <TabsTrigger value="charts">Charts</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Liquidity</div>
                      <div className="font-medium">${(selectedCoin.liquidity / 1000).toFixed(2)}K</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Volume 24h</div>
                      <div className="font-medium">${(selectedCoin.volume24h / 1000).toFixed(2)}K</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Legit Score</div>
                      <div className="font-medium">{Math.round(selectedCoin.legitScore)}/10</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Reward Score</div>
                      <div className="font-medium">{Math.round(selectedCoin.rewardScore)}/10</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Rug Pull Risk: {selectedCoin.holders.data[0]?.percent > 50 ? 'High (Concentrated Holders)' : 'Low'}
                  </div>
                </TabsContent>

                <TabsContent value="holders">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Wallet</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>%</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCoin.holders.data.map((holder, i) => (
                        <TableRow key={i}>
                          <TableCell>{holder.address}</TableCell>
                          <TableCell>{holder.amount.toLocaleString()}</TableCell>
                          <TableCell>{holder.percent.toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-2 text-sm text-gray-500">
                    Top 3 Concentration: {selectedCoin.holders.data.slice(0, 3).reduce((sum, h) => sum + h.percent, 0).toFixed(1)}%
                  </div>
                </TabsContent>

                <TabsContent value="developer">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Creator Wallet</span>
                      <span>N/A</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Deployment Date</span>
                      <span>N/A</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Other Coins</span>
                      <span>N/A</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="charts">
                  {/* Integrate charts here, e.g., from advanced-charts.tsx */}
                  <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
                    <BarChart2 className="h-8 w-8 text-gray-500" />
                    <span className="ml-2 text-gray-500">Price/Volume Chart (Placeholder)</span>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};