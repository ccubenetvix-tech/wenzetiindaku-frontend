import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Home,
  MapPin,
  Loader2,
  Shield,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/utils/api";

type CheckoutStep = "address" | "payment" | "review";
type PaymentMethod = "cod" | "online";

interface CustomerProfileResponse {
  success?: boolean;
  data?: {
    customer?: {
      firstName?: string | null;
      lastName?: string | null;
      email?: string;
      phoneNumber?: string | null;
      address?: string | Record<string, unknown> | null;
    };
  };
}

interface CheckoutAddress {
  fullName: string;
  email: string;
  phone: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  label?: string;
}

interface CreateOrderResponse {
  success?: boolean;
  message?: string;
  error?: { message?: string } | null;
  data?: {
    orders?: any[];
    payment?: { method?: string; status?: string };
  } | null;
}

const INITIAL_ADDRESS: CheckoutAddress = {
  fullName: "",
  email: "",
  phone: "",
  street1: "",
  street2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

const requiredAddressFields: Array<keyof CheckoutAddress> = [
  "fullName",
  "email",
  "phone",
  "street1",
  "city",
  "state",
  "postalCode",
  "country",
];

const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const { items: cartItems, isLoading, refreshCart } = useCart();

  const [step, setStep] = useState<CheckoutStep>("address");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [profileAddress, setProfileAddress] = useState<CheckoutAddress | null>(null);
  const [selectedAddressOption, setSelectedAddressOption] = useState<"profile" | "new">("profile");
  const [addressForm, setAddressForm] = useState<CheckoutAddress>(INITIAL_ADDRESS);
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );
  const shipping = useMemo(() => (cartItems.length > 0 ? 5.99 : 0), [cartItems.length]);
  const tax = useMemo(() => (cartItems.length > 0 ? subtotal * 0.1 : 0), [cartItems.length, subtotal]);
  const total = useMemo(() => subtotal + shipping + tax, [shipping, subtotal, tax]);

  const steps: Array<{ id: CheckoutStep; name: string; description: string }> = [
    {
      id: "address",
      name: "Shipping",
      description: "Confirm your shipping details",
    },
    {
      id: "payment",
      name: "Payment",
      description: "Choose how you want to pay",
    },
    {
      id: "review",
      name: "Review",
      description: "Final review before placing order",
    },
  ];

  const normalizeProfileAddress = useCallback(
    (address: unknown, fallbackName: string, email?: string, phone?: string | null): CheckoutAddress | null => {
      if (!address) return null;

      const base: CheckoutAddress = {
        ...INITIAL_ADDRESS,
        fullName: fallbackName,
        email: email ?? "",
        phone: phone ?? "",
      };

      try {
        if (typeof address === "string") {
          const trimmed = address.trim();

          if (!trimmed) return base;

          if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
            const parsed = JSON.parse(trimmed);
            return normalizeProfileAddress(parsed, fallbackName, email, phone);
          }

          return {
            ...base,
            street1: trimmed,
          };
        }

        if (typeof address === "object" && address !== null) {
          const parsed = address as Record<string, unknown>;
          return {
            ...base,
            fullName:
              typeof parsed.fullName === "string" && parsed.fullName.trim()
                ? parsed.fullName
                : base.fullName,
            phone:
              typeof parsed.phone === "string" && parsed.phone.trim()
                ? parsed.phone
                : base.phone,
            street1:
              typeof parsed.street1 === "string" && parsed.street1.trim()
                ? parsed.street1
                : typeof parsed.street === "string" && parsed.street.trim()
                ? parsed.street
                : base.street1,
            street2:
              typeof parsed.street2 === "string" && parsed.street2.trim()
                ? parsed.street2
                : undefined,
            city:
              typeof parsed.city === "string" && parsed.city.trim()
                ? parsed.city
                : base.city,
            state:
              typeof parsed.state === "string" && parsed.state.trim()
                ? parsed.state
                : base.state,
            postalCode:
              typeof parsed.postalCode === "string" && parsed.postalCode.trim()
                ? parsed.postalCode
                : typeof parsed.zip === "string" && parsed.zip.trim()
                ? parsed.zip
                : base.postalCode,
            country:
              typeof parsed.country === "string" && parsed.country.trim()
                ? parsed.country
                : base.country,
            label:
              typeof parsed.label === "string" && parsed.label.trim()
                ? parsed.label
                : undefined,
          };
        }
      } catch (error) {
        console.warn("Unable to normalize profile address:", error);
      }

      return base;
    },
    []
  );

  const loadProfileAddress = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoadingProfile(true);
    try {
      const response = (await apiClient.getCustomerProfile()) as CustomerProfileResponse;
      const customer = response?.data?.customer;

      if (!customer) return;

      const nameParts = [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim();
      const fallbackName = nameParts || (user?.email ?? "Customer");

      if (customer.address) {
        const normalized = normalizeProfileAddress(
          customer.address,
          fallbackName,
          customer.email,
          customer.phoneNumber
        );
        if (normalized) {
          setProfileAddress(normalized);
          setAddressForm((prev) => ({
            ...prev,
            ...normalized,
          }));
          setSelectedAddressOption("profile");
          return;
        }
      }

      // If there is no saved address, seed the form with profile basics
      setSelectedAddressOption("new");
      setAddressForm((prev) => ({
        ...prev,
        fullName: fallbackName,
        email: customer.email ?? "",
        phone: customer.phoneNumber ?? "",
      }));
    } catch (error) {
      console.error("Failed to load customer profile:", error);
      setSelectedAddressOption("new");
    } finally {
      setIsLoadingProfile(false);
    }
  }, [isAuthenticated, normalizeProfileAddress, user?.email]);

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in as a customer to proceed to checkout.",
      });
      navigate("/customer/login", { replace: true, state: { redirectTo: "/checkout" } });
      return;
    }

    if (cartItems.length === 0 && !isLoading) {
      toast({
        title: "Your cart is empty",
        description: "Add some products to your cart before proceeding to checkout.",
      });
      navigate("/cart", { replace: true });
      return;
    }

    void loadProfileAddress();
  }, [cartItems.length, isAuthenticated, isLoading, loadProfileAddress, navigate, toast]);

  const updateAddressField = (field: keyof CheckoutAddress, value: string) => {
    setAddressForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUseProfileAddress = () => {
    if (!profileAddress) {
      toast({
        title: "No saved address",
        description: "We couldn't find an address in your profile. Please add a new address.",
        variant: "destructive",
      });
      setSelectedAddressOption("new");
      return;
    }

    setAddressForm((prev) => ({
      ...prev,
      ...profileAddress,
    }));
    setSelectedAddressOption("profile");
  };

  const handleAddressContinue = () => {
    const addressToValidate =
      selectedAddressOption === "profile" && profileAddress ? profileAddress : addressForm;

    const missingField = requiredAddressFields.find((field) => {
      const value = addressToValidate[field];
      return typeof value !== "string" || !value.trim();
    });

    if (missingField) {
      toast({
        title: "Missing information",
        description: `Please complete the ${missingField.toString()} field before continuing.`,
        variant: "destructive",
      });
      return;
    }

    setStep("payment");
  };

  const handleBack = () => {
    setStep((prev) => {
      if (prev === "review") return "payment";
      if (prev === "payment") return "address";
      return prev;
    });
  };

  const selectedShippingAddress =
    selectedAddressOption === "profile" && profileAddress ? profileAddress : addressForm;

  const formattedShippingAddress = [
    selectedShippingAddress.fullName,
    selectedShippingAddress.street1,
    selectedShippingAddress.street2,
    [selectedShippingAddress.city, selectedShippingAddress.state, selectedShippingAddress.postalCode]
      .filter(Boolean)
      .join(", "),
    selectedShippingAddress.country,
  ]
    .filter(Boolean)
    .join("\n");

  const handlePlaceOrder = async () => {
    if (paymentMethod === "online") {
      toast({
        title: "Online payments coming soon",
        description: "We're preparing secure online payments. Please choose Pay on Delivery for now.",
      });
      return;
    }

    const missingField = requiredAddressFields.find((field) => {
      const value = selectedShippingAddress[field];
      return typeof value !== "string" || !value.trim();
    });

    if (missingField) {
      toast({
        title: "Missing information",
        description: `Please complete the ${missingField.toString()} field before placing your order.`,
        variant: "destructive",
      });
      setStep("address");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const shippingAddressPayload = { ...selectedShippingAddress } as Record<string, unknown>;

      const response = (await apiClient.createCustomerOrders({
        paymentMethod,
        shippingAddress: shippingAddressPayload,
        saveAddressToProfile,
      })) as CreateOrderResponse;

      if (!response?.success) {
        throw new Error(
          response?.error?.message ||
            "Unable to place order. Please try again.",
        );
      }

      await refreshCart();

      navigate("/checkout/success", {
        state: {
          orders: response.data?.orders ?? [],
          payment: response.data?.payment ?? { method: paymentMethod, status: "pending" },
          shippingAddress: selectedShippingAddress,
        },
        replace: true,
      });
    } catch (error) {
      console.error("Failed to place order", error);
      const message =
        error instanceof Error
          ? error.message
          : (error as CreateOrderResponse)?.error?.message ??
            "Something went wrong while placing your order. Please try again.";
      setSubmitError(message);
      toast({
        title: "Order not placed",
        description: message,
        variant: "destructive",
      });
      navigate("/checkout/failure", {
        state: {
          reason: message,
          paymentMethod,
        },
        replace: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 md:py-10">
          <div className="flex items-center justify-between mb-6 md:mb-10">
            <Button variant="ghost" onClick={() => navigate("/cart")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to cart
            </Button>

            <Badge variant="outline" className="hidden md:inline-flex items-center gap-2 text-sm">
              <Truck className="h-3.5 w-3.5" />
              Fast & secured delivery
            </Badge>
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold mb-6">Checkout</h1>

          {/* Step indicator */}
          <div className="mb-8 border border-border/60 rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 divide-x divide-border/60 bg-muted/60">
              {steps.map((item) => {
                const isActive = item.id === step;
                const isCompleted =
                  (step === "payment" && item.id === "address") ||
                  (step === "review" && item.id !== "review");

                return (
                  <div
                    key={item.id}
                    className={`px-4 py-4 md:px-6 md:py-5 flex flex-col gap-1 transition-colors ${
                      isActive
                        ? "bg-background text-foreground border-b-2 border-primary"
                        : "text-muted-foreground"
                    } ${isCompleted ? "bg-background/70" : ""}`}
                  >
                    <span className="text-xs font-medium uppercase tracking-wide">
                      Step {steps.findIndex((s) => s.id === item.id) + 1}
                    </span>
                    <span className="text-sm md:text-base font-semibold flex items-center gap-2">
                      {isCompleted && <CheckCircle className="h-4 w-4 text-primary" />}
                      {item.name}
                    </span>
                    <span className="hidden md:block text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 lg:gap-10">
            <section className="bg-card border border-border/60 rounded-lg shadow-sm">
              <div className="p-6 md:p-8 space-y-8">
                {step === "address" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <h2 className="text-lg md:text-xl font-semibold">Shipping address</h2>
                        <p className="text-sm text-muted-foreground">
                          Choose where you would like your order delivered.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-3 md:grid-cols-2">
                        <label
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedAddressOption === "profile"
                              ? "border-primary shadow-sm bg-primary/5"
                              : "border-border/80 hover:border-primary/60"
                          } ${!profileAddress ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Home className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">Use saved address</p>
                                <p className="text-xs text-muted-foreground">
                                  {profileAddress
                                    ? "Quickly use the address from your profile."
                                    : "No saved address found in profile."}
                                </p>
                              </div>
                            </div>
                            <Checkbox
                              disabled={!profileAddress}
                              checked={selectedAddressOption === "profile"}
                              onCheckedChange={() => handleUseProfileAddress()}
                            />
                          </div>
                          {profileAddress && selectedAddressOption === "profile" && (
                            <pre className="mt-3 rounded-md bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
                              {formattedShippingAddress}
                            </pre>
                          )}
                        </label>

                        <label
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedAddressOption === "new"
                          ? "border-primary shadow-sm bg-primary/5"
                          : "border-border/80 hover:border-primary/60"
                          }`}
                          onClick={() => setSelectedAddressOption("new")}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <MapPin className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">Add new address</p>
                                <p className="text-xs text-muted-foreground">
                                  Enter a different delivery address for this order.
                                </p>
                              </div>
                            </div>
                            <Checkbox checked={selectedAddressOption === "new"} />
                          </div>
                        </label>
                      </div>

                      {selectedAddressOption === "new" && (
                        <div className="border border-border/60 rounded-lg p-4 md:p-6 space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <Label htmlFor="fullName">Full name</Label>
                              <Input
                                id="fullName"
                                value={addressForm.fullName}
                                onChange={(event) => updateAddressField("fullName", event.target.value)}
                                placeholder="Jane Doe"
                                autoComplete="name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email address</Label>
                              <Input
                                id="email"
                                type="email"
                                value={addressForm.email}
                                onChange={(event) => updateAddressField("email", event.target.value)}
                                placeholder="jane@example.com"
                                autoComplete="email"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="phone">Phone number</Label>
                            <Input
                              id="phone"
                              value={addressForm.phone}
                              onChange={(event) => updateAddressField("phone", event.target.value)}
                              placeholder="+260 700 000 000"
                              autoComplete="tel"
                            />
                          </div>

                          <div>
                            <Label htmlFor="street1">Street address</Label>
                            <Input
                              id="street1"
                              value={addressForm.street1}
                              onChange={(event) => updateAddressField("street1", event.target.value)}
                              placeholder="123 Market Avenue"
                              autoComplete="address-line1"
                            />
                          </div>

                          <div>
                            <Label htmlFor="street2">Apartment, suite (optional)</Label>
                            <Input
                              id="street2"
                              value={addressForm.street2 ?? ""}
                              onChange={(event) => updateAddressField("street2", event.target.value)}
                              placeholder="Apartment 5B"
                              autoComplete="address-line2"
                            />
                          </div>

                          <div className="grid gap-4 md:grid-cols-3">
                            <div>
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                value={addressForm.city}
                                onChange={(event) => updateAddressField("city", event.target.value)}
                                placeholder="Lusaka"
                                autoComplete="address-level2"
                              />
                            </div>
                            <div>
                              <Label htmlFor="state">State / Region</Label>
                              <Input
                                id="state"
                                value={addressForm.state}
                                onChange={(event) => updateAddressField("state", event.target.value)}
                                placeholder="Lusaka Province"
                                autoComplete="address-level1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="postalCode">Postal code</Label>
                              <Input
                                id="postalCode"
                                value={addressForm.postalCode}
                                onChange={(event) => updateAddressField("postalCode", event.target.value)}
                                placeholder="10101"
                                autoComplete="postal-code"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              value={addressForm.country}
                              onChange={(event) => updateAddressField("country", event.target.value)}
                              placeholder="Zambia"
                              autoComplete="country-name"
                            />
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <Checkbox
                              id="saveAddress"
                              checked={saveAddressToProfile}
                              onCheckedChange={(checked) => setSaveAddressToProfile(checked === true)}
                            />
                            <Label htmlFor="saveAddress" className="text-sm text-muted-foreground cursor-pointer">
                              Save this address to my profile
                            </Label>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
                      <Button variant="ghost" onClick={() => navigate("/cart")}>
                        Modify cart
                      </Button>
                      <Button onClick={handleAddressContinue} disabled={isLoadingProfile}>
                        Continue to payment
                      </Button>
                    </div>
                  </div>
                )}

                {step === "payment" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <h2 className="text-lg md:text-xl font-semibold">Payment method</h2>
                        <p className="text-sm text-muted-foreground">
                          Choose the payment option that works best for you.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          paymentMethod === "cod"
                            ? "border-primary shadow-sm bg-primary/5"
                            : "border-border/80 hover:border-primary/60"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Pay on delivery</p>
                              <p className="text-xs text-muted-foreground">
                                Pay with cash or POS when your order arrives. Ideal if you prefer paying after inspection.
                              </p>
                            </div>
                          </div>
                          <Checkbox
                            checked={paymentMethod === "cod"}
                            onCheckedChange={() => setPaymentMethod("cod")}
                          />
                        </div>
                      </label>

                      <label
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          paymentMethod === "online"
                            ? "border-primary shadow-sm bg-primary/5"
                            : "border-border/80 hover:border-primary/60"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Card / UPI (Stripe)</p>
                              <p className="text-xs text-muted-foreground">
                                Secure online payment with cards and UPI. We will redirect you to Stripe to complete the payment.
                              </p>
                            </div>
                          </div>
                          <Checkbox
                            checked={paymentMethod === "online"}
                            onCheckedChange={() => setPaymentMethod("online")}
                          />
                        </div>
                      </label>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
                      <Button variant="outline" onClick={handleBack}>
                        Back to address
                      </Button>
                      <Button onClick={() => setStep("review")}>Review order</Button>
                    </div>
                  </div>
                )}

                {step === "review" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <div>
                        <h2 className="text-lg md:text-xl font-semibold">Review & confirm</h2>
                        <p className="text-sm text-muted-foreground">
                          Check your details before placing the order.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border border-border/60 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Shipping address</p>
                            <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                              {formattedShippingAddress}
                            </pre>
                          </div>
                          <Button variant="link" size="sm" onClick={() => setStep("address")}>
                            Change
                          </Button>
                        </div>
                      </div>

                      <div className="border border-border/60 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Payment method</p>
                            <p className="mt-2 text-sm font-semibold">
                              {paymentMethod === "cod" ? "Pay on delivery" : "Stripe (Card / UPI)"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {paymentMethod === "cod"
                                ? "Have cash or card ready at delivery. Our partner will contact you prior to arrival."
                                : "You will be redirected securely to Stripe to complete the payment."}
                            </p>
                          </div>
                          <Button variant="link" size="sm" onClick={() => setStep("payment")}>
                            Change
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="border border-border/60 rounded-lg">
                      <div className="p-4 border-b border-border/60 flex items-center justify-between">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                          Order items
                        </h3>
                        <Badge variant="outline">{cartItems.length} items</Badge>
                      </div>
                      <div className="divide-y divide-border/60">
                        {cartItems.map((item) => (
                          <div key={item.id} className="p-4 flex items-center gap-4">
                            <img
                              src={item.image || "/marketplace.jpeg"}
                              alt={item.name}
                              className="h-16 w-16 rounded-md object-cover border border-border/60"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.vendor}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Quantity: <span className="font-semibold text-foreground">{item.quantity}</span>
                              </p>
                            </div>
                            <div className="text-sm font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
                      <Button variant="outline" onClick={handleBack}>
                        Back
                      </Button>
                      <Button size="lg" className="px-6" onClick={handlePlaceOrder} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Place order
                      </Button>
                    </div>

                    {submitError && (
                      <p className="text-sm text-destructive pt-2">
                        {submitError}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </section>

            <aside className="bg-card border border-border/60 rounded-lg shadow-sm h-fit sticky top-6">
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Order summary</h2>
                  <p className="text-sm text-muted-foreground">
                    Review the cost breakdown before completing your order.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span className="font-medium text-foreground">
                      {shipping > 0 ? `$${shipping.toFixed(2)}` : "Free"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax (10%)</span>
                    <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-base font-semibold">
                  <span>Total amount</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="rounded-md bg-muted/60 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-success" />
                    <span>Secure checkout powered by encrypted SSL</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4 text-primary" />
                    <span>Trusted vendors deliver nationwide in 2-5 days</span>
                  </div>
                </div>

                <div className="rounded-md border border-dashed border-border/60 p-4 text-xs text-muted-foreground">
                  Have a promo code? You’ll be able to apply it on the payment step.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;