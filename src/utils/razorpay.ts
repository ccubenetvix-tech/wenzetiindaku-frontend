// Razorpay configuration utility

// Get Razorpay key ID from environment variables
export const getRazorpayKey = (): string => {
  const key = import.meta.env.VITE_RAZORPAY_KEY;
  
  if (!key) {
    throw new Error(
      'VITE_RAZORPAY_KEY is not set in your .env file. ' +
      'Please add your Razorpay key ID from https://dashboard.razorpay.com/app/keys'
    );
  }
  
  return key;
};

// Check if Razorpay is configured
export const isRazorpayConfigured = (): boolean => {
  try {
    return !!import.meta.env.VITE_RAZORPAY_KEY;
  } catch {
    return false;
  }
};

// Load Razorpay checkout script dynamically
export const loadRazorpayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.body.appendChild(script);
  });
};

// Declare Razorpay types for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

