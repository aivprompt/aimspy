
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const plans = [
  {
    id: 'trial',
    name: 'Spy Cadet',
    price: '$9.95',
    priceId: 'price_1RrABiDnkc0bvj3EYuIiq1E0',
    description: 'Perfect for new meme coin investors getting started',
    features: [
      'Basic Meme Scan Analysis',
      'Token Safety Checks',
      'Social Media Sentiment',
      '5 Scans Per Day',
      'Basic Risk Assessment',
      'Email Support',
      'Mobile App Access',
      '10 Day Access'
    ],
    badge: null,
    planType: 'trial'
  },
  {
    id: 'monthly',
    name: 'Spy Agent',
    price: '$29.95',
    priceId: 'price_1RrACmDnkc0bvj3E9RDIWicO',
    description: 'For serious traders and meme coin enthusiasts',
    features: [
      'Advanced AI Analysis',
      'Real-time Market Alerts',
      'Unlimited Scans',
      'Whale Tracking',
      'Rug Pull Protection',
      'Premium Risk Metrics',
      'Portfolio Tracking',
      'Discord Integration',
      'Priority Support',
      'Advanced Charting Tools',
      'Custom Notifications',
      'Historical Data Access'
    ],
    badge: 'Most Popular',
    planType: 'monthly'
  },
  {
    id: 'annual',
    name: 'Spy Master',
    price: '$249.95',
    priceId: 'price_1RrADgDnkc0bvj3EH15cV8pU',
    description: 'Complete intelligence solution for professional traders',
    features: [
      'All Spy Agent Features',
      'Custom AI Model Training',
      'White-label Solutions',
      'Dedicated Account Manager',
      'Advanced Analytics Dashboard',
      'API Access',
      'Custom Integrations',
      'Bulk Analysis Tools',
      '24/7 Phone Support',
      'Private Discord Channel',
      'Early Feature Access',
      'Market Making Insights',
      'Institutional Reports',
      'Custom Risk Models'
    ],
    badge: 'Best Value',
    planType: 'annual'
  }
];

export const PaymentPlans = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubscribe = async (plan: typeof plans[0]) => {
    try {
      setLoading(plan.id);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: plan.priceId,
          planType: plan.planType
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-6">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-yellow-400 mb-4">Membership</h1>
          <p className="text-gray-400 text-lg">Choose the perfect plan for your meme coin intelligence needs</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={plan.id} 
              className={`relative bg-gray-800 border-gray-700 text-white ${
                plan.badge === 'Most Popular' 
                  ? 'border-yellow-400 border-2 scale-105 shadow-2xl shadow-yellow-400/20' 
                  : 'border-gray-600'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-yellow-400 text-gray-900 font-semibold px-4 py-2">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-white mb-4">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className={`text-4xl font-bold ${plan.badge === 'Most Popular' ? 'text-yellow-400' : 'text-white'}`}>
                    {plan.price}
                  </span>
                  <span className="text-gray-400">/month</span>
                </div>
                <CardDescription className="text-gray-300 text-sm">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className={`h-5 w-5 flex-shrink-0 ${plan.badge === 'Most Popular' ? 'text-yellow-400' : 'text-green-400'}`} />
                      <span className="text-gray-200 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full font-semibold py-6 text-base ${
                    plan.badge === 'Most Popular'
                      ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                      : 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
                  }`}
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.id}
                  size="lg"
                >
                  {loading === plan.id ? "Processing..." : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
