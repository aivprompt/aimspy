import React from 'react';
import { Header } from '@/components/Header';
import { PaymentPlans } from '@/components/PaymentPlans';

const Payment = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PaymentPlans />
    </div>
  );
};

export default Payment;