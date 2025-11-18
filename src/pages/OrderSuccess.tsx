import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Home,
  PackageCheck,
  Truck,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SuccessLocationState {
  orders?: Array<{
    id: string;
    vendor_id?: string;
    total_amount?: number;
    status?: string;
    payment_method?: string;
    payment_status?: string;
    vendor?: {
      id?: string;
      business_name?: string | null;
      business_email?: string | null;
    } | null;
  }>;
  payment?: {
    method?: string;
    status?: string;
  };
  shippingAddress?: Record<string, unknown>;
}

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as SuccessLocationState) || {};
  const orders = state.orders ?? [];
  const payment = state.payment ?? { method: "cod", status: "pending" };
  const shippingAddress = state.shippingAddress ?? {};

  const formattedAddress = useMemo(() => {
    if (!shippingAddress || typeof shippingAddress !== "object") return null;

    const fullName = typeof shippingAddress.fullName === "string" ? shippingAddress.fullName : null;
    const street1 = typeof shippingAddress.street1 === "string" ? shippingAddress.street1 : null;
    const street2 = typeof shippingAddress.street2 === "string" ? shippingAddress.street2 : null;
    const city = typeof shippingAddress.city === "string" ? shippingAddress.city : null;
    const stateName = typeof shippingAddress.state === "string" ? shippingAddress.state : null;
    const postalCode =
      typeof shippingAddress.postalCode === "string" ? shippingAddress.postalCode : null;
    const country = typeof shippingAddress.country === "string" ? shippingAddress.country : null;
    const phone = typeof shippingAddress.phone === "string" ? shippingAddress.phone : null;

    const lines = [
      fullName,
      street1,
      street2,
      [city, stateName, postalCode].filter(Boolean).join(", "),
      country,
      phone ? `Phone: ${phone}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    return lines || null;
  }, [shippingAddress]);

  const paymentLabel =
    payment.method === "cod" ? "Pay on Delivery" : "Online Payment (Card / UPI via Stripe)";

  const timeline = useMemo(() => {
    if (payment.method === "cod") {
      return [
        {
          label: "Order placed",
          description: "We received your order details.",
          completed: true,
        },
        {
          label: "Awaiting confirmation",
          description: "Vendor is preparing your order.",
          completed: false,
        },
        {
          label: "Out for delivery",
          description: "Courier will contact you before arriving.",
          completed: false,
        },
        {
          label: "Delivered",
          description: "Payment will be collected upon delivery.",
          completed: false,
        },
      ];
    }

    return [
      {
        label: "Awaiting payment",
        description: "Complete the secure Stripe payment to confirm.",
        completed: false,
      },
      {
        label: "Payment received",
        description: "We will notify the vendor after payment confirmation.",
        completed: false,
      },
      {
        label: "Processing order",
        description: "Vendor prepares your order for shipment.",
        completed: false,
      },
      {
        label: "Ready for delivery",
        description: "Delivery will be scheduled once processed.",
        completed: false,
      },
    ];
  }, [payment.method]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          <div className="flex flex-col items-center text-center gap-4 mb-10">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <BadgeCheck className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold">
              Order confirmed! Thank you for shopping with us.
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              We’ve received your order and sent the details to your email. Sit tight while the vendor
              prepares everything. You can track the status anytime from your dashboard.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <section className="bg-card border border-border/60 rounded-xl shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Order overview</h2>
                <p className="text-sm text-muted-foreground">
                  Your order is split by vendor so each seller can deliver efficiently.
                </p>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-lg border border-border/60 bg-background/60 p-4 text-left"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Order ID</p>
                          <p className="font-semibold tracking-tight">{order.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1">
                            {order.status ? order.status.toUpperCase() : "PENDING"}
                          </span>
                          <span className="text-sm font-medium">
                            ${(order.total_amount ?? 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <p className="text-sm text-muted-foreground">
                        Vendor:{" "}
                        <span className="font-medium text-foreground">
                          {order.vendor?.business_name ?? order.vendor_id ?? "Assigned after confirmation"}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
                  We couldn’t retrieve order details from this session. View your orders from the dashboard
                  to see the latest updates.
                </div>
              )}

              <div className="space-y-2 text-left">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Payment method
                </h3>
                <p className="text-sm text-foreground">{paymentLabel}</p>
              </div>

              {formattedAddress && (
                <div className="space-y-2 text-left">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Shipping address
                  </h3>
                  <pre className="rounded-md border border-border/60 bg-muted/40 p-4 text-sm leading-relaxed whitespace-pre-wrap">
                    {formattedAddress}
                  </pre>
                </div>
              )}
            </section>

            <aside className="bg-card border border-border/60 rounded-xl shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-semibold">What happens next?</p>
                  <p className="text-xs text-muted-foreground">
                    Follow the progress of your order through each milestone.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                {timeline.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 text-left">
                    <div className="mt-0.5">
                      {step.completed ? (
                        <PackageCheck className="h-4 w-4 text-primary" />
                      ) : (
                        <Truck className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{step.label}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => navigate("/customer/dashboard", { state: { tab: "orders" } })}
                >
                  Track my orders
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
                  <Home className="mr-2 h-4 w-4" />
                  Continue shopping
                </Button>
              </div>
            </aside>
          </div>

          <div className="mt-10 border border-border/60 rounded-lg bg-muted/30 p-6 text-left">
            <h3 className="text-sm font-semibold mb-2">Need help?</h3>
            <p className="text-sm text-muted-foreground">
              If you have any questions about your order, reach out to our support team or contact the
              vendor directly through your dashboard.
            </p>
            <Button
              variant="ghost"
              className="mt-3"
              onClick={() => navigate("/contact", { state: { subject: "Order support" } })}
            >
              Contact support
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;

