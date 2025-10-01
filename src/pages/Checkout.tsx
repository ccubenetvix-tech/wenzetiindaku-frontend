import { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Shield, 
  CheckCircle,
  MapPin,
  User,
  Mail,
  Phone
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const Checkout = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const steps = [
    { id: 1, name: "Shipping Address", icon: MapPin },
    { id: 2, name: "Payment Method", icon: CreditCard },
    { id: 3, name: "Review Order", icon: CheckCircle }
  ];

  const cartItems = [
    {
      id: "1",
      name: "Premium African Shea Butter Face Cream",
      price: 24.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center",
      vendor: "AfriBeauty Store"
    },
    {
      id: "2",
      name: "Samsung Galaxy Smartphone Case",
      price: 19.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center",
      vendor: "TechHub Africa"
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>

          {/* Steps Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step.id <= currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className={`ml-3 font-medium ${
                    step.id <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`h-px w-16 mx-6 ${
                      step.id < currentStep ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                {/* Step 1: Shipping Address */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      Shipping Address
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" placeholder="John" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" placeholder="Doe" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input id="email" type="email" placeholder="john@example.com" className="pl-10" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input id="phone" placeholder="+234 123 456 7890" className="pl-10" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="address">Street Address</Label>
                        <Input id="address" placeholder="123 Main Street" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input id="city" placeholder="Lagos" />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input id="state" placeholder="Lagos State" />
                        </div>
                        <div>
                          <Label htmlFor="zip">ZIP Code</Label>
                          <Input id="zip" placeholder="100001" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button onClick={() => setCurrentStep(2)}>
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Payment Method */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-primary" />
                      Payment Method
                    </h2>
                    
                    <div className="space-y-4">
                      {/* Payment Options */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div 
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border'
                          }`}
                          onClick={() => setPaymentMethod('card')}
                        >
                          <div className="flex items-center">
                            <CreditCard className="h-5 w-5 mr-3 text-primary" />
                            <div>
                              <h3 className="font-medium">Credit/Debit Card</h3>
                              <p className="text-sm text-muted-foreground">Visa, Mastercard, etc.</p>
                            </div>
                          </div>
                        </div>
                        
                        <div 
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            paymentMethod === 'mobile' ? 'border-primary bg-primary/5' : 'border-border'
                          }`}
                          onClick={() => setPaymentMethod('mobile')}
                        >
                          <div className="flex items-center">
                            <Smartphone className="h-5 w-5 mr-3 text-primary" />
                            <div>
                              <h3 className="font-medium">Mobile Money</h3>
                              <p className="text-sm text-muted-foreground">MTN, Airtel, etc.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Form */}
                      {paymentMethod === 'card' && (
                        <div className="space-y-4 mt-6">
                          <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input id="expiry" placeholder="MM/YY" />
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV</Label>
                              <Input id="cvv" placeholder="123" />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="cardName">Name on Card</Label>
                            <Input id="cardName" placeholder="John Doe" />
                          </div>
                        </div>
                      )}

                      {/* Mobile Money Form */}
                      {paymentMethod === 'mobile' && (
                        <div className="space-y-4 mt-6">
                          <div>
                            <Label htmlFor="mobileProvider">Mobile Provider</Label>
                            <select 
                              id="mobileProvider"
                              className="w-full border border-input bg-background px-3 py-2 rounded-md"
                              aria-label="Select mobile money provider"
                            >
                              <option>MTN Mobile Money</option>
                              <option>Airtel Money</option>
                              <option>Orange Money</option>
                            </select>
                          </div>
                          
                          <div>
                            <Label htmlFor="mobileNumber">Mobile Number</Label>
                            <Input id="mobileNumber" placeholder="+234 123 456 7890" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setCurrentStep(1)}>
                        Back
                      </Button>
                      <Button onClick={() => setCurrentStep(3)}>
                        Review Order
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Review Order */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                      Review Order
                    </h2>
                    
                    <div className="space-y-6">
                      {/* Order Items */}
                      <div>
                        <h3 className="font-medium mb-4">Order Items</h3>
                        <div className="space-y-4">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">{item.vendor}</p>
                                <p className="text-sm">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Order Summary */}
                      <div>
                        <h3 className="font-medium mb-4">Order Summary</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>${shipping.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax</span>
                            <span>${tax.toFixed(2)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span className="text-primary">${total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setCurrentStep(2)}>
                        Back
                      </Button>
                      <Button size="lg" className="bg-secondary hover:bg-secondary-hover">
                        <Shield className="h-4 w-4 mr-2" />
                        Place Order
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg p-6 shadow-sm sticky top-8">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator className="mb-4" />

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3 text-success" />
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    <span>Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;