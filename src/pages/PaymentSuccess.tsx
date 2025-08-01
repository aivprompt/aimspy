import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { toast } = useToast();

  useEffect(() => {
    if (sessionId) {
      toast({
        title: "Payment Successful! 🎉",
        description: "Welcome to AI Meme Spy! Your payment has been processed successfully.",
      });
    }
  }, [sessionId, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for subscribing to AI Meme Spy
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Your payment has been processed successfully. You now have full access to all AI Meme Spy features.
            </p>
            {sessionId && (
              <p className="text-xs text-muted-foreground">
                Session ID: {sessionId}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Link to="/" className="w-full">
              <Button className="w-full" size="lg">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;