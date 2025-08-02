import { useState, useEffect, useRef } from 'react';
import { MemeCoin } from '@/types/meme-coin';

interface LiveFeedData {
  type: string;
  data?: any;
  timestamp?: number;
  status?: string;
  message?: string;
}

export const useLiveMemeCoinFeed = () => {
  const [coins, setCoins] = useState<MemeCoin[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = () => {
    try {
      const wsUrl = `wss://qkappowfrpsrvmxrndrx.functions.supabase.co/functions/v1/birdeye-websocket`;
      console.log('Connecting to live feed:', wsUrl);
      
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {
        console.log('Connected to live meme coin feed');
        setIsConnected(true);
        setConnectionStatus('connected');
      };

      socketRef.current.onmessage = (event) => {
        try {
          const data: LiveFeedData = JSON.parse(event.data);
          console.log('Live feed data:', data);

          if (data.type === 'connection' && data.status === 'connected') {
            setConnectionStatus('live');
          } else if (data.type === 'price_update' && data.data) {
            // Update the coin data with live prices
            updateCoinPrice(data.data);
          }
        } catch (error) {
          console.error('Error parsing live feed data:', error);
        }
      };

      socketRef.current.onclose = () => {
        console.log('Live feed disconnected');
        setIsConnected(false);
        setConnectionStatus('disconnected');
        
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
      };

      socketRef.current.onerror = (error) => {
        console.error('Live feed error:', error);
        setConnectionStatus('error');
      };

    } catch (error) {
      console.error('Failed to connect to live feed:', error);
      setConnectionStatus('error');
    }
  };

  const updateCoinPrice = (priceData: any) => {
    // Transform Birdeye price data to our MemeCoin format
    setCoins(prevCoins => {
      return prevCoins.map(coin => {
        // Check if this price update is for one of our coins
        if (coin.address === priceData.address || 
            coin.symbol?.toLowerCase() === priceData.symbol?.toLowerCase()) {
          
          const newPrice = priceData.price || priceData.value || coin.price;
          const priceChange24h = priceData.priceChange24h || 
                                ((newPrice - coin.price) / coin.price) * 100;

          return {
            ...coin,
            price: newPrice,
            priceChange24h,
            volume24h: priceData.volume24h || coin.volume24h,
            marketCap: priceData.marketCap || coin.marketCap,
            lastUpdated: new Date().toISOString()
          };
        }
        return coin;
      });
    });
  };

  const subscribeToToken = (tokenAddress: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const message = {
        type: 'subscribe',
        tokenAddress
      };
      socketRef.current.send(JSON.stringify(message));
      console.log(`Subscribed to token: ${tokenAddress}`);
    }
  };

  // Initialize with fallback data and then connect to live feed
  useEffect(() => {
    // Load initial data from the existing API
    const loadInitialData = async () => {
      try {
        const response = await fetch('https://qkappowfrpsrvmxrndrx.functions.supabase.co/functions/v1/fetch-meme-coins');
        const data = await response.json();
        
        if (data.coins && Array.isArray(data.coins)) {
          setCoins(data.coins);
          console.log('Loaded initial coin data:', data.coins.length, 'coins');
          
          // Subscribe to each coin for live updates
          data.coins.forEach((coin: MemeCoin) => {
            if (coin.address) {
              subscribeToToken(coin.address);
            }
          });
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return {
    coins,
    isConnected,
    connectionStatus,
    subscribeToToken
  };
};