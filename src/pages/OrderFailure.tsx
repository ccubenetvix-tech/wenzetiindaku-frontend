import { useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface FailureLocationState {
  reason?: string;
  paymentMethod?: string;
}

const OrderFailure = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as FailureLocationState) || {};

  const message =
    state.reason ||
    "We couldn’t place your order due to an unexpected issue. Please try again or choose a different payment method.";
  const paymentMethodLabel =
    state.paymentMethod === "online"
      ? "Online payment (Stripe)"
      : state.paymentMethod === "cod"
      ? "Pay on Delivery"
      : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 max-w-3xl">
          <div className="flex flex-col items-center text-center gap-4 mb-10">
            <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold">Order not placed</h1>
            <p className="text-muted-foreground max-w-2xl">{message}</p>
          </div>

          <div className="bg-card border border-border/60 rounded-xl shadow-sm p-6 space-y-6">
            <div className="text-left space-y-2">
              <h2 className="text-lg font-semibold">What you can do</h2>
              <p className="text-sm text-muted-foreground">
                Ensure your payment details are correct, check your internet connection, or try Pay on
                Delivery if available.
              </p>
            </div>

            {paymentMethodLabel && (
              <>
                <Separator />
                <div className="rounded-lg border border-dashed border-border/60 p-4 text-left">
                  <h3 className="text-sm font-semibold leading-tight text-muted-foreground">
                    Attempted payment method
                  </h3>
                  <p className="mt-2 text-sm text-foreground">{paymentMethodLabel}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    If funds were debited, the transaction will be reversed automatically within a few minutes. You
                    may also confirm with your bank.
                  </p>
                </div>
              </>
            )}

            <Separator />

            <div className="grid gap-3 md:grid-cols-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/checkout", { replace: true })}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to checkout
              </Button>
              <Button
                className="w-full"
                onClick={() => navigate("/customer/dashboard", { state: { tab: "orders" } })}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Review existing orders
              </Button>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/40 p-4 text-left text-sm text-muted-foreground">
              Looking for more help?{" "}
              <Button
                variant="link"
                className="h-auto p-0 text-primary"
                onClick={() => navigate("/contact", { state: { subject: "Checkout issue" } })}
              >
                Contact support <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderFailure;

