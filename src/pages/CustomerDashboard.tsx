import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  Star,
  Bell,
  Settings,
  DollarSign,
  Package,
  Truck,
  MessageSquare,
  Search,
  Plus,
  Trash2,
  Upload,
  Loader2,
  MapPin,
  RefreshCw,
  Minus,
  ShoppingCart,
  Eye,
  CircleCheck,
  Clock3,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist, WishlistItem } from "@/contexts/WishlistContext";
import { apiClient } from "@/utils/api";
import type { CartItem as CartEntry } from "@/contexts/CartContext";

const ORDERS_PAGE_SIZE = 10;

interface CustomerProfileData {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  profilePhoto?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  verified?: boolean;
  createdAt?: string;
  lastLogin?: string | null;
  registrationMethod?: "google" | "email";
}

interface ApiOrderItem {
  id?: string;
  quantity?: number | string | null;
  price?: number | string | null;
  product?: {
    id?: string;
    name?: string;
    price?: number | string | null;
    images?: string[] | null;
    vendor_id?: string | null;
  } | null;
}

interface ApiOrder {
  id: string;
  created_at?: string;
  status?: string | null;
  total_amount?: number | string | null;
  payment_method?: string | null;
  payment_status?: string | null;
  shipping_address?: Record<string, any> | null;
  order_items?: ApiOrderItem[] | null;
}

interface OrderSummary {
  id: string;
  date: string;
  status: string;
  total: number;
  itemsCount: number;
  tracking?: string | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  shippingAddress?: Record<string, any> | null;
  products: ApiOrderItem[];
}

interface CustomerProfileApiResponse {
  success?: boolean;
  data?: { customer?: CustomerProfileData };
  error?: { message?: string };
}

interface CustomerOrdersApiResponse {
  success?: boolean;
  data?: {
    orders?: ApiOrder[];
    pagination?: {
      page?: number;
      limit?: number;
      total?: number;
    };
  };
  error?: { message?: string };
}

interface AddressSummary {
  id: string;
  label: string;
  name: string;
  street: string;
  cityLine?: string;
  phone?: string;
  isDefault: boolean;
}

interface NormalizedAddress {
  street: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  street2?: string;
  label?: string;
  phone?: string;
  name?: string;
}

// Customer Reviews Section Component
function CustomerReviewsSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const response = (await apiClient.getCustomerReviews(1, 100)) as {
          success?: boolean;
          data?: { reviews?: any[] };
          error?: { message?: string };
        };
        if (response?.success && response.data) {
          setReviews(response.data.reviews || []);
        } else if (response?.error) {
          throw new Error(response.error.message || "Failed to load reviews");
        }
      } catch (error: any) {
        console.error('Error loading reviews:', error);
        const errorMessage = error?.message || error?.error?.message || "Failed to load reviews";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, [toast]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("customerDashboard.myReviews", "My Reviews")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-10 text-center">
            <Star className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium">
              {t("customerDashboard.noReviewsTitle", "No reviews yet")}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {t(
                "customerDashboard.noReviewsDescription",
                "Once you complete purchases, you'll be able to review your products here.",
              )}
            </p>
            <Button onClick={() => navigate("/")}>
              {t("customerDashboard.startShopping", "Start Shopping")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("customerDashboard.myReviews", "My Reviews")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.map((review) => {
            const product = review.product || {};
            const reviewDate = review.created_at
              ? new Date(review.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'Recently';

            return (
              <Card key={review.id} className="border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{product.name || 'Product'}</h4>
                        {(product.id || review.product_id) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/products/${product.id || review.product_id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < (review.rating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-muted-foreground ml-2">{reviewDate}</span>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

const toNumber = (value: unknown): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (typeof value === "bigint") {
    return Number(value);
  }
  return 0;
};

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);

const formatDate = (input?: string | null): string => {
  if (!input) return "—";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return input;
  }
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const formatStatus = (status?: string | null): string => {
  if (!status) return "Unknown";
  return status
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const getStatusColor = (status?: string | null): string => {
  switch ((status ?? "").toLowerCase()) {
    case "delivered":
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "shipped":
    case "out_for_delivery":
    case "in_transit":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "processing":
    case "pending":
    case "confirmed":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "cancelled":
    case "canceled":
    case "refunded":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getTrackingNumber = (
  shipping?: Record<string, any> | null,
): string | null => {
  if (!shipping) return null;
  const tracking =
    shipping.trackingNumber ??
    shipping.tracking_number ??
    shipping.trackingId ??
    shipping.tracking_id ??
    shipping.tracking ??
    null;
  return typeof tracking === "string" ? tracking : null;
};

const transformOrder = (order: ApiOrder): OrderSummary => {
  const products = Array.isArray(order.order_items)
    ? (order.order_items.filter(Boolean) as ApiOrderItem[])
    : [];

  const itemsCount = products.reduce(
    (total, item) => total + toNumber(item?.quantity ?? 0),
    0,
  );

  return {
    id: order.id,
    date: order.created_at ?? "",
    status: order.status ?? "pending",
    total: toNumber(order.total_amount),
    itemsCount,
    tracking: getTrackingNumber(order.shipping_address ?? undefined),
    paymentMethod: order.payment_method ?? null,
    paymentStatus: order.payment_status ?? null,
    shippingAddress: order.shipping_address ?? null,
    products,
  };
};

const normalizeAddressInput = (
  input: unknown,
): NormalizedAddress | null => {
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
    label:
      typeof address.label === "string"
        ? address.label
        : typeof address.type === "string"
          ? address.type
          : undefined,
    phone:
      typeof address.phone === "string"
        ? address.phone
        : typeof address.phoneNumber === "string"
          ? address.phoneNumber
          : typeof address.contactNumber === "string"
            ? address.contactNumber
            : undefined,
    name:
      typeof address.fullName === "string"
        ? address.fullName
        : typeof address.name === "string"
          ? address.name
          : undefined,
  };
};

export default function CustomerDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    addToCart,
    items: cartItems,
    isLoading: cartLoading,
    removeFromCart,
    updateQuantity,
  } = useCart();
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    updateUser,
  } = useAuth();
  const {
    items: wishlistItems,
    isLoading: wishlistLoading,
    isProcessing: wishlistProcessing,
    removeFromWishlist,
    refreshWishlist,
  } = useWishlist();

  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<CustomerProfileData | null>(null);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [ordersPagination, setOrdersPagination] = useState({
    page: 1,
    limit: ORDERS_PAGE_SIZE,
    total: 0,
  });
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [cartProcessingId, setCartProcessingId] = useState<string | null>(null);
  const [wishlistActionProductId, setWishlistActionProductId] = useState<
    string | null
  >(null);
  const [cartActionItemId, setCartActionItemId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderSummary | null>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelReasonDialogOpen, setCancelReasonDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const pageTitle = t("customerDashboard.title", "My Account");
  const pageSubtitle = t(
    "customerDashboard.subtitle",
    "Manage your orders, profile, and preferences",
  );

  const processOrdersResponse = useCallback(
    (response: CustomerOrdersApiResponse) => {
      const apiOrders = response.data?.orders ?? [];
      const transformed = apiOrders.map(transformOrder);

      setOrders(transformed);
      setOrdersPagination({
        page: response.data?.pagination?.page ?? 1,
        limit: response.data?.pagination?.limit ?? ORDERS_PAGE_SIZE,
        total: response.data?.pagination?.total ?? apiOrders.length,
      });

      return transformed;
    },
    [],
  );

  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated || user?.role !== "customer") {
      return;
    }

    setIsLoading(true);
    setOrdersLoading(true);
    setError(null);

    try {
      const [profileResponse, ordersResponse] = await Promise.all([
        apiClient.getCustomerProfile() as Promise<CustomerProfileApiResponse>,
        apiClient.getCustomerOrders(
          1,
          ORDERS_PAGE_SIZE,
        ) as Promise<CustomerOrdersApiResponse>,
      ]);

      if (!profileResponse?.success || !profileResponse.data?.customer) {
        throw new Error(
          profileResponse?.error?.message ??
            t(
              "customerDashboard.errors.profile",
              "Failed to load your profile information.",
            ),
        );
      }

      setProfile(profileResponse.data.customer);
      updateUser(profileResponse.data.customer);

      if (!ordersResponse?.success) {
        throw new Error(
          ordersResponse?.error?.message ??
            t(
              "customerDashboard.errors.orders",
              "Failed to load your recent orders.",
            ),
        );
      }

      processOrdersResponse(ordersResponse);

      try {
        await refreshWishlist();
      } catch {
        /* ignore wishlist refresh errors */
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : t(
              "customerDashboard.errors.generic",
              "An unexpected error occurred.",
            );
      setError(message);
      toast({
        title: t(
          "customerDashboard.errorTitle",
          "Unable to load your dashboard",
        ),
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setOrdersLoading(false);
    }
  }, [
    isAuthenticated,
    user?.role,
    updateUser,
    refreshWishlist,
    toast,
    t,
    processOrdersResponse,
  ]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: t("customerDashboard.authRequiredTitle", "Authentication required"),
        description: t(
          "customerDashboard.authRequiredDescription",
          "Please log in to access your customer dashboard.",
        ),
        variant: "destructive",
      });
      navigate("/customer/login");
      return;
    }

    if (user?.role !== "customer") {
      toast({
        title: t("customerDashboard.roleMismatchTitle", "Switch account"),
        description: t(
          "customerDashboard.roleMismatchDescription",
          "You are signed in with a different role.",
        ),
        variant: "destructive",
      });
      navigate(user?.role === "vendor" ? "/vendor/dashboard" : "/");
      return;
    }

    void fetchDashboardData();
  }, [
    authLoading,
    isAuthenticated,
    user?.role,
    fetchDashboardData,
    navigate,
    toast,
    t,
  ]);

  const loadOrders = useCallback(
    async (page = 1) => {
      if (!isAuthenticated || user?.role !== "customer") {
        return;
      }

      setOrdersLoading(true);

      try {
        const response = (await apiClient.getCustomerOrders(
          page,
          ordersPagination.limit || ORDERS_PAGE_SIZE,
        )) as CustomerOrdersApiResponse;

        if (!response?.success) {
          throw new Error(
            response?.error?.message ??
              t(
                "customerDashboard.errors.orders",
                "Failed to load your recent orders.",
              ),
          );
        }

        processOrdersResponse(response);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : t(
                "customerDashboard.errors.generic",
                "An unexpected error occurred.",
              );
        setError(message);
        toast({
          title: t(
            "customerDashboard.errorTitle",
            "Unable to load your dashboard",
          ),
          description: message,
          variant: "destructive",
        });
      } finally {
        setOrdersLoading(false);
      }
    },
    [
      isAuthenticated,
      user?.role,
      ordersPagination.limit,
      processOrdersResponse,
      toast,
      t,
    ],
  );

  const handleRefreshDashboard = useCallback(() => {
    void fetchDashboardData();
  }, [fetchDashboardData]);

  const handleAddToCart = useCallback(
    async (item: WishlistItem) => {
      try {
        setCartProcessingId(item.productId);
        await addToCart({
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          vendor: item.vendor,
        });
        toast({
          title: t("customerDashboard.cartAddedTitle", "Added to cart"),
          description: t(
            "customerDashboard.cartAddedDescription",
            "We added {{product}} to your cart.",
            { product: item.name },
          ),
        });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : t(
                "customerDashboard.cartErrorDescription",
                "We couldn't add that product to your cart.",
              );
        toast({
          title: t(
            "customerDashboard.cartErrorTitle",
            "Unable to add product to cart",
          ),
          description: message,
          variant: "destructive",
        });
      } finally {
        setCartProcessingId(null);
      }
    },
    [addToCart, toast, t],
  );

  const handleRemoveFromWishlist = useCallback(
    async (item: WishlistItem) => {
      try {
        setWishlistActionProductId(item.productId);
        await removeFromWishlist(item.productId);
        toast({
          title: t("customerDashboard.wishlistRemovedTitle", "Removed from wishlist"),
          description: t(
            "customerDashboard.wishlistRemovedDescription",
            "We removed {{product}} from your wishlist.",
            { product: item.name },
          ),
        });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : t(
                "customerDashboard.wishlistErrorDescription",
                "We couldn't update your wishlist.",
              );
        toast({
          title: t(
            "customerDashboard.wishlistErrorTitle",
            "Unable to update wishlist",
          ),
          description: message,
          variant: "destructive",
        });
      } finally {
        setWishlistActionProductId(null);
      }
    },
    [removeFromWishlist, toast, t],
  );

  const avatarFallback = useMemo(() => {
    const initials = [
      profile?.firstName?.[0],
      profile?.lastName?.[0],
    ]
      .filter(Boolean)
      .join("")
      .toUpperCase();
    return initials || profile?.email?.[0]?.toUpperCase() || "U";
  }, [profile]);

  const userStats = useMemo(() => {
    const totalOrdersCount = Math.max(
      ordersPagination.total ?? 0,
      orders.length,
    );
    const totalSpent = orders.reduce(
      (sum, order) => sum + (Number.isFinite(order.total) ? order.total : 0),
      0,
    );
    return {
      totalOrders: totalOrdersCount,
      totalSpent,
      wishlistItems: wishlistItems.length,
      reviews: 0,
    };
  }, [orders, ordersPagination.total, wishlistItems.length]);

  const recentOrders = useMemo(
    () => orders.slice(0, 3),
    [orders],
  );

  const cancellableStatuses = useMemo(
    () => new Set(['pending', 'confirmed', 'processing', 'payment_pending']),
    [],
  );

  const filteredOrders = useMemo(() => {
    const search = orderSearchTerm.trim().toLowerCase();
    if (!search) {
      return orders;
    }

    return orders.filter((order) => {
      const statusLabel = formatStatus(order.status).toLowerCase();
      const paymentStatusLabel = formatStatus(order.paymentStatus).toLowerCase();
      return (
        order.id.toLowerCase().includes(search) ||
        statusLabel.includes(search) ||
        paymentStatusLabel.includes(search) ||
        (order.tracking ?? "")
          .toString()
          .toLowerCase()
          .includes(search)
      );
    });
  }, [orders, orderSearchTerm]);

  const buildOrderTimeline = useCallback(
    (status: string) => {
      const normalized = (status || "").toLowerCase();
      const canonical = (() => {
        if (normalized === "payment_pending") return "pending";
        if (normalized === "completed") return "delivered";
        if (normalized === "canceled") return "cancelled";
        return normalized;
      })();

      const steps = [
        {
          value: "pending",
          label: t("customerDashboard.timeline.pending", "Pending confirmation"),
          description: t(
            "customerDashboard.timeline.pendingDescription",
            "We received your order and notified the vendor.",
          ),
        },
        {
          value: "confirmed",
          label: t("customerDashboard.timeline.confirmed", "Confirmed by vendor"),
          description: t(
            "customerDashboard.timeline.confirmedDescription",
            "The vendor accepted your order and is preparing it.",
          ),
        },
        {
          value: "processing",
          label: t("customerDashboard.timeline.processing", "Processing"),
          description: t(
            "customerDashboard.timeline.processingDescription",
            "Items are being packed and prepared for shipment.",
          ),
        },
        {
          value: "shipped",
          label: t("customerDashboard.timeline.shipped", "Shipped"),
          description: t(
            "customerDashboard.timeline.shippedDescription",
            "Your package is on the way to the courier.",
          ),
        },
        {
          value: "out_for_delivery",
          label: t("customerDashboard.timeline.outForDelivery", "Out for delivery"),
          description: t(
            "customerDashboard.timeline.outForDeliveryDescription",
            "A courier will contact you before arrival.",
          ),
        },
        {
          value: "delivered",
          label: t("customerDashboard.timeline.delivered", "Delivered"),
          description: t(
            "customerDashboard.timeline.deliveredDescription",
            "Order completed. We hope you enjoy your purchase!",
          ),
        },
        {
          value: "cancelled",
          label: t("customerDashboard.timeline.cancelled", "Cancelled"),
          description: t(
            "customerDashboard.timeline.cancelledDescription",
            "This order was cancelled and will not be delivered.",
          ),
        },
      ];

      const currentIndex = steps.findIndex((step) => step.value === canonical);
      const safeIndex = currentIndex >= 0 ? currentIndex : 0;

      return steps.map((step, index) => ({
        ...step,
        completed:
          canonical === "cancelled"
            ? index < safeIndex
            : index <= safeIndex,
        isCurrent: index === safeIndex,
      }));
    },
    [t],
  );

  const formatShippingAddressBlock = useCallback((address?: Record<string, any> | null) => {
    if (!address || typeof address !== "object") {
      return null;
    }

    const lines = [
      address.fullName ?? address.name ?? null,
      address.street1 ?? address.street ?? address.address ?? null,
      address.street2 ?? null,
      [address.city, address.state, address.postalCode ?? address.zip].filter(Boolean).join(", ") || null,
      address.country ?? null,
      address.phone || address.phoneNumber || address.contactNumber
        ? `Phone: ${address.phone || address.phoneNumber || address.contactNumber}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    return lines || null;
  }, []);

  const formatPaymentMethodLabel = useCallback(
    (method?: string | null) => {
      if (!method) {
        return t("customerDashboard.paymentMethodUnknown", "Not specified");
      }
      const normalized = method.toLowerCase();
      if (normalized === "cod") {
        return t("customerDashboard.paymentMethodCod", "Pay on Delivery");
      }
      if (normalized === "online") {
        return t("customerDashboard.paymentMethodOnline", "Online (Stripe)");
      }
      return method;
    },
    [t],
  );

  const handleOpenOrderDetails = useCallback((order: OrderSummary) => {
    setCancelLoading(false);
    setOrderDetails(order);
    setOrderDetailsOpen(true);
  }, []);

  const handleCloseOrderDetails = useCallback(() => {
    setOrderDetails(null);
    setOrderDetailsOpen(false);
    setCancelLoading(false);
  }, []);

  const handleCancelOrder = useCallback(() => {
    if (!orderDetails) {
      return;
    }

    const status = (orderDetails.status || '').toLowerCase();
    if (!cancellableStatuses.has(status)) {
      toast({
        title: t("customerDashboard.cannotCancelTitle", "Order cannot be cancelled"),
        description: t(
          "customerDashboard.cannotCancelDescription",
          "Only pending, confirmed, or processing orders can be cancelled.",
        ),
        variant: "destructive",
      });
      return;
    }

    setCancelReason("");
    setCancelReasonDialogOpen(true);
  }, [orderDetails, cancellableStatuses, t, toast]);

  const handleConfirmCancel = useCallback(async () => {
    if (!orderDetails || !cancelReason.trim()) {
      toast({
        title: t("customerDashboard.cancelReasonRequired", "Reason required"),
        description: t(
          "customerDashboard.cancelReasonRequiredDescription",
          "Please provide a reason for cancelling this order.",
        ),
        variant: "destructive",
      });
      return;
    }

    try {
      setCancelLoading(true);
      setCancelReasonDialogOpen(false);
      const response = (await apiClient.cancelCustomerOrder(orderDetails.id, cancelReason.trim())) as {
        success?: boolean;
        message?: string;
        error?: { message?: string } | null;
        data?: { order?: ApiOrder } | null;
      };

      if (!response?.success) {
        throw new Error(response?.error?.message || "Unable to cancel order.");
      }

      const updatedOrder = response.data?.order;
      if (updatedOrder) {
        setOrderDetails(transformOrder(updatedOrder));
      }

      await loadOrders(ordersPagination.page);

      toast({
        title: t("customerDashboard.orderCancelled", "Order cancelled"),
        description: t(
          "customerDashboard.orderCancelledDescription",
          "We have cancelled the order and notified the vendor.",
        ),
      });
      setCancelReason("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t("customerDashboard.cancelOrderError", "Unable to cancel order.");
      toast({
        title: t("customerDashboard.cancelOrderErrorTitle", "Cancellation failed"),
        description: message,
        variant: "destructive",
      });
    } finally {
      setCancelLoading(false);
    }
  }, [orderDetails, cancelReason, loadOrders, ordersPagination.page, t, toast]);

  const canCancelCurrentOrder = orderDetails
    ? cancellableStatuses.has((orderDetails.status || '').toLowerCase())
    : false;

  const savedAddresses = useMemo<AddressSummary[]>(() => {
    const addresses: AddressSummary[] = [];
    const seen = new Set<string>();

    const profileAddressData =
      normalizeAddressInput(profile?.address) ??
      normalizeAddressInput(user?.address);

    if (profileAddressData?.street) {
      const profileCityParts = [
        profileAddressData.city,
        profileAddressData.state,
        profileAddressData.postalCode,
        profileAddressData.country,
      ].filter(Boolean);

      const key = `${profileAddressData.street}|${profileCityParts.join(",")}|${
        profileAddressData.phone ?? profile?.phoneNumber ?? user?.phoneNumber ?? ""
      }`.toLowerCase();
      seen.add(key);

      addresses.push({
        id: "profile-address",
        label:
          profileAddressData.label ??
          t("customerDashboard.address.primary", "Primary"),
        name:
          profileAddressData.name ||
          `${profile?.firstName ?? user?.firstName ?? ""} ${
            profile?.lastName ?? user?.lastName ?? ""
          }`.trim() ||
          profile?.email ||
          user?.email ||
          t("customerDashboard.address.recipient", "Recipient"),
        street: profileAddressData.street,
        cityLine: profileCityParts.length ? profileCityParts.join(", ") : undefined,
        phone:
          profileAddressData.phone ??
          profile?.phoneNumber ??
          user?.phoneNumber ??
          undefined,
        isDefault: true,
      });
    }

    orders.forEach((order) => {
      const shipping = order.shippingAddress;
      if (!shipping || typeof shipping !== "object") {
        return;
      }

      const street =
        shipping.address ??
        shipping.addressLine1 ??
        shipping.line1 ??
        shipping.street ??
        shipping.street1 ??
        shipping.streetAddress ??
        "";

      const cityParts = [
        shipping.city,
        shipping.state,
        shipping.postalCode ?? shipping.zip,
        shipping.country,
      ].filter(Boolean);

      const cityLine = cityParts.length ? cityParts.join(", ") : undefined;

      if (!street && !cityLine) {
        return;
      }

      const key = `${street}|${cityLine ?? ""}`.toLowerCase();
      if (seen.has(key)) {
        return;
      }
      seen.add(key);

      addresses.push({
        id: `${order.id}-shipping`,
        label: shipping.label
          ? String(shipping.label)
          : t("customerDashboard.address.saved", "Saved"),
        name:
          shipping.fullName ||
          shipping.name ||
          `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim() ||
          profile?.email ||
          t("customerDashboard.address.recipient", "Recipient"),
        street: street || cityLine || "",
        cityLine,
        phone:
          shipping.phone ||
          shipping.phoneNumber ||
          shipping.contactNumber ||
          undefined,
        isDefault: false,
      });
    });

    return addresses.map((address, index) => ({
      ...address,
      isDefault: index === 0,
    }));
  }, [orders, profile, t, user]);

  const isWishlistEmpty = !wishlistLoading && wishlistItems.length === 0;
  const showOrdersEmptyState = !ordersLoading && filteredOrders.length === 0;
  const isCartEmpty = !cartLoading && cartItems.length === 0;

  const cartSummary = useMemo(() => {
    const totals = cartItems.reduce(
      (acc, item) => {
        const price = Number.isFinite(item.price) ? item.price : 0;
        const quantity = Number.isFinite(item.quantity) ? item.quantity : 0;
        acc.items += quantity;
        acc.total += price * quantity;
        return acc;
      },
      { items: 0, total: 0 },
    );
    return totals;
  }, [cartItems]);

  const handleCartQuantityChange = useCallback(
    async (item: CartEntry, delta: number) => {
      const nextQuantity = item.quantity + delta;
      if (nextQuantity < 1) {
        await removeFromCart(item.id);
        toast({
          title: t("customerDashboard.cartRemovedTitle", "Removed from cart"),
          description: t(
            "customerDashboard.cartRemovedDescription",
            "We removed {{product}} from your cart.",
            { product: item.name },
          ),
        });
        return;
      }

      try {
        setCartActionItemId(item.id);
        await updateQuantity(item.id, nextQuantity);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : t(
                "customerDashboard.cartUpdateError",
                "We couldn't update the quantity right now.",
              );
        toast({
          title: t("customerDashboard.cartErrorTitle", "Cart update failed"),
          description: message,
          variant: "destructive",
        });
      } finally {
        setCartActionItemId(null);
      }
    },
    [removeFromCart, toast, t, updateQuantity],
  );

  const handleRemoveCartItem = useCallback(
    async (item: CartEntry) => {
      try {
        setCartActionItemId(item.id);
        await removeFromCart(item.id);
        toast({
          title: t("customerDashboard.cartRemovedTitle", "Removed from cart"),
          description: t(
            "customerDashboard.cartRemovedDescription",
            "We removed {{product}} from your cart.",
            { product: item.name },
          ),
        });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : t(
                "customerDashboard.cartUpdateError",
                "We couldn't update the quantity right now.",
              );
        toast({
          title: t("customerDashboard.cartErrorTitle", "Cart update failed"),
          description: message,
          variant: "destructive",
        });
      } finally {
        setCartActionItemId(null);
      }
    },
    [removeFromCart, t, toast],
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="self-start text-gray-600 hover:text-gray-900"
              >
                ← {t("customerDashboard.backToStore", "Back to Store")}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pageTitle}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {pageSubtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="mr-2 h-4 w-4" />
                {t("customerDashboard.notifications", "Notifications")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/customer/profile")}
              >
                <Settings className="mr-2 h-4 w-4" />
                {t("customerDashboard.settings", "Settings")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>
              {t("customerDashboard.alertTitle", "Something went wrong")}
            </AlertTitle>
            <AlertDescription className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={handleRefreshDashboard}>
                {t("customerDashboard.tryAgain", "Try again")}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                  <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("customerDashboard.totalOrders", "Total Orders")}
                  </p>
                  {isLoading ? (
                    <Skeleton className="mt-2 h-7 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userStats.totalOrders}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("customerDashboard.totalSpent", "Total Spent")}
                  </p>
                  {isLoading ? (
                    <Skeleton className="mt-2 h-7 w-24" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(userStats.totalSpent)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/20">
                  <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("customerDashboard.wishlist", "Wishlist")}
                  </p>
                  {wishlistLoading && isLoading ? (
                    <Skeleton className="mt-2 h-7 w-12" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userStats.wishlistItems}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/20">
                  <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("customerDashboard.reviews", "Reviews")}
                  </p>
                  {isLoading ? (
                    <Skeleton className="mt-2 h-7 w-12" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userStats.reviews}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="tabs-scroll no-scrollbar grid w-full grid-cols-1 md:grid-cols-6">
            <TabsTrigger value="overview">
              {t("customerDashboard.tabs.overview", "Overview")}
            </TabsTrigger>
            <TabsTrigger value="orders">
              {t("customerDashboard.tabs.orders", "Orders")}
            </TabsTrigger>
            <TabsTrigger value="cart">
              {t("customerDashboard.tabs.cart", "Cart")}
            </TabsTrigger>
            <TabsTrigger value="wishlist">
              {t("customerDashboard.tabs.wishlist", "Wishlist")}
            </TabsTrigger>
            <TabsTrigger value="addresses">
              {t("customerDashboard.tabs.addresses", "Addresses")}
            </TabsTrigger>
            <TabsTrigger value="profile">
              {t("customerDashboard.tabs.profile", "Profile")}
            </TabsTrigger>
            <TabsTrigger value="reviews">
              {t("customerDashboard.tabs.reviews", "Reviews")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>
                    {t("customerDashboard.recentOrders", "Recent Orders")}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("orders")}
                  >
                    {t("customerDashboard.viewAll", "View All")}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ordersLoading && !recentOrders.length ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={`recent-order-skeleton-${index}`}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <div className="space-y-2 text-right">
                            <Skeleton className="ml-auto h-4 w-20" />
                            <Skeleton className="ml-auto h-5 w-24" />
                          </div>
                        </div>
                      ))
                    ) : recentOrders.length ? (
                      recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div>
                            <p className="font-medium">
                              {t("customerDashboard.orderLabel", "Order")}{" "}
                              {order.id}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(order.date)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {t(
                                "customerDashboard.itemsCount",
                                "{{count}} items",
                                { count: order.itemsCount },
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {formatCurrency(order.total)}
                            </p>
                            <Badge className={getStatusColor(order.status)}>
                              {formatStatus(order.status)}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                        {t(
                          "customerDashboard.noRecentOrders",
                          "You haven't placed any orders yet.",
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("customerDashboard.quickActions", "Quick Actions")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="flex h-20 flex-col items-center justify-center"
                      onClick={() => {
                        setActiveTab("orders");
                      }}
                    >
                      <Truck className="mb-2 h-6 w-6" />
                      {t("customerDashboard.trackOrder", "Track Order")}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex h-20 flex-col items-center justify-center"
                      onClick={() => {
                        setActiveTab("wishlist");
                      }}
                    >
                      <Heart className="mb-2 h-6 w-6" />
                      {t("customerDashboard.viewWishlist", "View Wishlist")}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex h-20 flex-col items-center justify-center"
                      onClick={() => navigate("/help")}
                    >
                      <MessageSquare className="mb-2 h-6 w-6" />
                      {t("customerDashboard.contactSupport", "Contact Support")}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex h-20 flex-col items-center justify-center"
                      onClick={() => navigate("/customer/profile")}
                    >
                      <Settings className="mb-2 h-6 w-6" />
                      {t("customerDashboard.accountSettings", "Account Settings")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader className="space-y-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <CardTitle>
                    {t("customerDashboard.orderHistory", "Order History")}
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1 md:max-w-xs">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        value={orderSearchTerm}
                        onChange={(event) => setOrderSearchTerm(event.target.value)}
                        placeholder={t(
                          "customerDashboard.searchOrders",
                          "Search orders…",
                        )}
                        className="pl-10"
                        aria-label={t(
                          "customerDashboard.searchOrders",
                          "Search orders…",
                        )}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadOrders(ordersPagination.page)}
                      disabled={ordersLoading}
                    >
                      {ordersLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      {t("customerDashboard.refresh", "Refresh")}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("customerDashboard.orderId", "Order ID")}</TableHead>
                        <TableHead>{t("customerDashboard.date", "Date")}</TableHead>
                        <TableHead>{t("customerDashboard.status", "Status")}</TableHead>
                        <TableHead>{t("customerDashboard.items", "Items")}</TableHead>
                        <TableHead>{t("customerDashboard.total", "Total")}</TableHead>
                        <TableHead>
                          {t("customerDashboard.tracking", "Tracking")}
                        </TableHead>
                        <TableHead>{t("customerDashboard.actions", "Actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ordersLoading && !orders.length
                        ? Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={`orders-skeleton-${index}`}>
                              <TableCell>
                                <Skeleton className="h-4 w-24" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-20" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-5 w-24" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-16" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-20" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-24" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-8 w-16" />
                              </TableCell>
                            </TableRow>
                          ))
                        : filteredOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">
                                {order.id}
                              </TableCell>
                              <TableCell>{formatDate(order.date)}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(order.status)}>
                                  {formatStatus(order.status)}
                                </Badge>
                              </TableCell>
                              <TableCell>{order.itemsCount}</TableCell>
                              <TableCell>{formatCurrency(order.total)}</TableCell>
                              <TableCell>{order.tracking ?? "—"}</TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenOrderDetails(order)}
                                >
                                  <Eye className="mr-2 h-3.5 w-3.5" />
                                  {t("customerDashboard.viewDetails", "View")}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      {showOrdersEmptyState && (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="h-24 text-center text-sm text-muted-foreground"
                          >
                            {t(
                              "customerDashboard.noOrdersFound",
                              "We couldn't find any orders matching your search.",
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Dialog
              open={orderDetailsOpen}
              onOpenChange={(open) => {
                if (!open) {
                  handleCloseOrderDetails();
                }
              }}
            >
              <DialogContent className="max-w-2xl">
                {orderDetails ? (
                  <div className="space-y-6">
                    <DialogHeader>
                      <DialogTitle>
                        {t("customerDashboard.orderDetailsTitle", "Order {{id}}", {
                          id: orderDetails.id,
                        })}
                      </DialogTitle>
                      <DialogDescription>
                        {t(
                          "customerDashboard.orderPlacedOn",
                          "Placed on {{date}}",
                          {
                            date: formatDate(orderDetails.date),
                          },
                        )}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5">
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                          {t("customerDashboard.orderProgress", "Order progress")}
                        </h3>
                        <div className="mt-3 space-y-3">
                          {buildOrderTimeline(orderDetails.status).map((step) => (
                            <div key={step.value} className="flex items-start gap-3">
                              <div
                                className={`mt-1 ${
                                  step.completed ? "text-primary" : "text-muted-foreground"
                                } ${step.isCurrent ? "scale-110" : ""}`}
                              >
                                {step.completed ? (
                                  <CircleCheck className="h-4 w-4" />
                                ) : (
                                  <Clock3 className="h-4 w-4" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{step.label}</p>
                                <p className="text-xs text-muted-foreground">{step.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border p-4">
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {t("customerDashboard.paymentMethod", "Payment method")}
                          </h4>
                          <p className="mt-2 text-sm font-medium text-foreground">
                            {formatPaymentMethodLabel(orderDetails.paymentMethod)}
                          </p>
                          {orderDetails.paymentStatus && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {t("customerDashboard.paymentStatus", "Payment status")}: {formatStatus(orderDetails.paymentStatus)}
                            </p>
                          )}
                        </div>
                        <div className="rounded-lg border p-4">
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {t("customerDashboard.shippingAddress", "Shipping address")}
                          </h4>
                          <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                            {formatShippingAddressBlock(orderDetails.shippingAddress) ??
                              t(
                                "customerDashboard.noShippingAddress",
                                "Shipping details will appear once provided.",
                              )}
                          </pre>
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {t("customerDashboard.items", "Items")}
                        </h4>
                        <div className="mt-3 space-y-3">
                          {orderDetails.products.length > 0 ? (
                            orderDetails.products.map((item) => {
                              const quantity = toNumber(item.quantity ?? 0);
                              const unitPrice = toNumber(item.price ?? 0);
                              const lineTotal = unitPrice * quantity;
                              return (
                                <div
                                  key={item.id ?? item.product?.id ?? `${orderDetails.id}-${item.product?.name}`}
                                  className="flex items-center justify-between rounded-md border px-3 py-2"
                                >
                                  <div>
                                    <p className="text-sm font-medium">
                                      {item.product?.name ??
                                        t("customerDashboard.unnamedProduct", "Product")}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {t("customerDashboard.quantityLabel", "Quantity")}: {quantity}
                                    </p>
                                  </div>
                                  <p className="text-sm font-semibold">
                                    {formatCurrency(lineTotal)}
                                  </p>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {t(
                                "customerDashboard.noOrderItems",
                                "No line items were returned for this order.",
                              )}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                        <Button variant="outline" onClick={handleCloseOrderDetails}>
                          {t("customerDashboard.close", "Close")}
                        </Button>
                        {canCancelCurrentOrder && (
                          <Button
                            variant="destructive"
                            onClick={handleCancelOrder}
                            disabled={cancelLoading}
                          >
                            {cancelLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t("customerDashboard.cancelOrder", "Cancel order")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    {t("customerDashboard.noOrderSelected", "Select an order to view details.")}
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Cancellation Reason Dialog */}
            <Dialog open={cancelReasonDialogOpen} onOpenChange={setCancelReasonDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {t("customerDashboard.cancelOrderTitle", "Cancel Order")}
                  </DialogTitle>
                  <DialogDescription>
                    {t(
                      "customerDashboard.cancelOrderDescription",
                      "Please provide a reason for cancelling this order. This helps us improve our service.",
                    )}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium">
                      {t("customerDashboard.cancellationReason", "Cancellation Reason")}
                    </label>
                    <Textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder={t(
                        "customerDashboard.cancellationReasonPlaceholder",
                        "e.g., Changed my mind, Found a better price, No longer needed...",
                      )}
                      className="mt-2 min-h-[100px]"
                      maxLength={500}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {cancelReason.length}/500
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCancelReasonDialogOpen(false);
                        setCancelReason("");
                      }}
                    >
                      {t("customerDashboard.cancel", "Cancel")}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleConfirmCancel}
                      disabled={!cancelReason.trim() || cancelLoading}
                    >
                      {cancelLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t("customerDashboard.confirmCancellation", "Confirm Cancellation")}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="cart" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <CardTitle>{t("customerDashboard.cartTitle", "Cart Items")}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {t(
                    "customerDashboard.cartSummary",
                    "{{count}} items · {{total}}",
                    {
                      count: cartSummary.items,
                      total: formatCurrency(cartSummary.total),
                    },
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {cartLoading ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Card key={`cart-skeleton-${index}`}>
                        <CardContent className="space-y-3 p-3">
                          <Skeleton className="aspect-[4/3] w-full rounded-md" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-8 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : isCartEmpty ? (
                  <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    {t(
                      "customerDashboard.emptyCart",
                      "Your cart is empty. Add items to see them here.",
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex h-full flex-col justify-between gap-3 rounded-lg border p-3">
                        <div>
                          <div className="mb-3 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ShoppingCart className="h-10 w-10 text-gray-400" />
                            )}
                          </div>
                          <h3 className="mb-1 line-clamp-2 text-sm font-medium">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500">{item.vendor}</p>
                          <p className="text-sm font-semibold">
                            {formatCurrency(item.price)}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between rounded-lg border px-2 py-2">
                            <span className="text-xs text-muted-foreground">
                              {t("customerDashboard.quantity", "Quantity")}
                            </span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleCartQuantityChange(item, -1)}
                                disabled={cartActionItemId === item.id}
                                aria-label={t(
                                  "customerDashboard.decreaseQuantity",
                                  "Decrease quantity",
                                )}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleCartQuantityChange(item, 1)}
                                disabled={cartActionItemId === item.id}
                                aria-label={t(
                                  "customerDashboard.increaseQuantity",
                                  "Increase quantity",
                                )}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{t("customerDashboard.subtotal", "Subtotal")}</span>
                            <span className="font-medium text-foreground">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveCartItem(item)}
                              disabled={cartActionItemId === item.id}
                            >
                              {cartActionItemId === item.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                              )}
                              {t("customerDashboard.remove", "Remove")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("customerDashboard.myWishlist", "My Wishlist")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {wishlistLoading ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Card key={`wishlist-skeleton-${index}`}>
                        <CardContent className="space-y-3 p-3">
                          <Skeleton className="aspect-[4/3] w-full rounded-md" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <Skeleton className="h-4 w-1/3" />
                          <div className="flex gap-2">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-8" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : isWishlistEmpty ? (
                  <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    {t(
                      "customerDashboard.emptyWishlist",
                      "Your wishlist is empty. Start exploring products to add them here!",
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="flex h-full flex-col justify-between gap-3 rounded-lg border p-3">
                        <div>
                          <div className="mb-3 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package className="h-10 w-10 text-gray-400" />
                            )}
                          </div>
                          <h3 className="mb-1 line-clamp-2 text-sm font-medium">
                            {item.name}
                          </h3>
                          <p className="mb-1 text-xs text-gray-500">{item.vendor}</p>
                          <p className="text-sm font-semibold">
                            {formatCurrency(item.price)}
                          </p>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {t(
                            "customerDashboard.addedOn",
                            "Added {{date}}",
                            { date: formatDate(item.addedAt) },
                          )}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleAddToCart(item)}
                            disabled={
                              cartProcessingId === item.productId ||
                              wishlistProcessing
                            }
                          >
                            {cartProcessingId === item.productId ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            {t(
                              "customerDashboard.addToCart",
                              "Add to Cart",
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveFromWishlist(item)}
                            disabled={
                              wishlistProcessing ||
                              wishlistActionProductId === item.productId
                            }
                          >
                            {wishlistActionProductId === item.productId ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {t("customerDashboard.savedAddresses", "Saved Addresses")}
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => navigate("/customer/profile")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("customerDashboard.addAddress", "Add Address")}
                </Button>
              </CardHeader>
              <CardContent>
                {savedAddresses.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    {t(
                      "customerDashboard.noAddresses",
                      "You haven't saved any addresses yet.",
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {savedAddresses.map((address) => (
                      <div key={address.id} className="rounded-lg border p-6 flex flex-col justify-between gap-4">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <Badge
                              variant={address.isDefault ? "default" : "outline"}
                            >
                              {address.label}
                            </Badge>
                            {address.isDefault && (
                              <Badge variant="secondary">
                                {t("customerDashboard.default", "Default")}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">{address.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {address.street}
                          </p>
                          {address.cityLine && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {address.cityLine}
                            </p>
                          )}
                          {address.phone && (
                            <p className="text-xs text-muted-foreground">
                              {t(
                                "customerDashboard.addressPhone",
                                "Phone: {{phone}}",
                                { phone: address.phone },
                              )}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/customer/profile")}
                          >
                            {t("customerDashboard.editAddress", "Edit")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>
                    {t("customerDashboard.profilePicture", "Profile Picture")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-4 flex justify-center">
                    {isLoading && !profile ? (
                      <Skeleton className="h-24 w-24 rounded-full" />
                    ) : (
                      <Avatar className="h-24 w-24">
                        {profile?.profilePhoto ? (
                          <AvatarImage
                            src={profile.profilePhoto}
                            alt={profile.firstName ?? profile.email}
                          />
                        ) : null}
                        <AvatarFallback>{avatarFallback}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="space-y-2">
                    {profile?.verified && (
                      <Badge variant="secondary">
                        {t("customerDashboard.verified", "Verified")}
                      </Badge>
                    )}
                    <div className="text-sm text-muted-foreground">
                      {t(
                        "customerDashboard.memberSince",
                        "Member since {{date}}",
                        { date: formatDate(profile?.createdAt) },
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/customer/profile")}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {t("customerDashboard.changePhoto", "Change Photo")}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {t("customerDashboard.personalInformation", "Personal Information")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-sm font-medium">
                        {t("customerDashboard.firstName", "First Name")}
                      </p>
                      {isLoading && !profile ? (
                        <Skeleton className="h-10 w-full rounded-md" />
                      ) : (
                        <Input
                          value={profile?.firstName ?? ""}
                          readOnly
                          disabled
                        />
                      )}
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium">
                        {t("customerDashboard.lastName", "Last Name")}
                      </p>
                      {isLoading && !profile ? (
                        <Skeleton className="h-10 w-full rounded-md" />
                      ) : (
                        <Input
                          value={profile?.lastName ?? ""}
                          readOnly
                          disabled
                        />
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-sm font-medium">
                        {t("customerDashboard.email", "Email")}
                      </p>
                      {isLoading && !profile ? (
                        <Skeleton className="h-10 w-full rounded-md" />
                      ) : (
                        <Input value={profile?.email ?? ""} readOnly disabled />
                      )}
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium">
                        {t("customerDashboard.phone", "Phone")}
                      </p>
                      {isLoading && !profile ? (
                        <Skeleton className="h-10 w-full rounded-md" />
                      ) : (
                        <Input
                          value={profile?.phoneNumber ?? ""}
                          readOnly
                          disabled
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-medium">
                      {t("customerDashboard.address", "Address")}
                    </p>
                    {isLoading && !profile ? (
                      <Skeleton className="h-10 w-full rounded-md" />
                    ) : (
                      <Input
                        value={profile?.address ?? ""}
                        readOnly
                        disabled
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={() => navigate("/customer/profile")}>
                      {t("customerDashboard.manageProfile", "Manage Profile")}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      {t(
                        "customerDashboard.profileHint",
                        "Update your personal details, address, and password.",
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <CustomerReviewsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


