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
    priceId: 'price_1Rr1mNDnkc0bvj3EtdR386XE',
    description: 'Perfect for testing our AI meme spy features',
    features: [
      'Access to all spy features',
      '10 days full access',
      'Basic support',
      'No recurring charges'
    ],
    badge: 'Most Popular',
    planType: 'trial'
  },
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: '$29.95',
    priceId: 'price_1Rr1VFDnkc0bvj3EPuLbPFaM',
    description: 'Full access with monthly billing',
    features: [
      'Unlimited spy scans',
      'Premium features',
      'Priority support',
      'Monthly billing'
    ],
    badge: null,
    planType: 'monthly'
  },
  {
    id: 'annual',
    name: 'Annual Plan',
    price: '$299.95',
    priceId: 'price_1Rr1ZgDnkc0bvj3EoOvbpOqT',
    description: 'Best value with yearly billing',
    features: [
      'Everything in Monthly',
      'Save $59.45 per year',
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
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-muted-foreground">Start with our trial or go full premium</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.badge ? 'border-primary' : ''}`}>
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge variant="default" className="bg-primary text-primary-foreground">
                  {plan.badge}
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold text-primary">{plan.price}</div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full" 
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.id}
                size="lg"
              >
                {loading === plan.id ? "Processing..." : `Get ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};