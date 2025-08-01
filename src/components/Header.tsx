import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* AIMS Logo */}
          <div 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => window.location.href = '/'}
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold text-yellow-400 tracking-wider">
                AIMS
              </h1>
              <p className="text-xs text-gray-400 tracking-wide mt-1">
                (ai-meme-spy)
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 px-6 py-2 rounded-md font-medium"
              onClick={() => window.location.href = '/'}
            >
              Home
            </Button>
            
            <Button 
              variant="ghost" 
              className="bg-gray-700 text-white hover:bg-gray-600 px-6 py-2 rounded-md font-medium"
              onClick={() => window.location.href = '/features'}
            >
              Studio
            </Button>
            
            <Button 
              variant="ghost" 
              className="bg-gray-700 text-white hover:bg-gray-600 px-6 py-2 rounded-md font-medium"
              onClick={() => window.location.href = '/user-guide'}
            >
              Guides
            </Button>
            
            <Button 
              variant="ghost" 
              className="bg-gray-700 text-white hover:bg-gray-600 px-6 py-2 rounded-md font-medium"
              onClick={() => window.location.href = '/payment'}
            >
              Membership
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};