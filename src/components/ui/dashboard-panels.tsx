import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Cpu,
  Network,
  Zap,
  Database,
  Signal,
  Globe,
  Eye,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Radar
} from 'lucide-react';

interface MetricValue {
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface ProcessingPanelProps {
  className?: string;
}

export const SolanaNetworkPanel: React.FC<ProcessingPanelProps> = ({ className }) => {
  const [solPrice, setSolPrice] = useState(142.35);
  const [tps, setTps] = useState(3847);
  const [validators, setValidators] = useState(1234);
  const [epochProgress, setEpochProgress] = useState(67);

  useEffect(() => {
    const interval = setInterval(() => {
      setSolPrice(prev => Math.max(120, Math.min(200, prev + (Math.random() - 0.5) * 2)));
      setTps(prev => Math.max(2000, Math.min(5000, prev + (Math.random() - 0.5) * 200)));
      setValidators(prev => Math.max(1200, Math.min(1300, prev + (Math.random() - 0.5) * 5)));
      setEpochProgress(prev => (prev + 0.1) % 100);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={cn("spy-border bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Network className="h-4 w-4 text-primary animate-pulse" />
          Solana Network
          <Badge variant="outline" className="ml-auto">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">SOL Price</span>
            <div className="text-lg font-mono font-bold text-green-500">
              ${solPrice.toFixed(2)}
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">TPS</span>
            <div className="text-lg font-mono font-bold">
              {Math.round(tps).toLocaleString()}
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Validators</span>
            <div className="text-lg font-mono font-bold">
              {Math.round(validators).toLocaleString()}
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Epoch</span>
            <div className="text-lg font-mono font-bold">
              {Math.round(epochProgress)}%
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Epoch Progress</span>
            <span>{epochProgress.toFixed(1)}%</span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-1000"
              style={{ width: `${epochProgress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">Network Health</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-mono">Healthy</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const SystemMonitorPanel: React.FC<ProcessingPanelProps> = ({ className }) => {
  const [cpuUsage, setCpuUsage] = useState(45);
  const [memoryUsage, setMemoryUsage] = useState(67);
  const [diskUsage, setDiskUsage] = useState(23);
  const [networkLoad, setNetworkLoad] = useState(89);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.max(20, Math.min(90, prev + (Math.random() - 0.5) * 10)));
      setMemoryUsage(prev => Math.max(30, Math.min(85, prev + (Math.random() - 0.5) * 8)));
      setDiskUsage(prev => Math.max(15, Math.min(60, prev + (Math.random() - 0.5) * 5)));
      setNetworkLoad(prev => Math.max(60, Math.min(95, prev + (Math.random() - 0.5) * 12)));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds: [number, number]) => {
    if (value < thresholds[0]) return 'text-green-500';
    if (value < thresholds[1]) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className={cn("spy-border bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Cpu className="h-4 w-4 text-primary" />
          System Monitor
          <div className="flex gap-1 ml-auto">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          { label: 'CPU', value: cpuUsage, icon: Cpu, thresholds: [70, 85] as [number, number] },
          { label: 'Memory', value: memoryUsage, icon: Database, thresholds: [75, 90] as [number, number] },
          { label: 'Disk I/O', value: diskUsage, icon: BarChart3, thresholds: [50, 80] as [number, number] },
          { label: 'Network', value: networkLoad, icon: Signal, thresholds: [80, 95] as [number, number] }
        ].map(({ label, value, icon: Icon, thresholds }) => (
          <div key={label} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <span className={cn("text-sm font-mono font-bold", getStatusColor(value, thresholds))}>
                {Math.round(value)}%
              </span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-1000",
                  value < thresholds[0] ? "bg-green-500" :
                  value < thresholds[1] ? "bg-yellow-500" : "bg-red-500"
                )}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export const SecurityStatusPanel: React.FC<ProcessingPanelProps> = ({ className }) => {
  const [threats, setThreats] = useState(3);
  const [scansCompleted, setScansCompleted] = useState(847);
  const [activeScanners, setActiveScanners] = useState(12);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setThreats(prev => Math.max(0, Math.min(15, prev + (Math.random() - 0.7))));
      setScansCompleted(prev => prev + Math.floor(Math.random() * 3));
      setActiveScanners(prev => Math.max(8, Math.min(16, prev + (Math.random() - 0.5) * 2)));
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={cn("spy-border bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4 text-primary" />
          Security Status
          <Badge variant={threats > 5 ? "destructive" : "outline"} className="ml-auto">
            {threats > 5 ? "Alert" : "Secure"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3 w-3 text-red-500" />
              <span className="text-xs text-muted-foreground">Threats</span>
            </div>
            <div className="text-lg font-mono font-bold text-red-500">
              {Math.round(threats)}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-xs text-muted-foreground">Scans</span>
            </div>
            <div className="text-lg font-mono font-bold text-green-500">
              {scansCompleted.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Active Scanners</span>
            <div className="flex items-center gap-2">
              <Radar className="h-3 w-3 text-primary animate-spin" />
              <span className="text-sm font-mono">{Math.round(activeScanners)}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Last Update</span>
            <span className="font-mono">{lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const DataProcessingPanel: React.FC<ProcessingPanelProps> = ({ className }) => {
  const [processed, setProcessed] = useState(12847);
  const [rate, setRate] = useState(234);
  const [queue, setQueue] = useState(45);
  const [efficiency, setEfficiency] = useState(94.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setProcessed(prev => prev + Math.floor(Math.random() * 5 + 1));
      setRate(prev => Math.max(150, Math.min(400, prev + (Math.random() - 0.5) * 20)));
      setQueue(prev => Math.max(20, Math.min(80, prev + (Math.random() - 0.5) * 10)));
      setEfficiency(prev => Math.max(85, Math.min(99, prev + (Math.random() - 0.5) * 2)));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={cn("spy-border bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4 text-primary animate-pulse" />
          Data Processing
          <Badge variant="outline" className="ml-auto">
            {efficiency.toFixed(1)}% Efficiency
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Records/min</span>
            <div className="text-lg font-mono font-bold text-primary">
              {Math.round(rate).toLocaleString()}
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Queue</span>
            <div className="text-lg font-mono font-bold">
              {Math.round(queue)}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Processing Rate</span>
            <span>{Math.round((rate / 400) * 100)}%</span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-1000"
              style={{ width: `${(rate / 400) * 100}%` }}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Total Processed</span>
            <span className="font-mono font-bold">{processed.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const MarketOverviewPanel: React.FC<ProcessingPanelProps> = ({ className }) => {
  const [marketCap, setMarketCap] = useState(2.4);
  const [volume, setVolume] = useState(89.2);
  const [activeTokens, setActiveTokens] = useState(1847);
  const [sentiment, setSentiment] = useState(68);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketCap(prev => Math.max(1.8, Math.min(3.2, prev + (Math.random() - 0.5) * 0.1)));
      setVolume(prev => Math.max(50, Math.min(150, prev + (Math.random() - 0.5) * 5)));
      setActiveTokens(prev => prev + Math.floor(Math.random() * 3));
      setSentiment(prev => Math.max(30, Math.min(90, prev + (Math.random() - 0.5) * 5)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={cn("spy-border bg-card/50 backdrop-blur-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Globe className="h-4 w-4 text-primary" />
          Market Overview
          <Badge variant="outline" className="ml-auto">Real-time</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Market Cap</span>
            <div className="text-lg font-mono font-bold text-green-500">
              ${marketCap.toFixed(2)}T
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">24h Volume</span>
            <div className="text-lg font-mono font-bold text-blue-500">
              ${volume.toFixed(1)}B
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Market Sentiment</span>
            <span className={sentiment > 60 ? "text-green-500" : sentiment > 40 ? "text-yellow-500" : "text-red-500"}>
              {Math.round(sentiment)}%
            </span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-1000",
                sentiment > 60 ? "bg-green-500" : sentiment > 40 ? "bg-yellow-500" : "bg-red-500"
              )}
              style={{ width: `${sentiment}%` }}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Active Tokens</span>
            <span className="font-mono font-bold">{activeTokens.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};