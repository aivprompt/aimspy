
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
    name: '10-Day Trial',
    price: '$9.95',
    priceId: 'price_test_trial_10_day', // Replace with your test price ID
    description: 'Perfect for indie filmmakers and content creators getting started',
    features: [
      'Access to all spy features',
      '10 days full access',
      'Basic support',
      'No recurring charges'
    ],
    badge: null,
    planType: 'trial'
  },
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: '$19.95',
    priceId: 'price_test_monthly_plan', // Replace with your test price ID
    description: 'For professional directors and production companies',
    features: [
      'Unlimited spy scans',
      'Premium features',
      'Priority support',
      'Monthly billing'
    ],
    badge: 'Most Popular',
    planType: 'monthly'
  },
  {
    id: 'annual',
    name: 'Annual Plan',
    price: '$149.95',
    priceId: 'price_test_annual_plan', // Replace with your test price ID
    description: 'Complete studio-grade solution for large productions',
    features: [
      'Everything in Monthly',
      'Save $89.45 per year',
      'Premium support',
      'Yearly billing'
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
          <p className="text-gray-400 text-lg">Choose the perfect plan for your production needs</p>
          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <p className="text-sm text-yellow-300">
              <strong>Note:</strong> These are placeholder test price IDs. Please create test prices in your Stripe dashboard and replace the priceId values above.
            </p>
          </div>
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
