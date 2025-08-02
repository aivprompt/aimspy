import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  const birdeyeApiKey = Deno.env.get('BIRDEYE_API_KEY');
  if (!birdeyeApiKey) {
    console.error('BIRDEYE_API_KEY not found');
    socket.close(1000, 'API key not configured');
    return response;
  }

  console.log('Frontend client connected to Birdeye WebSocket relay');

  // Popular Solana meme coin addresses to track
  const memeTokens = [
    'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', // WIF
    'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK
    '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', // POPCAT
    'A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump', // PNUT
    'ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82', // BOME
  ];

  let birdeyeSocket: WebSocket;

  const connectToBirdeye = () => {
    try {
      // Birdeye WebSocket endpoint
      birdeyeSocket = new WebSocket('wss://public-api.birdeye.so/socket', {
        headers: {
          'X-API-KEY': birdeyeApiKey
        }
      });

      birdeyeSocket.onopen = () => {
        console.log('Connected to Birdeye WebSocket');
        
        // Subscribe to price updates for meme tokens
        memeTokens.forEach(tokenAddress => {
          const subscribeMessage = {
            type: 'SUBSCRIBE_PRICE',
            data: {
              address: tokenAddress,
              chain: 'solana'
            }
          };
          
          console.log(`Subscribing to ${tokenAddress}`);
          birdeyeSocket.send(JSON.stringify(subscribeMessage));
        });

        // Send initial connection success message to frontend
        socket.send(JSON.stringify({
          type: 'connection',
          status: 'connected',
          message: 'Connected to live Birdeye feed'
        }));
      };

      birdeyeSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received from Birdeye:', data);

          // Forward the price update to the frontend
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
              type: 'price_update',
              data: data,
              timestamp: Date.now()
            }));
          }
        } catch (error) {
          console.error('Error parsing Birdeye message:', error);
        }
      };

      birdeyeSocket.onerror = (error) => {
        console.error('Birdeye WebSocket error:', error);
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Birdeye connection error'
        }));
      };

      birdeyeSocket.onclose = () => {
        console.log('Birdeye WebSocket closed, attempting to reconnect...');
        setTimeout(connectToBirdeye, 5000); // Reconnect after 5 seconds
      };

    } catch (error) {
      console.error('Failed to connect to Birdeye:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Failed to connect to Birdeye API'
      }));
    }
  };

  // Handle messages from frontend
  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log('Received from frontend:', message);

      if (message.type === 'subscribe' && message.tokenAddress) {
        // Subscribe to a new token
        const subscribeMessage = {
          type: 'SUBSCRIBE_PRICE',
          data: {
            address: message.tokenAddress,
            chain: 'solana'
          }
        };
        
        if (birdeyeSocket && birdeyeSocket.readyState === WebSocket.OPEN) {
          birdeyeSocket.send(JSON.stringify(subscribeMessage));
          console.log(`Subscribed to new token: ${message.tokenAddress}`);
        }
      }
    } catch (error) {
      console.error('Error handling frontend message:', error);
    }
  };

  socket.onclose = () => {
    console.log('Frontend client disconnected');
    if (birdeyeSocket) {
      birdeyeSocket.close();
    }
  };

  socket.onerror = (error) => {
    console.error('Frontend socket error:', error);
  };

  // Start connection to Birdeye
  connectToBirdeye();

  return response;
});