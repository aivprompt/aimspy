import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, TrendingDown, Activity, Users, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SentimentData {
  overallSentiment: 'bullish' | 'bearish' | 'neutral';
  sentimentScore: number;
  confidence: number;
  keyFactors: string[];
  riskIndicators: string[];
  socialMomentum: 'high' | 'medium' | 'low';
  rugPullRisk: number;
  marketManipulation: number;
  whaleActivity: 'high' | 'medium' | 'low';
  communityHealth: number;
}

interface SentimentPanelProps {
  tokenSymbol: string;
  tokenName: string;
}

export const SentimentPanel = ({ tokenSymbol, tokenName }: SentimentPanelProps) => {
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSentiment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('sentiment-analysis', {
        body: {
          tokenSymbol,
          tokenName,
          recentPosts: [
            `$${tokenSymbol} looking bullish today! 🚀`,
            `Just bought more ${tokenName}, this one's going to moon`,
            `${tokenSymbol} chart looking good, potential breakout incoming`,
            `Community is strong on ${tokenName}, hodling long term`,
            `Big things coming for $${tokenSymbol} according to devs`
          ]
        }
      });

      if (error) throw error;
      
      if (data.success) {
        setSentimentData(data.analysis);
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze sentiment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenSymbol && tokenName) {
      analyzeSentiment();
    }
  }, [tokenSymbol, tokenName]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="h-4 w-4" />;
      case 'bearish': return <TrendingDown className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk > 0.7) return 'text-red-400';
    if (risk > 0.4) return 'text-yellow-400';
    return 'text-green-400';
  };

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Social Sentiment Analysis
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

  if (error || !sentimentData) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Social Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">{error || 'No sentiment data available'}</p>
            <Button onClick={analyzeSentiment} size="sm">
              Retry Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Social Sentiment Analysis
        </CardTitle>
        <CardDescription>AI-powered sentiment tracking for {tokenSymbol}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sentiment" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="sentiment" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getSentimentIcon(sentimentData.overallSentiment)}
                <span className={`font-semibold capitalize ${getSentimentColor(sentimentData.overallSentiment)}`}>
                  {sentimentData.overallSentiment}
                </span>
              </div>
              <Badge variant="outline">
                Score: {(sentimentData.sentimentScore * 100).toFixed(0)}%
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Confidence</span>
                <span>{(sentimentData.confidence * 100).toFixed(0)}%</span>
              </div>
              <Progress value={sentimentData.confidence * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Key Factors</h4>
              <div className="flex flex-wrap gap-2">
                {sentimentData.keyFactors.map((factor, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Social Momentum</h4>
              <Badge 
                variant={sentimentData.socialMomentum === 'high' ? 'default' : 'outline'}
                className="capitalize"
              >
                {sentimentData.socialMomentum}
              </Badge>
            </div>
          </TabsContent>

          <TabsContent value="risks" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Rug Pull Risk</span>
                  <span className={getRiskColor(sentimentData.rugPullRisk)}>
                    {(sentimentData.rugPullRisk * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress value={sentimentData.rugPullRisk * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Market Manipulation</span>
                  <span className={getRiskColor(sentimentData.marketManipulation)}>
                    {(sentimentData.marketManipulation * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress value={sentimentData.marketManipulation * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Indicators
                </h4>
                <div className="space-y-1">
                  {sentimentData.riskIndicators.map((risk, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      • {risk}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Community Health</span>
                <span className={getRiskColor(1 - sentimentData.communityHealth)}>
                  {(sentimentData.communityHealth * 100).toFixed(0)}%
                </span>
              </div>
              <Progress value={sentimentData.communityHealth * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Whale Activity</h4>
              <Badge 
                variant={sentimentData.whaleActivity === 'high' ? 'destructive' : 
                        sentimentData.whaleActivity === 'medium' ? 'secondary' : 'outline'}
                className="capitalize"
              >
                {sentimentData.whaleActivity}
              </Badge>
            </div>

            <Button onClick={analyzeSentiment} className="w-full" size="sm">
              Refresh Analysis
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};