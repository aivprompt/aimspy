import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import mascot from '@/assets/mascot.png';

export const Header = () => {

  return (
    <header className="spy-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Mascot */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => window.location.href = '/'}
          >
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
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/features'}
            >
              Features
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/user-guide'}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              User Guide
            </Button>
            
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