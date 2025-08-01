import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* AIMS Logo */}
          <div 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
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
              className={cn(
                "px-6 py-2 rounded-md font-medium transition-colors",
                isActive('/') 
                  ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500" 
                  : "bg-gray-700 text-white hover:bg-gray-600"
              )}
              onClick={() => navigate('/')}
            >
              Home
            </Button>
            
            <Button 
              variant="ghost" 
              className={cn(
                "px-6 py-2 rounded-md font-medium transition-colors",
                isActive('/features') 
                  ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500" 
                  : "bg-gray-700 text-white hover:bg-gray-600"
              )}
              onClick={() => navigate('/features')}
            >
              AIMS
            </Button>
            
            <Button 
              variant="ghost" 
              className={cn(
                "px-6 py-2 rounded-md font-medium transition-colors",
                isActive('/user-guide') 
                  ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500" 
                  : "bg-gray-700 text-white hover:bg-gray-600"
              )}
              onClick={() => navigate('/user-guide')}
            >
              Guides
            </Button>
            
            <Button 
              variant="ghost" 
              className={cn(
                "px-6 py-2 rounded-md font-medium transition-colors",
                isActive('/payment') 
                  ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500" 
                  : "bg-gray-700 text-white hover:bg-gray-600"
              )}
              onClick={() => navigate('/payment')}
            >
              Membership
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};