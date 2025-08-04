import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tokenSymbol, tokenName, recentPosts } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`Analyzing sentiment for ${tokenSymbol} with ${recentPosts?.length || 0} posts`);

    const prompt = `Analyze the sentiment around the meme coin "${tokenName}" (${tokenSymbol}) based on these recent social media posts and market context:

Posts: ${recentPosts?.join('\n') || 'No recent posts available'}

Provide a JSON response with:
{
  "overallSentiment": "bullish|bearish|neutral",
  "sentimentScore": <number between -1 and 1>,
  "confidence": <number between 0 and 1>,
  "keyFactors": ["factor1", "factor2", "factor3"],
  "riskIndicators": ["risk1", "risk2"],
  "socialMomentum": "high|medium|low",
  "rugPullRisk": <number between 0 and 1>,
  "marketManipulation": <number between 0 and 1>,
  "whaleActivity": "high|medium|low",
  "communityHealth": <number between 0 and 1>
}

Base your analysis on sentiment keywords, FOMO indicators, pump/dump language, community engagement quality, and potential red flags.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert cryptocurrency sentiment analyst. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch {
      // Fallback if JSON parsing fails
      analysis = {
        overallSentiment: 'neutral',
        sentimentScore: 0,
        confidence: 0.5,
        keyFactors: ['Limited social data available'],
        riskIndicators: ['Insufficient data for analysis'],
        socialMomentum: 'low',
        rugPullRisk: 0.5,
        marketManipulation: 0.3,
        whaleActivity: 'medium',
        communityHealth: 0.5
      };
    }

    console.log(`Analysis complete for ${tokenSymbol}:`, analysis);

    return new Response(JSON.stringify({
      success: true,
      tokenSymbol,
      analysis,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});