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

    console.log(`Using Birdeye API key: ${birdeyeApiKey.substring(0, 8)}...`);

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

    // Test API connection first
    try {
      console.log('Testing Birdeye API connection...');
      const testResponse = await fetch('https://public-api.birdeye.so/defi/networks', {
        headers: {
          'accept': 'application/json',
          'X-API-KEY': birdeyeApiKey,
        },
      });
      console.log(`Test API status: ${testResponse.status}`);
      
      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        console.error(`Test API failed: ${testResponse.status} - ${errorText}`);
        throw new Error(`API key validation failed: ${testResponse.status}`);
      }
      
      const testData = await testResponse.json();
      console.log('Test API success:', testData.success);
    } catch (error) {
      console.error('Birdeye API test failed:', error);
      return new Response(JSON.stringify({ 
        error: `API key validation failed: ${error.message}`,
        success: false 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Split tokens and fetch data for each (limit to 5 to avoid rate limiting)
    const tokenAddresses = tokens.split(',').slice(0, 5);
    const tokenData = [];

    for (const tokenAddress of tokenAddresses) {
      try {
        console.log(`Fetching data for token: ${tokenAddress}`);
        
        // Use Birdeye's token overview API
        const response = await fetch(
          `https://public-api.birdeye.so/defi/token_overview?address=${tokenAddress.trim()}`,
          {
            headers: {
              'accept': 'application/json',
              'X-API-KEY': birdeyeApiKey,
            },
          }
        );

        console.log(`Token ${tokenAddress} API status: ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          console.log(`Token ${tokenAddress} response:`, data);
          
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
            console.log(`Successfully processed token: ${token.symbol}`);
          } else {
            console.warn(`No data returned for ${tokenAddress}`);
          }
        } else {
          const errorText = await response.text();
          console.error(`Failed to fetch data for ${tokenAddress}: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error(`Error fetching data for ${tokenAddress}:`, error);
      }
      
      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
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