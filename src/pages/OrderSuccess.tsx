import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/utils/api";
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
import { calculateVAT, calculateIncludedVAT, extractBasePrice } from "@/utils/priceUtils";
import i18n from "@/lib/i18n";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isVerifying, setIsVerifying] = useState(false);

  // Parse location state
  const [state, setState] = useState<SuccessLocationState>((location.state as SuccessLocationState) || {});

  useEffect(() => {
    const fn = async () => {
      const query = new URLSearchParams(location.search);
      const sessionId = query.get("session_id");
      const status = query.get("status");
      const transactionRefId = query.get("transactionRefId");

      // Check for explicit failure status from Maisha Pay
      if (status && ['failed', 'cancelled', 'refused', 'error'].includes(status.toLowerCase())) {
        toast({
          variant: "destructive",
          title: i18n.t('pages.orderSuccess.paymentFailed'),
          description: i18n.t('pages.orderSuccess.thePaymentWasRefusedOrCancelled')
        });
        navigate("/checkout/failure", { replace: true });
        return;
      }

      if (sessionId && !state.orders) {
        setIsVerifying(true);
        try {
          const response = await apiClient.verifyPayment(sessionId, { status, transactionRefId }) as any;
          if (response?.success && response?.data?.orders) {
            // Determine payment status/method from confirmed order
            const orders = response.data.orders;
            setState({
              orders: orders,
              payment: { method: "online", status: "paid" },
              shippingAddress: orders[0]?.shipping_address || {}
            });
            // Clean up URL
            navigate(location.pathname, {
              replace: true, state: {
                orders: orders,
                payment: { method: "online", status: "paid" },
                shippingAddress: orders[0]?.shipping_address || {}
              }
            });
          } else {
            throw new Error(i18n.t('pages.orderSuccess.paymentVerificationFailed'));
          }
        } catch (error) {
          console.error(error);
          toast({ variant: "destructive", title: i18n.t('pages.orderSuccess.verificationFailed'), description: i18n.t('pages.orderSuccess.couldNotVerifyPaymentPleaseContact') });
          navigate("/checkout/failure", { replace: true });
        } finally {
          setIsVerifying(false);
        }
      }
    };
    fn();
  }, [location.search, navigate, state.orders, toast]);

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
    payment.method === "cod" ? t("payOnDelivery") : t("onlinePaymentMaishaPay");

  const timeline = useMemo(() => {
    const steps = payment.method === "cod"
      ? [
        { key: "orderPlacedTimeline", completed: true },
        { key: "awaitingConfirmation", completed: false },
        { key: "outForDelivery", completed: false },
        { key: "delivered", completed: false },
      ]
      : [
        { key: "awaitingPayment", completed: true }, // if we are here, payment is done or being verified
        { key: "paymentReceived", completed: true },
        { key: "processingOrder", completed: false },
        { key: "readyForDelivery", completed: false },
      ];
    return steps.map(({ key, completed }) => ({
      label: t(key),
      description: t(`${key}Desc`),
      completed,
    }));
  }, [payment.method, t]);

  // Show loading during verification - MOVED AFTER HOOKS to prevent React Error #300
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          <p className="text-muted-foreground">{t('pages.orderSuccess.verifyingSecurePayment')}</p>
        </div>
      </div>
    );
  }

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
              {t('pages.orderSuccess.orderConfirmedThankYouForShopping')}
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              {t('pages.orderSuccess.weVeReceivedYourOrderAnd')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <section className="bg-card border border-border/60 rounded-xl shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">{t('pages.orderSuccess.orderOverview')}</h2>
                <p className="text-sm text-muted-foreground">
                  {t('pages.orderSuccess.yourOrderIsSplitByVendor')}
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
                          <p className="text-sm text-muted-foreground">{t('pages.orderSuccess.orderId')}</p>
                          <p className="font-semibold tracking-tight">{order.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1">
                            {order.status ? order.status.toUpperCase() : t('pages.orderSuccess.pending')}
                          </span>
                          <span className="text-sm font-medium">
                            ${Number(order.total_amount).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <p className="text-sm text-muted-foreground mb-3">
                        {t('pages.orderSuccess.vendor')}{" "}
                        <span className="font-medium text-foreground">
                          {order.vendor?.business_name ?? order.vendor_id ?? t('pages.orderSuccess.assignedAfterConfirmation')}
                        </span>
                      </p>

                      {/* Price Breakdown */}
                      <div className="bg-muted/30 rounded-md p-3 text-sm space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('pages.orderSuccess.price')}</span>
                          <span>${extractBasePrice(Number(order.total_amount)).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('pages.orderSuccess.vat16')}</span>
                          <span>${calculateIncludedVAT(Number(order.total_amount)).toFixed(2)}</span>
                        </div>
                        <Separator className="my-1.5" />
                        <div className="flex justify-between font-medium">
                          <span>{t('pages.orderSuccess.total')}</span>
                          <span>${Number(order.total_amount).toFixed(2)}</span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
                  {t('pages.orderSuccess.weCouldnTRetrieveOrderDetails')}
                </div>
              )}

              <div className="space-y-2 text-left">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('pages.orderSuccess.paymentMethod')}
                </h3>
                <p className="text-sm text-foreground">{paymentLabel}</p>
              </div>

              {formattedAddress && (
                <div className="space-y-2 text-left">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('pages.orderSuccess.shippingAddress')}
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
                  <p className="text-sm font-semibold">{t('pages.orderSuccess.whatHappensNext')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('pages.orderSuccess.followTheProgressOfYourOrder')}
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
                  {t('pages.orderSuccess.trackMyOrders')}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
                  <Home className="mr-2 h-4 w-4" />
                  {t('pages.orderSuccess.continueShopping')}
                </Button>
              </div>
            </aside>
          </div>

          <div className="mt-10 border border-border/60 rounded-lg bg-muted/30 p-6 text-left">
            <h3 className="text-sm font-semibold mb-2">{t('pages.orderSuccess.needHelp')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('pages.orderSuccess.ifYouHaveAnyQuestionsAbout')}
            </p>
            <Button
              variant="ghost"
              className="mt-3"
              onClick={() => navigate("/contact", { state: { subject: "Order support" } })}
            >
              {t('pages.orderSuccess.contactSupport')}
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

