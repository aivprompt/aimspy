import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tokenAddress, holders } = await req.json();

    console.log(`Analyzing whale movements for token ${tokenAddress}`);

    // Analyze whale activity patterns
    const whaleThreshold = 0.05; // 5% of total supply
    const whales = holders?.filter((holder: any) => 
      holder.percentage > whaleThreshold * 100
    ) || [];

    // Generate mock whale alerts based on holder data
    const alerts = whales.map((whale: any, index: number) => ({
      id: `whale_${index}_${Date.now()}`,
      type: Math.random() > 0.7 ? 'LARGE_SELL' : Math.random() > 0.5 ? 'LARGE_BUY' : 'WHALE_ACCUMULATION',
      walletAddress: whale.address || `${tokenAddress.slice(0, 8)}...${index}`,
      amount: whale.balance || Math.floor(Math.random() * 1000000),
      percentage: whale.percentage || Math.random() * 10 + 5,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      impact: whale.percentage > 10 ? 'HIGH' : whale.percentage > 5 ? 'MEDIUM' : 'LOW',
      confidence: Math.random() * 0.3 + 0.7,
      transactionHash: `0x${Math.random().toString(16).slice(2, 18)}...`
    })).slice(0, 5);

    // Add some recent movement patterns
    const movements = [
      {
        id: `movement_${Date.now()}`,
        pattern: 'COORDINATED_SELLING',
        description: 'Multiple whale wallets selling within 1 hour',
        riskLevel: 'HIGH',
        affectedWallets: Math.floor(Math.random() * 3) + 2,
        totalVolume: Math.floor(Math.random() * 500000) + 100000,
        timeWindow: '1 hour',
        confidence: 0.85
      },
      {
        id: `movement_${Date.now() + 1}`,
        pattern: 'WHALE_ACCUMULATION',
        description: 'Large wallet steadily accumulating tokens',
        riskLevel: 'MEDIUM',
        affectedWallets: 1,
        totalVolume: Math.floor(Math.random() * 200000) + 50000,
        timeWindow: '24 hours',
        confidence: 0.92
      }
    ];

    return new Response(JSON.stringify({
      success: true,
      tokenAddress,
      whaleAlerts: alerts,
      movementPatterns: movements,
      summary: {
        totalWhales: whales.length,
        highRiskAlerts: alerts.filter(a => a.impact === 'HIGH').length,
        mediumRiskAlerts: alerts.filter(a => a.impact === 'MEDIUM').length,
        lastAlert: alerts[0]?.timestamp || null
      },
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in whale alerts:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});