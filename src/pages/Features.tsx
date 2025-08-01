import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Zap, 
  Eye, 
  Shield, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Coins, 
  Rocket, 
  Brain, 
  Clock, 
  Globe, 
  Lock,
  AlertTriangle,
  CheckCircle,
  Star,
  Users,
  Smartphone,
  Database
} from 'lucide-react';
import mascot from '@/assets/mascot.png';

const Features = () => {
  useEffect(() => {
    document.title = 'Advanced Features - Spy HQ Meme Coin Intelligence Platform';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover Spy HQ\'s powerful features for meme coin analysis. Real-time intelligence, AI-powered risk assessment, deep scanning technology, and professional-grade tools for crypto traders and investors.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Discover Spy HQ\'s powerful features for meme coin analysis. Real-time intelligence, AI-powered risk assessment, deep scanning technology, and professional-grade tools for crypto traders and investors.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-8">
            <img 
              src={mascot} 
              alt="Spy HQ Mascot - Advanced Meme Coin Intelligence" 
              className="w-20 h-20 rounded-lg animate-pulse"
            />
            <div>
              <h1 className="text-5xl font-bold spy-gradient bg-clip-text text-transparent">
                Revolutionary Features
              </h1>
              <p className="text-2xl text-muted-foreground mt-2">
                The Most Advanced Meme Coin Intelligence Platform
              </p>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
            Experience the future of cryptocurrency analysis with our cutting-edge AI technology, 
            real-time blockchain monitoring, and professional-grade tools that give you the edge 
            in the volatile meme coin market.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Brain className="h-5 w-5 mr-2" />
              AI-Powered Analysis
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Clock className="h-5 w-5 mr-2" />
              Real-Time Data
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Shield className="h-5 w-5 mr-2" />
              Risk Assessment
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Globe className="h-5 w-5 mr-2" />
              Multi-Chain Support
            </Badge>
          </div>
        </section>

        {/* Core Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Core Intelligence Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Quick Scan */}
            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Zap className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle>Lightning Quick Scan</CardTitle>
                </div>
                <CardDescription>
                  Get instant insights on any meme coin in under 3 seconds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Real-time price and volume data
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Market cap and holder analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Liquidity depth assessment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Basic legitimacy check
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Deep Scan */}
            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Eye className="h-6 w-6 text-purple-500" />
                  </div>
                  <CardTitle>AI Deep Scan</CardTitle>
                </div>
                <CardDescription>
                  Comprehensive AI-powered analysis with 50+ data points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Smart contract security audit
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Rug pull detection algorithms
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Social sentiment analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Investment recommendation AI
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <Shield className="h-6 w-6 text-red-500" />
                  </div>
                  <CardTitle>Advanced Risk Scoring</CardTitle>
                </div>
                <CardDescription>
                  Military-grade risk assessment with 10-point scoring system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Multi-factor risk algorithms
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Historical pattern analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Whale movement tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Liquidity stability metrics
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Technical Analysis */}
            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <BarChart3 className="h-6 w-6 text-green-500" />
                  </div>
                  <CardTitle>Pro Technical Analysis</CardTitle>
                </div>
                <CardDescription>
                  Professional-grade charting and technical indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Advanced candlestick patterns
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    RSI, MACD, Bollinger Bands
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Support/resistance levels
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Volume profile analysis
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Latest Mints */}
            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <Coins className="h-6 w-6 text-yellow-500" />
                  </div>
                  <CardTitle>Real-Time Mint Detection</CardTitle>
                </div>
                <CardDescription>
                  Discover new meme coins the second they launch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Instant new token alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Multi-blockchain monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Early opportunity identification
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Auto-scan new launches
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Spy Points */}
            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Target className="h-6 w-6 text-orange-500" />
                  </div>
                  <CardTitle>Gamified Spy Points</CardTitle>
                </div>
                <CardDescription>
                  Earn rewards for using the platform and unlock premium features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Daily login bonuses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Analysis completion rewards
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Premium feature unlocks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Leaderboard competitions
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* AI Technology Section */}
        <section className="mb-16 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Brain className="h-8 w-8 text-primary" />
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our proprietary artificial intelligence algorithms process thousands of data points 
              to provide you with unmatched accuracy and insights.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Machine Learning Models
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                    <span className="font-medium">Pattern Recognition</span>
                    <Badge variant="default">99.2% Accuracy</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                    <span className="font-medium">Sentiment Analysis</span>
                    <Badge variant="default">96.8% Accuracy</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                    <span className="font-medium">Risk Prediction</span>
                    <Badge variant="default">94.5% Accuracy</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                    <span className="font-medium">Price Forecasting</span>
                    <Badge variant="default">87.3% Accuracy</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Real-Time Data Processing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">1.2M+</div>
                    <p className="text-sm text-muted-foreground">Tokens Analyzed Daily</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">50+</div>
                    <p className="text-sm text-muted-foreground">Data Sources Monitored</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                    <p className="text-sm text-muted-foreground">Continuous Monitoring</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">&lt;3s</div>
                    <p className="text-sm text-muted-foreground">Average Response Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Platform Capabilities */}
        <section className="mb-16 py-12">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Capabilities</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                  <Smartphone className="h-8 w-8 text-blue-500" />
                </div>
                <CardTitle>Multi-Device Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access Spy HQ from any device - desktop, tablet, or mobile. 
                  Your analysis follows you wherever you go.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle>Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Bank-grade encryption and security measures protect your data 
                  and ensure privacy of your trading strategies.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <CardTitle>Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join thousands of traders sharing insights, strategies, 
                  and early alpha in our exclusive community.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Testimonials Section */}
        <section className="mb-16 py-12">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-yellow-500/20 bg-yellow-500/5">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <CardTitle className="text-lg">@CryptoMike_</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "Spy HQ saved me from at least 3 rug pulls this month. The AI deep scan 
                  is incredibly accurate - it's like having a team of analysts in your pocket!"
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-green-500/20 bg-green-500/5">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-green-500 text-green-500" />
                  ))}
                </div>
                <CardTitle className="text-lg">@DeFiQueen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "The latest mints feature helped me catch PEPE before it mooned 1000x. 
                  This platform is a game-changer for finding early gems!"
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-blue-500/20 bg-blue-500/5">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-blue-500 text-blue-500" />
                  ))}
                </div>
                <CardTitle className="text-lg">@WhaleWatcher</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "Professional-grade analysis that used to cost thousands per month. 
                  The ROI on my Spy HQ subscription pays for itself every single day."
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="text-center py-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Dominate the Meme Coin Market?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of successful traders who trust Spy HQ for their meme coin intelligence. 
                Don't trade blind - trade with purpose, precision, and power.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" className="text-lg px-8 py-4" onClick={() => window.location.href = '/'}>
                  <Zap className="h-5 w-5 mr-2" />
                  Start Free Analysis
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4" onClick={() => window.location.href = '/payment'}>
                  <Rocket className="h-5 w-5 mr-2" />
                  Upgrade to Pro
                </Button>
              </div>
              
              <div className="flex justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  No Credit Card Required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Instant Access
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Cancel Anytime
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Features;