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
  Edit,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
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
      phone_number?: string | null; // Fallback for database field name
      createdAt?: string; // Fix for lint error
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
    payment?: {
      method?: string;
      status?: string;
      url?: string;
      fields?: Record<string, string>;
    };
    url?: string;
    fields?: Record<string, string>;
    method?: string;
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
  const location = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const { items: cartItems, isLoading, refreshCart } = useCart();

  const [step, setStep] = useState<CheckoutStep>("address");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "new" | null>(null);
  const [addressForm, setAddressForm] = useState<CheckoutAddress>(INITIAL_ADDRESS);
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'CDF'>('USD');
  const [exchangeRate, setExchangeRate] = useState<number>(2850); // Default to 2850 if fetch fails
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [expandedAddressId, setExpandedAddressId] = useState<string | null>(null);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );
  // User requested to remove shipping and tax calculations
  const shipping = 0;
  const tax = 0;
  const total = useMemo(() => subtotal, [subtotal]);

  const steps: Array<{ id: CheckoutStep; name: string; description: string }> = [
    {
      id: "address",
      name: t('checkoutShippingStep'),
      description: t('checkoutShippingDesc'),
    },
    {
      id: "payment",
      name: t('checkoutPaymentStep'),
      description: t('checkoutPaymentDesc'),
    },
    {
      id: "review",
      name: t('checkoutReviewStep'),
      description: t('checkoutReviewDesc'),
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

  // Helper function to normalize address input (similar to CustomerDashboard)
  const normalizeAddressInput = useCallback((input: unknown): {
    street?: string;
    street2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  } | null => {
    if (!input) return null;

    if (typeof input === "string") {
      const trimmed = input.trim();
      if (!trimmed) return null;
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed === "object") {
          return normalizeAddressInput(parsed);
        }
      } catch {
        return { street: trimmed };
      }
    }

    if (typeof input !== "object") {
      return null;
    }

    const address = input as Record<string, unknown>;

    const streetParts = [
      address.addressLine1,
      address.line1,
      address.street1,
      address.street,
      address.address,
      address.streetAddress,
    ]
      .map((part) => (typeof part === "string" ? part.trim() : ""))
      .filter(Boolean);

    const additionalStreet = [
      address.addressLine2,
      address.line2,
      address.street2,
      address.unit,
    ]
      .map((part) => (typeof part === "string" ? part.trim() : ""))
      .filter(Boolean);

    const street = streetParts.length
      ? streetParts.join(", ")
      : typeof address.fullAddress === "string"
        ? address.fullAddress
        : undefined;

    if (!street && !additionalStreet.length) {
      return null;
    }

    const city = typeof address.city === "string" ? address.city.trim() : undefined;
    const state =
      typeof address.state === "string" ? address.state.trim() : undefined;
    const postalCode =
      typeof address.postalCode === "string"
        ? address.postalCode.trim()
        : typeof address.zip === "string"
          ? address.zip.trim()
          : typeof address.pincode === "string"
            ? address.pincode.trim()
            : undefined;
    const country =
      typeof address.country === "string" ? address.country.trim() : undefined;

    return {
      street: street ?? additionalStreet.join(", "),
      street2: additionalStreet.join(", ") || undefined,
      city,
      state,
      postalCode,
      country,
    };
  }, []);

  const loadSavedAddresses = useCallback(async (selectNewest = false) => {
    if (!isAuthenticated) return;

    setIsLoadingAddresses(true);
    try {
      // Get both profile and saved addresses
      const [profileResponse, addressesResponse] = await Promise.all([
        apiClient.getCustomerProfile() as Promise<CustomerProfileResponse>,
        apiClient.getCustomerAddresses() as Promise<{
          success?: boolean;
          data?: { addresses?: any[] };
          error?: { message?: string };
        }>,
      ]);

      const customer = profileResponse?.data?.customer;
      const allAddresses: any[] = [];

      // Add profile/signup address as default if it exists
      // Profile address removed as per user request to only show manually added addresses
      // if (customer?.address) {
      //   const profileAddressData = normalizeAddressInput(customer.address);
      //   if (profileAddressData?.street) {
      //     const nameParts = [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim();
      //     const fullName = nameParts || customer.email || t('customerDashboard.customerRole', 'Customer');
      //
      //     allAddresses.push({
      //       id: "profile-address",
      //       label: t('addressHome'),
      //       full_name: fullName,
      //       email: customer.email || "",
      //       phone: customer.phoneNumber || "",
      //       street1: profileAddressData.street,
      //       street2: profileAddressData.street2 || null,
      //       city: profileAddressData.city || "",
      //       state: profileAddressData.state || "",
      //       postal_code: profileAddressData.postalCode || "",
      //       country: profileAddressData.country || "India",
      //       is_default: true,
      //       is_profile_address: true,
      //       created_at: customer.createdAt || new Date().toISOString(),
      //     });
      //   }
      // }

      // Add other saved addresses
      if (addressesResponse?.success && addressesResponse.data?.addresses) {
        const savedAddresses = addressesResponse.data.addresses.map(addr => ({
          ...addr,
          is_default: false, // Profile address is always default
        }));
        allAddresses.push(...savedAddresses);
      }

      setSavedAddresses(allAddresses);

      // If selectNewest is true (returning from Add Address page), select the most recently added address
      if (selectNewest && allAddresses.length > 0) {
        // Sort by created_at descending and select the first one (excluding profile address)
        const nonProfileAddresses = allAddresses.filter(addr => addr.id !== "profile-address");
        if (nonProfileAddresses.length > 0) {
          const sortedAddresses = [...nonProfileAddresses].sort((a, b) => {
            const dateA = new Date(a.created_at || 0).getTime();
            const dateB = new Date(b.created_at || 0).getTime();
            return dateB - dateA;
          });
          const newestAddress = sortedAddresses[0];
          setSelectedAddressId(newestAddress.id);
          setAddressForm({
            fullName: newestAddress.full_name || "",
            email: newestAddress.email || "",
            phone: newestAddress.phone || "",
            street1: newestAddress.street1 || "",
            street2: newestAddress.street2 || "",
            city: newestAddress.city || "",
            state: newestAddress.state || "",
            postalCode: newestAddress.postal_code || "",
            country: newestAddress.country || "India",
            label: newestAddress.label || "Home",
          });
          setShowNewAddressForm(false);
        } else {
          // If no saved addresses, select profile address
          const profileAddr = allAddresses.find(addr => addr.id === "profile-address");
          if (profileAddr) {
            setSelectedAddressId(profileAddr.id);
            setAddressForm({
              fullName: profileAddr.full_name || "",
              email: profileAddr.email || "",
              phone: profileAddr.phone || "",
              street1: profileAddr.street1 || "",
              street2: profileAddr.street2 || "",
              city: profileAddr.city || "",
              state: profileAddr.state || "",
              postalCode: profileAddr.postal_code || "",
              country: profileAddr.country || "India",
              label: profileAddr.label || "Home",
            });
            setShowNewAddressForm(false);
          }
        }
      } else {
        // Use first saved address or default to new
        if (allAddresses.length > 0) {
          const firstAddr = allAddresses[0];
          setSelectedAddressId(firstAddr.id);
          setAddressForm({
            fullName: firstAddr.full_name || "",
            email: firstAddr.email || "",
            phone: firstAddr.phone || "",
            street1: firstAddr.street1 || "",
            street2: firstAddr.street2 || "",
            city: firstAddr.city || "",
            state: firstAddr.state || "",
            postalCode: firstAddr.postal_code || "",
            country: firstAddr.country || "India",
            label: firstAddr.label || "Home",
          });
          setShowNewAddressForm(false);
        } else {
          // No addresses at all, load profile data for new address form
          if (customer) {
            const nameParts = [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim();
            const fallbackName = nameParts || (user?.email ?? "Customer");
            const phone = customer.phoneNumber || customer.phone_number || null;
            setAddressForm((prev) => ({
              ...prev,
              fullName: fallbackName,
              email: customer.email ?? "",
              phone: phone ?? "",
            }));
          }
          setSelectedAddressId("new");
          setShowNewAddressForm(true);
        }
      }
    } catch (error) {
      console.error("Failed to load addresses:", error);
      setSelectedAddressId("new");
      setShowNewAddressForm(true);
    } finally {
      setIsLoadingAddresses(false);
    }
  }, [isAuthenticated, user?.email, normalizeAddressInput]);

  useEffect(() => {
    // Fetch live exchange rate
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.CDF) {
          setExchangeRate(data.rates.CDF);
        }
      })
      .catch(err => console.error('Failed to fetch exchange rate:', err));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: t('signIn'),
        description: t('authRequiredDescription'),
      });
      navigate("/customer/login", { replace: true, state: { redirectTo: "/checkout" } });
      return;
    }

    if (cartItems.length === 0 && !isLoading) {
      toast({
        title: t('cartEmpty'),
        description: t('startShoppingMsg'),
      });
      navigate("/cart", { replace: true });
      return;
    }

    // Check if we're returning from Add Address page
    const isReturningFromAddAddress = (location.state as any)?.from === "/customer/address/add";

    void loadSavedAddresses(isReturningFromAddAddress);
  }, [cartItems.length, isAuthenticated, isLoading, loadSavedAddresses, navigate, toast]);

  const updateAddressField = (field: keyof CheckoutAddress, value: string) => {
    setAddressForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectAddress = (addressId: string) => {
    const address = savedAddresses.find((addr) => addr.id === addressId);
    if (address) {
      setSelectedAddressId(addressId);
      setAddressForm({
        fullName: address.full_name || "",
        email: address.email || "",
        phone: address.phone || "",
        street1: address.street1 || "",
        street2: address.street2 || "",
        city: address.city || "",
        state: address.state || "",
        postalCode: address.postal_code || "",
        country: address.country || "India",
        label: address.label || "Home",
      });
      setShowNewAddressForm(false);
    }
  };

  const handleAddNewAddress = () => {
    // Redirect to Add Address page
    navigate("/customer/address/add", {
      state: { from: "/checkout" }
    });
  };

  const handleAddressContinue = async () => {
    // Validate address form
    const missingField = requiredAddressFields.find((field) => {
      const value = addressForm[field];
      return typeof value !== "string" || !value.trim();
    });

    if (missingField) {
      toast({
        title: t('missingInformation'),
        description: t('completeField', { field: missingField.toString() }),
        variant: "destructive",
      });
      return;
    }

    // If it's a new address and user wants to save it, save it first
    if (selectedAddressId === "new" && saveAddressToProfile) {
      try {
        const addressData = {
          label: addressForm.label || "Home",
          fullName: addressForm.fullName,
          email: addressForm.email,
          phone: addressForm.phone,
          street1: addressForm.street1,
          street2: addressForm.street2,
          city: addressForm.city,
          state: addressForm.state,
          postalCode: addressForm.postalCode,
          country: addressForm.country,
          isDefault: savedAddresses.length === 0, // Set as default if it's the first address
        };

        const response = (await apiClient.createCustomerAddress(addressData)) as {
          success?: boolean;
          data?: { address?: any };
          error?: { message?: string };
        };

        if (response?.success && response.data?.address) {
          // Reload addresses to get the new one
          await loadSavedAddresses();
          toast({
            title: t('changesSaved'),
            description: t('productUpdatesuccess'),
          });
        }
      } catch (error) {
        console.error("Failed to save address:", error);
        // Continue anyway, don't block checkout
      }
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

  const selectedShippingAddress = addressForm;

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

    const missingField = requiredAddressFields.find((field) => {
      const value = selectedShippingAddress[field];
      return typeof value !== "string" || !value.trim();
    });

    if (missingField) {
      toast({
        title: t('missingInformation'),
        description: t('completeField', { field: missingField.toString() }),
        variant: "destructive",
      });
      setStep("address");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const shippingAddressPayload = { ...selectedShippingAddress } as Record<string, unknown>;
      // Determine if the selected address is a new one and if it should be saved
      const isNewAddress = selectedAddressId === "new";
      const shouldSaveAddress = isNewAddress && saveAddressToProfile;
      // For now, assume no profile address distinction needed for saving
      const isProfileAddress = false; // This logic was commented out previously

      const response = (await apiClient.createCustomerOrders({
        paymentMethod,
        shippingAddress: shippingAddressPayload,
        saveAddressToProfile: shouldSaveAddress && !isProfileAddress,
        currency: paymentMethod === 'online' ? currency : 'USD',
      })) as CreateOrderResponse;

      if (!response?.success) {
        throw new Error(
          response?.error?.message ||
          t('somethingWentWrong'),
        );
      }

      if (response.data?.payment?.url && response.data?.payment?.fields) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = response.data.payment.url;
        form.style.display = 'none';

        Object.entries(response.data.payment.fields).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        return;
      }

      if (response.data?.url) {
        window.location.href = response.data.url;
        return;
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
        title: t('orderNotPlaced'),
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
              {t('backToCart')}
            </Button>

            <Badge variant="outline" className="hidden md:inline-flex items-center gap-2 text-sm">
              <Truck className="h-3 w-3" />
              {t('fastSecuredDelivery')}
            </Badge>
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold mb-6">{t('checkout')}</h1>

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
                    className={`px-4 py-4 md:px-6 md:py-5 flex flex-col gap-1 transition-colors ${isActive
                      ? "bg-background text-foreground border-b-2 border-primary"
                      : "text-muted-foreground"
                      } ${isCompleted ? "bg-background/70" : ""}`}
                  >
                    <span className="text-xs font-medium uppercase tracking-wide">
                      {t('step')} {steps.findIndex((s) => s.id === item.id) + 1}
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
                        <h2 className="text-lg md:text-xl font-semibold">{t('shippingAddress')}</h2>
                        <p className="text-sm text-muted-foreground">
                          {t('chooseDeliveryLocation')}
                        </p>
                      </div>
                    </div>

                    {isLoadingAddresses ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-sm text-muted-foreground">{t('loadingAddresses')}</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Display saved addresses */}
                        {savedAddresses.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-sm font-medium text-muted-foreground">{t('savedAddresses')}</p>
                            {savedAddresses.map((address) => {
                              const isExpanded = expandedAddressId === address.id;
                              const isSelected = selectedAddressId === address.id;

                              return (
                                <div
                                  key={address.id}
                                  className={`border rounded-lg transition-all ${isSelected
                                    ? "border-primary shadow-sm bg-primary/5"
                                    : "border-border/80 hover:border-primary/60"
                                    }`}
                                >
                                  <label
                                    className="cursor-pointer block"
                                    onClick={() => handleSelectAddress(address.id)}
                                  >
                                    <div className="p-4">
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3 flex-1">
                                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Home className="h-5 w-5 text-primary" />
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                              <p className="font-medium">{address.label || t('addressHome')}</p>
                                              {address.is_default && (
                                                <Badge variant="secondary" className="text-xs">{t('default')}</Badge>
                                              )}
                                            </div>

                                            {/* Always show basic info */}
                                            <div className="space-y-1">
                                              <p className="text-sm font-medium text-foreground">
                                                {address.full_name}
                                              </p>
                                              <p className="text-sm text-muted-foreground">
                                                {address.street1}
                                                {address.street2 && `, ${address.street2}`}
                                              </p>
                                              <p className="text-sm text-muted-foreground">
                                                {[address.city, address.state, address.postal_code]
                                                  .filter(Boolean)
                                                  .join(", ")}
                                                {address.country && `, ${address.country}`}
                                              </p>
                                              {address.phone && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                  {t('phone')}: {address.phone}
                                                </p>
                                              )}
                                            </div>

                                            {/* Expanded details */}
                                            {isExpanded && (
                                              <div className="mt-3 pt-3 border-t border-border/60 space-y-2">
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                  <div>
                                                    <span className="text-muted-foreground">Email:</span>
                                                    <span className="ml-1 text-foreground">{address.email || "N/A"}</span>
                                                  </div>
                                                  {address.alt_phone && (
                                                    <div>
                                                      <span className="text-muted-foreground">Alt. Phone:</span>
                                                      <span className="ml-1 text-foreground">{address.alt_phone}</span>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                          <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => handleSelectAddress(address.id)}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </label>

                                  {/* Action buttons */}
                                  <div className="px-4 pb-4 flex items-center justify-between gap-2 border-t border-border/60 pt-3">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedAddressId(isExpanded ? null : address.id);
                                      }}
                                      className="text-xs"
                                    >
                                      {isExpanded ? (
                                        <>
                                          <ChevronUp className="h-3 w-3 mr-1" />
                                          {t('checkoutShowLess')}
                                        </>
                                      ) : (
                                        <>
                                          <ChevronDown className="h-3 w-3 mr-1" />
                                          {t('checkoutShowDetails')}
                                        </>
                                      )}
                                    </Button>
                                    {!address.is_profile_address && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigate("/customer/address/add", {
                                            state: {
                                              from: "/checkout",
                                              editAddressId: address.id,
                                              addressData: address,
                                            },
                                          });
                                        }}
                                        className="text-xs"
                                      >
                                        <Edit className="h-3 w-3 mr-1" />
                                        {t('checkoutEdit')}
                                      </Button>
                                    )}
                                    {address.is_profile_address && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigate("/customer/profile");
                                        }}
                                        className="text-xs"
                                      >
                                        <Edit className="h-3 w-3 mr-1" />
                                        {t('editInProfile')}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Add new address button */}
                        <button
                          type="button"
                          onClick={handleAddNewAddress}
                          className={`w-full border rounded-lg p-4 cursor-pointer transition-all text-left ${selectedAddressId === "new"
                            ? "border-primary shadow-sm bg-primary/5"
                            : "border-border/80 hover:border-primary/60"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{t('addNewAddress')}</p>
                              <p className="text-xs text-muted-foreground">
                                {t('enterDeliveryAddress')}
                              </p>
                            </div>
                          </div>
                        </button>

                        {/* New address form */}
                        {showNewAddressForm && (
                          <div className="border border-border/60 rounded-lg p-4 md:p-6 space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <Label htmlFor="fullName">{t('firstName')} {t('lastName')}</Label>
                                <Input
                                  id="fullName"
                                  value={addressForm.fullName}
                                  onChange={(event) => updateAddressField("fullName", event.target.value)}
                                  placeholder="Jane Doe"
                                  autoComplete="name"
                                />
                              </div>
                              <div>
                                <Label htmlFor="email">{t('emailAddress')}</Label>
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
                              <Label htmlFor="phone">{t('phone')}</Label>
                              <Input
                                id="phone"
                                value={addressForm.phone}
                                onChange={(event) => updateAddressField("phone", event.target.value)}
                                placeholder="+260 700 000 000"
                                autoComplete="tel"
                              />
                            </div>

                            <div>
                              <Label htmlFor="street1">{t('streetAddress')}</Label>
                              <Input
                                id="street1"
                                value={addressForm.street1}
                                onChange={(event) => updateAddressField("street1", event.target.value)}
                                placeholder="123 Market Avenue"
                                autoComplete="address-line1"
                              />
                            </div>

                            <div>
                              <Label htmlFor="street2">{t('apartmentOptional')}</Label>
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
                                <Label htmlFor="city">{t('city')}</Label>
                                <Input
                                  id="city"
                                  value={addressForm.city}
                                  onChange={(event) => updateAddressField("city", event.target.value)}
                                  placeholder="Lusaka"
                                  autoComplete="address-level2"
                                />
                              </div>
                              <div>
                                <Label htmlFor="state">{t('state')}</Label>
                                <Input
                                  id="state"
                                  value={addressForm.state}
                                  onChange={(event) => updateAddressField("state", event.target.value)}
                                  placeholder="Lusaka Province"
                                  autoComplete="address-level1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="postalCode">{t('postalCode')}</Label>
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
                              <Label htmlFor="country">{t('country')}</Label>
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
                                {t('saveThisAddress')}
                              </Label>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
                      <Button variant="ghost" onClick={() => navigate("/cart")}>
                        {t('modifyCart')}
                      </Button>
                      <Button onClick={handleAddressContinue} disabled={isLoadingAddresses}>
                        {t('continueToPayment')}
                      </Button>
                    </div>
                  </div>
                )}

                {step === "payment" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <h2 className="text-lg md:text-xl font-semibold">{t('paymentMethod')}</h2>
                        <p className="text-sm text-muted-foreground">
                          {t('choosePaymentOption')}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "cod"
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
                              <p className="font-medium">{t('cashOnDelivery')}</p>
                              <p className="text-xs text-muted-foreground">
                                {t('cashOnDeliveryDesc')}
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
                        className={`border rounded-lg p-4 transition-all ${import.meta.env.VITE_ENABLE_MAISHAPAY === 'true'
                          ? "cursor-pointer"
                          : "cursor-not-allowed opacity-60"
                          } ${paymentMethod === "online"
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
                              <p className="font-medium">{t('onlinePayment')}</p>
                              <p className="text-xs text-muted-foreground">
                                {import.meta.env.VITE_ENABLE_MAISHAPAY === 'true'
                                  ? t('onlinePaymentDesc')
                                  : t('onlinePaymentsUnavailable')}
                              </p>
                            </div>
                          </div>
                          <Checkbox
                            checked={paymentMethod === "online"}
                            onCheckedChange={() => {
                              if (import.meta.env.VITE_ENABLE_MAISHAPAY === 'true') {
                                setPaymentMethod("online");
                              } else {
                                toast({
                                  title: t('unavailable'),
                                  description: t('onlinePaymentsDisabled'),
                                  variant: "destructive",
                                });
                              }
                            }}
                            disabled={import.meta.env.VITE_ENABLE_MAISHAPAY !== 'true'}
                          />
                        </div>
                      </label>

                      {paymentMethod === 'online' && (
                        <div className="mt-4 pl-4 border-l-2 border-primary/20">
                          <label className="text-sm font-medium mb-2 block">Select Currency:</label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="currency"
                                value="USD"
                                checked={currency === 'USD'}
                                onChange={() => setCurrency('USD')}
                                className="accent-primary"
                              />
                              <span>USD ($)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="currency"
                                value="CDF"
                                checked={currency === 'CDF'}
                                onChange={() => setCurrency('CDF')}
                                className="accent-primary"
                              />
                              <span>CDF ({(total * exchangeRate).toLocaleString()} FC)</span>
                            </label>
                          </div>
                          {currency === 'CDF' && (
                            <p className="text-xs text-muted-foreground mt-1">
                              * Exchange Rate: 1 USD = {exchangeRate} CDF
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
                      <Button variant="outline" onClick={handleBack}>
                        {t('backToAddress')}
                      </Button>
                      <Button onClick={() => setStep("review")}>{t('reviewOrder')}</Button>
                    </div>
                  </div>
                )}

                {step === "review" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <div>
                        <h2 className="text-lg md:text-xl font-semibold">{t('reviewAndConfirm')}</h2>
                        <p className="text-sm text-muted-foreground">
                          {paymentMethod === "online"
                            ? t('completePaymentToPlaceOrder')
                            : t('checkDetailsBeforePlacingOrder')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border border-border/60 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('shippingAddressLabel')}</p>
                            <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                              {formattedShippingAddress}
                            </pre>
                          </div>
                          <Button variant="link" size="sm" onClick={() => setStep("address")}>
                            {t('checkoutChange')}
                          </Button>
                        </div>
                      </div>

                      <div className="border border-border/60 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('paymentMethodLabel')}</p>
                            <p className="mt-2 text-sm font-semibold">
                              {paymentMethod === "cod" ? t('cashOnDelivery') : "Maisha Pay (Card / Apple Pay / Google Pay)"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {paymentMethod === "cod"
                                ? t('cashOnDeliveryDesc')
                                : t('completePaymentToPlaceOrder')}
                            </p>
                          </div>
                          <Button variant="link" size="sm" onClick={() => setStep("payment")}>
                            {t('checkoutChange')}
                          </Button>
                        </div>
                      </div>

                      {/* Maisha Pay Payment Section */}
                      {paymentMethod === "online" && (
                        <div className="border border-border/60 rounded-lg p-4">
                          <div className="space-y-4">
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground mb-4">
                                {t('maishaPayPaymentInstruction')}
                              </p>
                            </div>
                            <Button
                              size="lg"
                              className="w-full bg-[#635BFF] hover:bg-[#635BFF]/90 text-white"
                              onClick={() => {
                                // TODO: Implement Maisha Pay Checkout
                                handlePlaceOrder();
                              }}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  {t('processingToMaishaPay')}
                                </>
                              ) : (
                                t('payWithMaishaPay')
                              )}
                            </Button>
                            <p className="text-xs text-muted-foreground text-center mt-2">
                              {t('maishaPayRedirectNotice')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border border-border/60 rounded-lg">
                      <div className="p-4 border-b border-border/60 flex items-center justify-between">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                          {t('orderItems')}
                        </h3>
                        <Badge variant="outline">{t('items_plural', { count: cartItems.length })}</Badge>
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
                                {t('quantity')}: <span className="font-semibold text-foreground">{item.quantity}</span>
                              </p>
                            </div>
                            <div className="text-sm font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {paymentMethod === "cod" && (
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
                        <Button variant="outline" onClick={handleBack}>
                          {t('back')}
                        </Button>
                        <Button size="lg" className="px-6" onClick={() => handlePlaceOrder()} disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {t('placeOrder')}
                        </Button>
                      </div>
                    )}

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
                  <h2 className="text-lg font-semibold mb-1">{t('orderSummary')}</h2>
                  <p className="text-sm text-muted-foreground">
                    {t('reviewDesc')}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t('totalItems')}</span>
                    <span className="font-semibold text-foreground">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                  {/* Shipping and Tax removed as per user request */}
                </div>

                <Separator />

                <div className="flex justify-between text-base font-semibold">
                  <span>{t('totalAmount')}</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="rounded-md bg-muted/60 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-success" />
                    <span>{t('securedBySSL')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4 text-primary" />
                    <span>{t('fastReliableDelivery')}</span>
                  </div>
                </div>

                <div className="rounded-md border border-dashed border-border/60 p-4 text-xs text-muted-foreground">
                  {t('promoCodeNotice')}
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