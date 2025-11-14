import { useTranslation } from "react-i18next";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  Shield,
  CreditCard,
  Truck,
  Loader2
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { items: cartItems, updateQuantity, removeFromCart, isLoading } = useCart();
  const navigate = useNavigate();

  // Group items by vendor
  const itemsByVendor = cartItems.reduce((acc, item) => {
    if (!acc[item.vendor]) {
      acc[item.vendor] = [];
    }
    acc[item.vendor].push(item);
    return acc;
  }, {} as Record<string, typeof cartItems>);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = cartItems.length > 0 ? 5.99 : 0;
  const tax = cartItems.length > 0 ? subtotal * 0.1 : 0;
  const total = subtotal + shipping + tax;

  // Handle quantity update
  const handleUpdateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) return;
    try {
      await updateQuantity(cartItemId, quantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  // Handle remove from cart
  const handleRemoveFromCart = async (cartItemId: string) => {
    try {
      await removeFromCart(cartItemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="flex items-center gap-3 mb-8">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{t('cart')}</h1>
            <Badge variant="secondary" className="ml-2">
              {cartItems.length} items
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
            {/* Cart and Wishlist Column */}
            <div className="space-y-8">
              {/* Cart Items */}
              <div className="bg-card rounded-lg shadow-sm">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading cart...</p>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="text-center py-12 px-6">
                    <ShoppingCart className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-6">Start shopping to add items to your cart</p>
                    <Button size="lg">
                      Continue Shopping
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  Object.entries(itemsByVendor).map(([vendor, items], vendorIndex) => (
                    <div key={vendor}>
                      {vendorIndex > 0 && <Separator />}
                      
                      {/* Vendor Header */}
                      <div className="p-6 pb-4">
                        <h3 className="font-semibold text-lg text-primary">{vendor}</h3>
                      </div>

                      {/* Vendor Items */}
                      <div className="px-6">
                        {items.map((item, itemIndex) => (
                          <div key={item.id}>
                            {itemIndex > 0 && <Separator className="my-4" />}
                            
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-32 w-full rounded-lg object-cover sm:h-20 sm:w-20"
                              />
                              
                              <div className="flex-1 w-full">
                                <h4 className="mb-1 text-lg font-medium">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">{item.vendor}</p>
                                <p className="mt-1 text-lg font-semibold text-primary">
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2 sm:self-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              {/* Remove Button */}
                              <div className="flex w-full justify-end sm:w-auto sm:justify-start">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleRemoveFromCart(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-6 pt-4">
                        <div className="text-right">
                          <span className="text-sm text-muted-foreground">Subtotal for {vendor}: </span>
                          <span className="font-semibold">
                            ${items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-card rounded-lg shadow-sm p-6 sticky top-8">
                <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
                
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Calculating...</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>${shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full mb-4"
                      disabled={cartItems.length === 0}
                      onClick={() => navigate("/checkout")}
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full mb-6"
                      onClick={() => navigate("/")}
                    >
                      Continue Shopping
                    </Button>
                  </>
                )}

                {/* Security Badges */}
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-success" />
                    <span>Secured by SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-success" />
                    <span>Multiple payment options</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-success" />
                    <span>Fast & reliable delivery</span>
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

export default Cart;