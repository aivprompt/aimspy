import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Check, Zap, Shield, Target } from 'lucide-react';

const Payment = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (plan: string) => {
    setIsProcessing(true);
    // Payment integration will be added after getting Stripe details
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  const plans = [
    {
      name: "Spy Recruit",
      price: "$9.99",
      period: "/month",
      description: "Basic intelligence access",
      features: [
        "50 Quick Scans per month",
        "10 Deep Scans per month",
        "Basic alerts",
        "Email support"
      ],
      badge: null,
      buttonText: "Start Mission"
    },
    {
      name: "Spy Agent",
      price: "$19.99",
      period: "/month",
      description: "Advanced reconnaissance",
      features: [
        "Unlimited Quick Scans",
        "100 Deep Scans per month",
        "Real-time alerts",
        "Priority support",
        "Advanced analytics",
        "Custom watchlists"
      ],
      badge: "Most Popular",
      buttonText: "Deploy Agent"
    },
    {
      name: "Spy Master",
      price: "$49.99",
      period: "/month",
      description: "Complete intelligence suite",
      features: [
        "Unlimited everything",
        "AI-powered predictions",
        "Exclusive alpha channels",
        "24/7 VIP support",
        "Custom integrations",
        "White-label access"
      ],
      badge: "Enterprise",
      buttonText: "Command HQ"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold spy-gradient bg-clip-text text-transparent mb-4">
            Choose Your Mission Level
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upgrade your intelligence capabilities and unlock advanced meme coin analysis tools
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={plan.name} className={`spy-border relative ${index === 1 ? 'scale-105 glow-green' : ''}`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="spy-gradient text-white px-4 py-1">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <div className="mb-4">
                  {index === 0 && <Target className="h-12 w-12 mx-auto text-primary" />}
                  {index === 1 && <Zap className="h-12 w-12 mx-auto text-primary" />}
                  {index === 2 && <Shield className="h-12 w-12 mx-auto text-primary" />}
                </div>
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="text-4xl font-bold spy-gradient bg-clip-text text-transparent">
                  {plan.price}
                  <span className="text-lg text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full"
                  variant={index === 1 ? "default" : "outline"}
                  onClick={() => handlePayment(plan.name)}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="spy-border bg-destructive/10 p-6 rounded-lg max-w-2xl mx-auto">
            <h3 className="font-semibold text-destructive mb-2">Risk Disclaimer</h3>
            <p className="text-sm text-destructive">
              This service is for educational purposes only. Cryptocurrency investments carry high risk. 
              Never invest more than you can afford to lose. Always do your own research.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;