import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Brain, 
  Shield, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  Star,
  CheckCircle,
  Bot,
  Search,
  BarChart3,
  Users
} from "lucide-react";

const Index = () => {
  useEffect(() => {
    document.title = "AIMS - Advanced Intelligence for Meme Coin Success";
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'AIMS uses advanced AI to analyze meme coins, detect risks, and identify profitable opportunities. Get real-time insights, whale tracking, and rug pull protection.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'AIMS uses advanced AI to analyze meme coins, detect risks, and identify profitable opportunities. Get real-time insights, whale tracking, and rug pull protection.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            AIMS
          </h1>
          
          {/* Video Placeholder */}
          <div className="mb-8">
            <img 
              src="/lovable-uploads/d9771f59-3d9c-476a-8814-f520266907b8.png" 
              alt="Meme Coin Ecosystem - Solana Network" 
              className="mx-auto max-w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Advanced Intelligence for 
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Meme Coin Success</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
            AIMS harnesses cutting-edge AI to analyze meme coins in real-time, providing you with the intelligence needed to navigate the volatile world of cryptocurrency with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
              onClick={() => window.location.href = '/payment'}
            >
              Start Your Trial Today
            </Button>
            <Button variant="outline" size="lg" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3">
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Core Features</h2>
            <p className="text-xl text-gray-300">Everything you need to dominate the meme coin market</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-8 w-8 text-yellow-400" />
                  <CardTitle className="text-white text-xl">Lightning Quick Scan</CardTitle>
                </div>
                <CardDescription className="text-gray-300">
                  Analyze meme coins in under 3 seconds with our advanced AI engine
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-400">
                Get instant insights on token safety, liquidity, and potential red flags before making any investment decisions.
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="h-8 w-8 text-purple-400" />
                  <CardTitle className="text-white text-xl">AI Deep Scan</CardTitle>
                </div>
                <CardDescription className="text-gray-300">
                  Advanced machine learning algorithms analyze 50+ data points
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-400">
                Our AI examines social sentiment, developer activity, whale movements, and market patterns to provide comprehensive analysis.
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-8 w-8 text-green-400" />
                  <CardTitle className="text-white text-xl">Advanced Risk Scoring</CardTitle>
                </div>
                <CardDescription className="text-gray-300">
                  Proprietary risk assessment with 94% accuracy rate
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-400">
                Our risk model combines technical analysis with behavioral patterns to predict rug pulls and market manipulation.
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-8 w-8 text-red-400" />
                  <CardTitle className="text-white text-xl">Whale Tracking</CardTitle>
                </div>
                <CardDescription className="text-gray-300">
                  Monitor large wallet movements and insider activity
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-400">
                Track whale wallets, detect unusual trading patterns, and get alerted when big players make moves.
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-8 w-8 text-blue-400" />
                  <CardTitle className="text-white text-xl">Market Intelligence</CardTitle>
                </div>
                <CardDescription className="text-gray-300">
                  Real-time market data and trend analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-400">
                Access live price feeds, volume analysis, and market sentiment to time your entries and exits perfectly.
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="h-8 w-8 text-orange-400" />
                  <CardTitle className="text-white text-xl">Rug Pull Protection</CardTitle>
                </div>
                <CardDescription className="text-gray-300">
                  Early warning system for malicious tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-400">
                Our AI detects suspicious contract behaviors, hidden mint functions, and other red flags before you invest.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Technology Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">AI Technology</h2>
            <p className="text-xl text-gray-300">Powered by advanced machine learning and blockchain analysis</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Next-Generation Analysis Engine</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Bot className="h-6 w-6 text-purple-400 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Neural Network Processing</h4>
                    <p className="text-gray-400">Our deep learning models process thousands of data points simultaneously, identifying patterns invisible to traditional analysis.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Search className="h-6 w-6 text-blue-400 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Real-Time Blockchain Scanning</h4>
                    <p className="text-gray-400">Continuous monitoring of the Solana blockchain for new token deployments and suspicious activities.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <BarChart3 className="h-6 w-6 text-green-400 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Predictive Analytics</h4>
                    <p className="text-gray-400">Machine learning algorithms that predict price movements and identify high-potential investments.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700">
              <h4 className="text-xl font-bold text-white mb-6">Analysis Metrics</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Processing Speed</span>
                  <span className="text-green-400 font-semibold">&lt; 3 seconds</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Data Points Analyzed</span>
                  <span className="text-blue-400 font-semibold">50+ metrics</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Risk Accuracy</span>
                  <span className="text-purple-400 font-semibold">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Daily Scans</span>
                  <span className="text-yellow-400 font-semibold">10,000+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Platform Capabilities</h2>
            <p className="text-xl text-gray-300">Comprehensive tools for meme coin intelligence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Real-Time Detection
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-400">
                <ul className="space-y-2">
                  <li>• Instant new token detection</li>
                  <li>• Live price and volume monitoring</li>
                  <li>• Automated risk assessment</li>
                  <li>• Smart contract analysis</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Advanced Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-400">
                <ul className="space-y-2">
                  <li>• Social sentiment analysis</li>
                  <li>• Whale movement tracking</li>
                  <li>• Liquidity pool monitoring</li>
                  <li>• Developer wallet analysis</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Risk Management
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-400">
                <ul className="space-y-2">
                  <li>• Rug pull detection system</li>
                  <li>• Market manipulation alerts</li>
                  <li>• Portfolio risk assessment</li>
                  <li>• Custom risk thresholds</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Integration & Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-400">
                <ul className="space-y-2">
                  <li>• Discord & email notifications</li>
                  <li>• Mobile app access</li>
                  <li>• API integration support</li>
                  <li>• Custom alert system</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-300">Join thousands of successful meme coin traders</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-white text-lg">Sarah Chen</CardTitle>
                <CardDescription className="text-gray-400">Crypto Trader</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300">
                "AIMS saved me from three different rug pulls this month alone. The AI detection is incredibly accurate and the alerts are instant."
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-white text-lg">Marcus Rodriguez</CardTitle>
                <CardDescription className="text-gray-400">DeFi Investor</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300">
                "The whale tracking feature is game-changing. I can see exactly when big players are making moves and position myself accordingly."
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-white text-lg">Alex Thompson</CardTitle>
                <CardDescription className="text-gray-400">Portfolio Manager</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300">
                "AIMS increased my success rate by 300%. The risk scoring is so accurate, I rarely make bad investments anymore."
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Dominate the Meme Coin Market?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of traders using AIMS to make smarter investments and avoid costly mistakes.
          </p>
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
              onClick={() => window.location.href = '/payment'}
            >
              Start Your Trial Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
