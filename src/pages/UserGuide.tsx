import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  TrendingUp, 
  Shield, 
  Zap, 
  Target, 
  AlertTriangle, 
  BarChart3, 
  Coins, 
  Eye, 
  Rocket,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import mascot from '@/assets/mascot.png';

const UserGuide = () => {
  useEffect(() => {
    document.title = 'Complete User Guide - AIMS Meme Coin Intelligence Platform';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Master AIMS with our comprehensive user guide. Learn how to analyze meme coins, perform deep scans, assess risks, and make informed crypto investment decisions with our advanced intelligence platform.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Master AIMS with our comprehensive user guide. Learn how to analyze meme coins, perform deep scans, assess risks, and make informed crypto investment decisions with our advanced intelligence platform.';
      document.head.appendChild(meta);
    }
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src={mascot} 
              alt="AIMS Mascot - Meme Coin Intelligence" 
              className="w-16 h-16 rounded-lg"
            />
            <div>
              <h1 className="text-4xl font-bold spy-gradient bg-clip-text text-transparent">
                Complete User Guide
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Master the Art of Meme Coin Intelligence
              </p>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Welcome to the ultimate guide for navigating the volatile world of meme coin investments. 
            Learn how to use AIMS's advanced intelligence platform to analyze, evaluate, and track 
            meme coins with professional-grade tools and AI-powered insights.
          </p>
          
          {/* Risk Warning */}
          <Card className="max-w-4xl mx-auto mb-8 border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-6 w-6" />
                Important Risk Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive font-medium">
                <strong>EDUCATIONAL PURPOSES ONLY:</strong> This platform and guide are for educational 
                and entertainment purposes only. Meme coin investing carries extremely high risk and you 
                could lose your entire investment. Never invest more than you can afford to lose. 
                Always conduct your own research and consider consulting with a financial advisor.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Table of Contents */}
        <section className="mb-12">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Table of Contents</CardTitle>
              <CardDescription>
                Navigate through this comprehensive guide to master every feature
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="justify-start h-auto p-3 w-full"
                    onClick={() => scrollToSection('getting-started')}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Getting Started
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start h-auto p-3 w-full"
                    onClick={() => scrollToSection('quick-scan')}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Quick Scan Tutorial
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start h-auto p-3 w-full"
                    onClick={() => scrollToSection('deep-scan')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Deep Scan Mastery
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start h-auto p-3 w-full"
                    onClick={() => scrollToSection('risk-assessment')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Risk Assessment Guide
                  </Button>
                </div>
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="justify-start h-auto p-3 w-full"
                    onClick={() => scrollToSection('latest-mints')}
                  >
                    <Coins className="h-4 w-4 mr-2" />
                    Latest Mints Tracking
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start h-auto p-3 w-full"
                    onClick={() => scrollToSection('spy-points')}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Spy Points System
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start h-auto p-3 w-full"
                    onClick={() => scrollToSection('pro-features')}
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Pro Features
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start h-auto p-3 w-full"
                    onClick={() => scrollToSection('best-practices')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Best Practices
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Getting Started */}
          <section id="getting-started">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Rocket className="h-8 w-8 text-primary" />
              Getting Started with AIMS
            </h2>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>What is AIMS?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  AIMS is the most advanced meme coin intelligence platform designed to help traders, 
                  investors, and researchers navigate the chaotic world of meme cryptocurrencies. Our 
                  platform combines real-time blockchain data, AI-powered analysis, and comprehensive 
                  risk assessment tools to provide you with the insights you need.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <Search className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold">Real-Time Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Instant access to live market data and technical indicators
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold">Risk Assessment</h4>
                    <p className="text-sm text-muted-foreground">
                      AI-powered risk scoring and legitimacy analysis
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold">Market Intelligence</h4>
                    <p className="text-sm text-muted-foreground">
                      Advanced analytics and trend prediction
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Quick Scan */}
          <section id="quick-scan">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Search className="h-8 w-8 text-primary" />
              Quick Scan Tutorial
            </h2>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Performing Your First Quick Scan</CardTitle>
                <CardDescription>
                  Get instant basic information about any meme coin in seconds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Badge variant="outline" className="rounded-full w-8 h-8 flex items-center justify-center">1</Badge>
                    <div>
                      <h4 className="font-semibold mb-2">Enter Token Address or Symbol</h4>
                      <p className="text-muted-foreground">
                        Paste the contract address or enter the token symbol in the search bar. 
                        Our system supports all major blockchains including Ethereum, Solana, and BSC.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Badge variant="outline" className="rounded-full w-8 h-8 flex items-center justify-center">2</Badge>
                    <div>
                      <h4 className="font-semibold mb-2">Review Basic Metrics</h4>
                      <p className="text-muted-foreground">
                        Instantly see current price, market cap, 24h volume, price changes, 
                        and holder distribution. This gives you a quick snapshot of the token's current state.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Badge variant="outline" className="rounded-full w-8 h-8 flex items-center justify-center">3</Badge>
                    <div>
                      <h4 className="font-semibold mb-2">Analyze Initial Data</h4>
                      <p className="text-muted-foreground">
                        Use the quick scan results to determine if the token warrants further investigation. 
                        Look for red flags like extremely low liquidity or suspicious holder patterns.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Deep Scan */}
          <section id="deep-scan">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Eye className="h-8 w-8 text-primary" />
              Deep Scan Mastery
            </h2>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Advanced Analysis Features</CardTitle>
                <CardDescription>
                  Unlock the full power of our AI-driven comprehensive analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Technical Analysis
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Support and resistance levels</li>
                      <li>• Moving averages and trend indicators</li>
                      <li>• Volume analysis and trading patterns</li>
                      <li>• Momentum indicators (RSI, MACD)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Assessment
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Smart contract audit results</li>
                      <li>• Liquidity lock verification</li>
                      <li>• Ownership renouncement check</li>
                      <li>• Honeypot and rug pull detection</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Legitimacy Score
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Team transparency analysis</li>
                      <li>• Social media presence verification</li>
                      <li>• Community engagement metrics</li>
                      <li>• Project roadmap assessment</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Reward Potential
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• AI-predicted price targets</li>
                      <li>• Risk-adjusted return analysis</li>
                      <li>• Market timing recommendations</li>
                      <li>• Comparative performance metrics</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Risk Assessment */}
          <section id="risk-assessment">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Understanding Risk Assessment
            </h2>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Risk Scoring System</CardTitle>
                <CardDescription>
                  Learn how our AI evaluates and scores investment risk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="text-2xl font-bold text-green-600 mb-2">0-3</div>
                      <h4 className="font-semibold text-green-700">Low Risk</h4>
                      <p className="text-sm text-muted-foreground">
                        Established tokens with strong fundamentals
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <div className="text-2xl font-bold text-yellow-600 mb-2">4-6</div>
                      <h4 className="font-semibold text-yellow-700">Medium Risk</h4>
                      <p className="text-sm text-muted-foreground">
                        Moderate risk with potential upside
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="text-2xl font-bold text-red-600 mb-2">7-10</div>
                      <h4 className="font-semibold text-red-700">High Risk</h4>
                      <p className="text-sm text-muted-foreground">
                        Extreme caution advised
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Risk Factors Analyzed:</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-sm">
                        <li>• Liquidity depth and stability</li>
                        <li>• Token distribution and whale presence</li>
                        <li>• Contract security and audit status</li>
                        <li>• Team doxxing and reputation</li>
                      </ul>
                      <ul className="space-y-2 text-sm">
                        <li>• Market volatility and volume</li>
                        <li>• Social sentiment and hype cycles</li>
                        <li>• Technical indicator alignment</li>
                        <li>• Historical performance patterns</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Latest Mints */}
          <section id="latest-mints">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Coins className="h-8 w-8 text-primary" />
              Latest Mints Tracking
            </h2>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Discover New Opportunities</CardTitle>
                <CardDescription>
                  Stay ahead of the curve with real-time new token detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    Our Latest Mints feature monitors blockchain networks 24/7 to identify newly 
                    created meme coins the moment they launch. This gives you the opportunity to 
                    discover potential gems before they gain mainstream attention.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">What We Track:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• New token deployments</li>
                        <li>• Initial liquidity additions</li>
                        <li>• Early trading activity</li>
                        <li>• Social media mentions</li>
                        <li>• Developer activity</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Early Warning Indicators:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Unusual volume spikes</li>
                        <li>• Rapid holder growth</li>
                        <li>• Viral social content</li>
                        <li>• Celebrity endorsements</li>
                        <li>• Exchange listing rumors</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Spy Points */}
          <section id="spy-points">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              Spy Points System
            </h2>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Earn and Use Spy Points</CardTitle>
                <CardDescription>
                  Unlock advanced features through our gamified point system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Ways to Earn Points:</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 px-3 rounded bg-muted">
                          <span className="text-sm">Daily login</span>
                          <Badge variant="secondary">+10</Badge>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 rounded bg-muted">
                          <span className="text-sm">Quick scan</span>
                          <Badge variant="secondary">+5</Badge>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 rounded bg-muted">
                          <span className="text-sm">Deep scan</span>
                          <Badge variant="secondary">+15</Badge>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 rounded bg-muted">
                          <span className="text-sm">Share analysis</span>
                          <Badge variant="secondary">+20</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Spend Points On:</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 px-3 rounded bg-muted">
                          <span className="text-sm">Priority alerts</span>
                          <Badge variant="outline">-50</Badge>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 rounded bg-muted">
                          <span className="text-sm">Advanced charts</span>
                          <Badge variant="outline">-100</Badge>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 rounded bg-muted">
                          <span className="text-sm">Custom watchlists</span>
                          <Badge variant="outline">-200</Badge>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 rounded bg-muted">
                          <span className="text-sm">API access</span>
                          <Badge variant="outline">-500</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Pro Features */}
          <section id="pro-features">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Rocket className="h-8 w-8 text-primary" />
              Pro Features
            </h2>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Unlock Professional-Grade Tools</CardTitle>
                <CardDescription>
                  Take your meme coin analysis to the next level with Pro features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Advanced Analytics</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Unlimited deep scans</li>
                      <li>• Real-time price alerts</li>
                      <li>• Advanced technical indicators</li>
                      <li>• Portfolio tracking and management</li>
                      <li>• Historical data analysis</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Exclusive Features</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Priority customer support</li>
                      <li>• Early access to new features</li>
                      <li>• Custom dashboard layouts</li>
                      <li>• API access for developers</li>
                      <li>• Advanced risk modeling</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Button size="lg" onClick={() => window.location.href = '/payment'}>
                    <Rocket className="h-4 w-4 mr-2" />
                    Upgrade to Pro Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Best Practices */}
          <section id="best-practices">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-primary" />
              Best Practices & Tips
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">✅ Do These</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li>• Always perform deep scans on potential investments</li>
                    <li>• Set stop-loss orders to limit downside risk</li>
                    <li>• Diversify across multiple projects</li>
                    <li>• Monitor social sentiment and news</li>
                    <li>• Use our risk scores as a guide</li>
                    <li>• Start with small position sizes</li>
                    <li>• Keep detailed records of all trades</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">❌ Avoid These</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li>• Investing based on hype alone</li>
                    <li>• Ignoring high-risk warnings</li>
                    <li>• FOMO buying at peak prices</li>
                    <li>• Investing more than you can afford to lose</li>
                    <li>• Neglecting to verify contract addresses</li>
                    <li>• Trading without setting exit strategies</li>
                    <li>• Following anonymous "influencers" blindly</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Final CTA */}
          <section className="text-center py-12">
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-4">Ready to Become a Meme Coin Spy?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Armed with this knowledge, you're ready to navigate the meme coin market like a pro. 
                  Remember: knowledge is power, but risk management is survival.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={() => window.location.href = '/'}>
                    <Search className="h-4 w-4 mr-2" />
                    Start Analyzing Now
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => window.location.href = '/features'}>
                    <Eye className="h-4 w-4 mr-2" />
                    Explore Features
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserGuide;