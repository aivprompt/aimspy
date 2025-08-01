import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export const ApiKeyForm = () => {
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [priceId10Day, setPriceId10Day] = useState('');
  const [priceIdMonthly, setPriceIdMonthly] = useState('');
  const [priceIdAnnual, setPriceIdAnnual] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store in localStorage for now (in production, use Supabase secrets)
    localStorage.setItem('stripe_secret_key', stripeSecretKey);
    localStorage.setItem('stripe_price_10_day', priceId10Day);
    localStorage.setItem('stripe_price_monthly', priceIdMonthly);
    localStorage.setItem('stripe_price_annual', priceIdAnnual);
    
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved locally.",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>API Configuration</CardTitle>
        <CardDescription>
          Enter your Stripe API keys and price IDs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stripe-secret">Stripe Secret Key</Label>
            <Input
              id="stripe-secret"
              type="password"
              placeholder="sk_test_..."
              value={stripeSecretKey}
              onChange={(e) => setStripeSecretKey(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price-10-day">10-Day Trial Price ID</Label>
            <Input
              id="price-10-day"
              placeholder="price_..."
              value={priceId10Day}
              onChange={(e) => setPriceId10Day(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price-monthly">Monthly Price ID</Label>
            <Input
              id="price-monthly"
              placeholder="price_..."
              value={priceIdMonthly}
              onChange={(e) => setPriceIdMonthly(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price-annual">Annual Price ID</Label>
            <Input
              id="price-annual"
              placeholder="price_..."
              value={priceIdAnnual}
              onChange={(e) => setPriceIdAnnual(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Save API Keys
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};