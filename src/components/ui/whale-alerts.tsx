import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Wallet, TrendingDown, TrendingUp, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface WhaleAlert {
  id: string;
  type: 'LARGE_SELL' | 'LARGE_BUY' | 'WHALE_ACCUMULATION';
  walletAddress: string;
  amount: number;
  percentage: number;
  timestamp: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;
  transactionHash: string;
}

interface MovementPattern {
  id: string;
  pattern: string;
  description: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  affectedWallets: number;
  totalVolume: number;
  timeWindow: string;
  confidence: number;
}

interface WhaleAlertsProps {
  tokenAddress: string;
  holders: any[];
}

export const WhaleAlerts = ({ tokenAddress, holders }: WhaleAlertsProps) => {
  const [alerts, setAlerts] = useState<WhaleAlert[]>([]);
  const [patterns, setPatterns] = useState<MovementPattern[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWhaleData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('whale-alerts', {
        body: { tokenAddress, holders }
      });

      if (error) throw error;
      
      if (data.success) {
        setAlerts(data.whaleAlerts);
        setPatterns(data.movementPatterns);
      } else {
        throw new Error(data.error || 'Failed to fetch whale data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch whale alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenAddress) {
      fetchWhaleData();
    }
  }, [tokenAddress]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'LARGE_SELL': return <TrendingDown className="h-4 w-4 text-red-400" />;
      case 'LARGE_BUY': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'WHALE_ACCUMULATION': return <Activity className="h-4 w-4 text-blue-400" />;
      default: return <Wallet className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'secondary';
      case 'LOW': return 'outline';
      default: return 'outline';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'secondary';
      case 'LOW': return 'outline';
      default: return 'outline';
    }
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(2)}K`;
    return amount.toFixed(2);
  };

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Whale Movement Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Whale Movement Alerts
        </CardTitle>
        <CardDescription>Monitor large holder activity and suspicious patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchWhaleData} size="sm">
              Retry
            </Button>
          </div>
        )}

        {patterns.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Movement Patterns
            </h4>
            {patterns.map((pattern) => (
              <div key={pattern.id} className="p-3 border border-border/50 rounded-lg bg-background/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{pattern.pattern.replace(/_/g, ' ')}</span>
                  <Badge variant={getRiskColor(pattern.riskLevel)}>
                    {pattern.riskLevel}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{pattern.description}</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Volume: {formatAmount(pattern.totalVolume)}</span>
                  <span>Confidence: {(pattern.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {alerts.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Recent Alerts</h4>
            {alerts.map((alert) => (
              <div key={alert.id} className="p-3 border border-border/50 rounded-lg bg-background/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getAlertIcon(alert.type)}
                    <span className="font-medium text-sm">
                      {alert.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <Badge variant={getImpactColor(alert.impact)}>
                    {alert.impact}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>{formatAmount(alert.amount)} ({alert.percentage.toFixed(2)}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wallet:</span>
                    <span className="font-mono">{alert.walletAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence:</span>
                    <span>{(alert.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {alerts.length === 0 && patterns.length === 0 && !loading && !error && (
          <div className="text-center py-4 text-muted-foreground">
            No whale activity detected recently
          </div>
        )}

        <Button onClick={fetchWhaleData} className="w-full" size="sm">
          Refresh Alerts
        </Button>
      </CardContent>
    </Card>
  );
};