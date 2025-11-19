import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, ExternalLink } from 'lucide-react';

interface RazorpayPaymentButtonProps {
  amount: number;
  onRedirect?: () => void;
}

const RAZORPAY_PAYMENT_LINK = 'https://rzp.io/rzp/zlDr3g6R';

export const RazorpayPaymentButton = ({
  amount,
  onRedirect,
}: RazorpayPaymentButtonProps) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handlePayment = () => {
    setIsRedirecting(true);
    
    if (onRedirect) {
      onRedirect();
    }

    // Redirect to Razorpay payment link
    window.location.href = RAZORPAY_PAYMENT_LINK;
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isRedirecting}
      size="lg"
      className="w-full"
    >
      <CreditCard className="mr-2 h-4 w-4" />
      {isRedirecting ? 'Redirecting...' : `Pay $${amount.toFixed(2)}`}
      <ExternalLink className="ml-2 h-4 w-4" />
    </Button>
  );
};

