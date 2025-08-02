import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const birdeyeApiKey = Deno.env.get('BIRDEYE_API_KEY');
    if (!birdeyeApiKey) {
      console.error('BIRDEYE_API_KEY not found');
      return new Response(JSON.stringify({ 
        error: 'API key not configured',
        success: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const tokens = url.searchParams.get('tokens');
    
    if (!tokens) {
      return new Response(JSON.stringify({ 
        error: 'No tokens specified',
        success: false 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Fetching Birdeye data for tokens: ${tokens}`);

    // Split tokens and fetch data for each
    const tokenAddresses = tokens.split(',').slice(0, 10); // Limit to 10 tokens
    const tokenData = [];

    for (const tokenAddress of tokenAddresses) {
      try {
        console.log(`Fetching data for token: ${tokenAddress}`);
        
        // Birdeye token overview API
        const response = await fetch(
          `https://public-api.birdeye.so/defi/token_overview?address=${tokenAddress.trim()}`,
          {
            headers: {
              'X-API-KEY': birdeyeApiKey,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(`Token ${tokenAddress} data:`, data);
          
          if (data.success && data.data) {
            const token = data.data;
            tokenData.push({
              address: tokenAddress,
              symbol: token.symbol || 'UNKNOWN',
              name: token.name || token.symbol || 'Unknown Token',
              decimals: token.decimals || 9,
              price: token.price || 0,
              priceChange24h: token.priceChange24hPercent || 0,
              volume24h: token.v24hUSD || 0,
              marketCap: token.mc || 0,
              liquidity: token.liquidity || 0,
            });
          }
        } else {
          console.warn(`Failed to fetch data for ${tokenAddress}: ${response.status}`);
        }
      } catch (error) {
        console.error(`Error fetching data for ${tokenAddress}:`, error);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`Successfully fetched data for ${tokenData.length} tokens`);

    return new Response(JSON.stringify({
      success: true,
      tokens: tokenData,
      timestamp: new Date().toISOString(),
      source: 'birdeye'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in birdeye-api function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});