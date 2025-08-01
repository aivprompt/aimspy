import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
          <CardDescription>
            Your payment was cancelled and no charges were made
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Don't worry! Your payment was cancelled and no charges were made to your account. 
              You can try again anytime.
            </p>
          </div>
          
          <div className="space-y-2">
            <Link to="/payment" className="w-full">
              <Button className="w-full" size="lg">
                <CreditCard className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </Link>
            
            <Link to="/" className="w-full">
              <Button variant="outline" className="w-full" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancelled;