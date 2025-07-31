import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, BookOpen } from 'lucide-react';
import mascot from '@/assets/mascot.png';

export const Header = () => {
  const [showUserGuide, setShowUserGuide] = useState(false);

  return (
    <header className="spy-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Mascot */}
          <div className="flex items-center gap-3">
            <img 
              src={mascot} 
              alt="Spy HQ Mascot" 
              className="w-10 h-10 rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold spy-gradient bg-clip-text text-transparent">
                Spy HQ
              </h1>
              <p className="text-xs text-muted-foreground">Meme Coin Intelligence</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <Dialog open={showUserGuide} onOpenChange={setShowUserGuide}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  User Guide
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <img src={mascot} alt="Mascot" className="w-6 h-6" />
                    How Spy HQ Works
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <div className="spy-border p-4 rounded-lg bg-destructive/10">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <h3 className="font-semibold text-destructive">High Risk Warning</h3>
                    </div>
                    <p className="text-destructive">
                      <strong>EDUCATIONAL PURPOSES ONLY:</strong> This platform is for educational and entertainment purposes only. 
                      Investing in meme coins carries extremely high risk and you could lose all your investment. 
                      Never invest more than you can afford to lose. Always do your own research.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">🔍 Quick Scan</h3>
                    <p>Get instant basic information about any meme coin including price, market cap, and basic metrics.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">🕵️ Deep Scan</h3>
                    <p>Perform comprehensive analysis including:</p>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>Risk assessment and scoring</li>
                      <li>Legitimacy analysis</li>
                      <li>Reward potential evaluation</li>
                      <li>AI-powered investment recommendations</li>
                      <li>Technical analysis and trends</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">📊 Latest Mints</h3>
                    <p>Monitor the newest meme coins as they're created on the blockchain.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">🎯 Spy Points</h3>
                    <p>Earn points by using the platform features. Points can be used for advanced features.</p>
                  </div>
                  
                  <div className="spy-border p-4 rounded-lg bg-muted">
                    <h3 className="font-semibold mb-2">Disclaimer</h3>
                    <p className="text-xs text-muted-foreground">
                      This tool provides analysis based on publicly available data and should not be considered financial advice. 
                      All cryptocurrency investments are speculative and carry significant risk. The developers are not responsible 
                      for any financial losses incurred through the use of this platform.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="default" 
              size="sm"
              onClick={() => window.location.href = '/payment'}
            >
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};