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
      name: "Trial Director",
      price: "$9.95",
      period: "/10 days",
      description: "Perfect for testing the waters",
      features: [
        "Basic Script Analysis",
        "Character Development Tools",
        "Scene Planning Assistant",
        "10 Projects/Trial",
        "Email Support",
        "Basic Templates"
      ],
      badge: null,
      buttonText: "Get Started"
    },
    {
      name: "Director",
      price: "$19.95",
      period: "/month",
      description: "For professional directors and production companies",
      features: [
        "Advanced Script Analysis",
        "Full Character Development Suite",
        "Advanced Scene Planning",
        "Unlimited Projects",
        "Priority Support",
        "Premium Templates",
        "Budget Estimation Tools",
        "Crew Management"
      ],
      badge: "Most Popular",
      buttonText: "Get Started"
    },
    {
      name: "Executive Director",
      price: "$149.95",
      period: "/year",
      description: "Complete studio-grade solution for large productions",
      features: [
        "All Director Features",
        "Custom AI Model Training",
        "White-label Solutions",
        "Dedicated Account Manager",
        "Advanced Analytics",
        "API Access",
        "Custom Integrations",
        "24/7 Phone Support"
      ],
      badge: "Best Value",
      buttonText: "Get Started"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Membership
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your production needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={plan.name} className={`relative border-border bg-card ${index === 1 ? 'scale-105 border-primary/50' : ''}`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-4 text-foreground">{plan.name}</CardTitle>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="text-4xl font-bold text-primary">
                  {plan.price}
                  <span className="text-lg text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${index === 1 ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
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