import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiClient } from '../utils/api';
import {
  Store,
  Package,
  DollarSign,
  Users,
  Star,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  Bell,
  BarChart3,
  PieChart,
  LineChart,
  ShoppingCart,
  CreditCard,
  Truck,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  Image as ImageIcon,
  Tag,
  Award,
  Activity,
  Loader2,
  RefreshCw,
  X,
  UploadCloud,
  FileText
} from "lucide-react";
import { calculateIncludedVAT, calculateTotalWithVAT, formatPrice, extractBasePrice } from "@/utils/priceUtils";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { predefinedCategories } from "@/data/categories";
import { Footer } from "@/components/Footer";
import i18n from "@/lib/i18n";


import { categoryLabel, formatDate, formatDateTime, formatMoney, formatPaymentMethod, formatStatus } from "@/lib/format";
interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
}

interface Order {
  id: string;
  orderNumber?: string | null;
  order_number?: string | null;
  customer: string;
  date: string;
  status: string;
  statusLabel: string;
  total: number;
  items: number;
  payment: string;
  paymentStatus?: string | null;
  shippingAddress?: Record<string, any> | null;
  cancellationReason?: string | null;
  orderItems?: Array<{
    id?: string;
    product?: {
      name?: string;
    } | null;
    quantity?: number | string | null;
    price?: number | string | null;
  }>;
}

interface Product {
  id: string;
  name: string;
  image?: string;
  images?: string[];
  price: number;
  sales?: number;
  revenue?: number;
  rating?: number;
  stock: number;
  category?: string;
  status?: string;
  description?: string;
}

interface Vendor {
  businessName: string;
  businessEmail: string;
  approved: boolean;
  verified: boolean;
  profilePhoto?: string;
}

// Vendor Reviews Section Component
function VendorReviewsSection() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewRatingFilter, setReviewRatingFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const response = (await apiClient.getVendorReviews()) as {
          success?: boolean;
          data?: { reviews?: any[] };
        };
        if (response?.success && response.data) {
          setReviews(response.data.reviews || []);
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
        toast({
          title: i18n.t('pages.vendorDashboard.error'),
          description: i18n.t('pages.vendorDashboard.failedToLoadReviews'),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, [toast]);

  const filteredReviews = useMemo(() => {
    const query = reviewSearch.toLowerCase();

    return reviews.filter((review) => {
      const customer = review.customer || {};
      const product = review.product || {};
      const customerName = customer.first_name && customer.last_name
        ? `${customer.first_name} ${customer.last_name}`
        : customer.first_name || customer.email || '';
      const productName = product.name || '';
      const comment = review.review || review.comment || '';

      const matchesSearch =
        !query ||
        customerName.toLowerCase().includes(query) ||
        productName.toLowerCase().includes(query) ||
        comment.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      if (reviewRatingFilter === 'all') return true;

      const rating = Number(review.rating ?? 0);
      const minRating = Number(reviewRatingFilter);

      return Number.isFinite(rating) && rating >= minRating;
    });
  }, [reviews, reviewSearch, reviewRatingFilter]);

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
          <CardTitle>{t('pages.vendorDashboard.productReviews')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-10 text-center">
            <Star className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium">{t('pages.vendorDashboard.noReviewsYet')}</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {t('pages.vendorDashboard.reviewsFromCustomersWillAppearHere')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="space-y-3">
          <div>
            <CardTitle>{t('pages.vendorDashboard.productReviews')}</CardTitle>
            <CardDescription>{t('pages.vendorDashboard.customerReviewsForYourProducts')}</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('pages.vendorDashboard.searchReviewsByProductCustomerOr')}
                value={reviewSearch}
                onChange={(e) => setReviewSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={reviewRatingFilter}
              onValueChange={(value) =>
                setReviewRatingFilter(value as 'all' | '5' | '4' | '3' | '2' | '1')
              }
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder={t('pages.vendorDashboard.filterByRating')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('pages.vendorDashboard.allRatings')}</SelectItem>
                <SelectItem value="5">{t('pages.vendorDashboard.n5AndAbove')}</SelectItem>
                <SelectItem value="4">{t('pages.vendorDashboard.n4AndAbove')}</SelectItem>
                <SelectItem value="3">{t('pages.vendorDashboard.n3AndAbove')}</SelectItem>
                <SelectItem value="2">{t('pages.vendorDashboard.n2AndAbove')}</SelectItem>
                <SelectItem value="1">{t('pages.vendorDashboard.n1AndAbove')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t('pages.vendorDashboard.noReviewsMatchYourSearch')}
            </p>
          ) : filteredReviews.map((review) => {
            const customer = review.customer || {};
            const product = review.product || {};
            // Use product_id from review if product.id is not available
            const productId = product?.id || review.product_id || null;

            // Debug logging
            if (!productId) {
              console.warn('Review missing product ID:', {
                reviewId: review.id,
                productFromJoin: product,
                productIdFromReview: review.product_id,
                fullReview: review,
              });
            }
            const customerName = customer.first_name && customer.last_name
              ? `${customer.first_name} ${customer.last_name}`
              : customer.first_name || customer.email || 'Anonymous';
            const initials = customerName.charAt(0).toUpperCase();
            const reviewDate = review.created_at
              ? formatDate(review.created_at)
              : 'Recently';

            return (
              <Card key={review.id} className="border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{product.name || t('pages.vendorDashboard.product')}</h4>
                        {productId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/products/${productId}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            {customer.profile_photo ? (
                              <img
                                src={customer.profile_photo}
                                alt={customerName}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-xs font-medium text-primary">
                                {initials}
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-medium">{customerName}</span>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < (review.rating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{reviewDate}</span>
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

export default function VendorDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const validTabs = new Set(["overview", "products", "orders", "reviews", "settings"]);
  const initialTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    initialTab && validTabs.has(initialTab) ? initialTab : "overview",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dashboard data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [vendor, setVendor] = useState<Vendor | null>(null);

  // Products data
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsPage, setProductsPage] = useState(1);
  const [productsTotal, setProductsTotal] = useState(0);
  const [productSearch, setProductSearch] = useState('');
  const [productStatusFilter, setProductStatusFilter] = useState('all');

  // Orders data
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [ordersSearch, setOrdersSearch] = useState('');
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Product form
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: [] as string[],
    status: 'active'
  });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'vendor')) {
      toast({
        title: i18n.t('pages.vendorDashboard.authenticationRequired'),
        description: i18n.t('pages.vendorDashboard.pleaseLogInAsAVendor'),
        variant: "destructive",
      });
      navigate('/vendor/login');
    }
  }, [isAuthenticated, user, authLoading, navigate, toast]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!isAuthenticated || user?.role !== 'vendor') return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await apiClient.getVendorDashboard() as any;

      if (data.success) {
        console.log('Dashboard data received:', data.data);
        setStats(data.data.stats);
        setRecentOrders(data.data.recentOrders);
        setTopProducts(data.data.topProducts);
        setVendor(data.data.vendor);
      } else {
        setError(data.error?.message || i18n.t('pages.vendorDashboard.failedToLoadDashboardData'));
        toast({
          title: i18n.t('pages.vendorDashboard.error'),
          description: data.error?.message || i18n.t('pages.vendorDashboard.failedToLoadDashboardData'),
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(i18n.t('pages.vendorDashboard.networkErrorPleaseTryAgain'));
      toast({
        title: i18n.t('pages.vendorDashboard.error'),
        description: i18n.t('pages.vendorDashboard.networkErrorPleaseTryAgain'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products
  const fetchProducts = async (page = 1, search = '', status = '') => {
    setProductsLoading(true);

    try {
      const data = await apiClient.getVendorProducts(page, 10, status, search) as any;

      if (data.success) {
        setProducts(data.data.products);
        setProductsTotal(data.data.pagination.total);
        setProductsPage(page);
      } else {
        toast({
          title: i18n.t('pages.vendorDashboard.error'),
          description: data.error?.message || i18n.t('pages.vendorDashboard.failedToLoadProducts'),
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Products fetch error:', err);
      toast({
        title: i18n.t('pages.vendorDashboard.error'),
        description: i18n.t('pages.vendorDashboard.networkErrorPleaseTryAgain'),
        variant: "destructive",
      });
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch orders
  const fetchOrders = useCallback(async (page = 1, status = '') => {
    setOrdersLoading(true);

    try {
      const data = await apiClient.getVendorOrders(page, 10, status) as any;

      if (data.success) {
        const apiOrders = data.data?.orders ?? [];
        const mappedOrders: Order[] = apiOrders.map((order: any) => {
          const customerName = order.customer
            ? `${order.customer.first_name ?? ""} ${order.customer.last_name ?? ""}`.trim() ||
            order.customer.email ||
            "Customer"
            : "Customer";
          const totalAmount = Number.parseFloat(order.total_amount ?? 0);
          const statusValue = (order.status ?? "pending").toString().toLowerCase();

          return {
            id: order.id,
            orderNumber: order.order_number ?? null,
            customer: customerName,
            date: order.created_at ?? new Date().toISOString(),
            status: statusValue,
            statusLabel: formatVendorStatusLabel(statusValue),
            total: Number.isFinite(totalAmount) ? Number(totalAmount.toFixed(2)) : 0,
            items: Array.isArray(order.order_items) ? order.order_items.length : 0,
            payment: order.payment_method ?? "N/A",
            paymentStatus: order.payment_status ?? null,
            shippingAddress: order.shipping_address ?? null,
            cancellationReason: order.cancellation_reason ?? null,
            orderItems: order.order_items ?? [],
          };
        });

        setOrders(mappedOrders);
        setOrdersTotal(data.data?.pagination?.total ?? mappedOrders.length);
        setOrdersPage(page);
      } else {
        toast({
          title: i18n.t('pages.vendorDashboard.error'),
          description: data.error?.message || i18n.t('pages.vendorDashboard.failedToLoadOrders'),
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Orders fetch error:', err);
      toast({
        title: i18n.t('pages.vendorDashboard.error'),
        description: i18n.t('pages.vendorDashboard.networkErrorPleaseTryAgain'),
        variant: "destructive",
      });
    } finally {
      setOrdersLoading(false);
    }
  }, [toast]);

  const filteredOrders = useMemo(() => {
    if (!ordersSearch) return orders;
    const query = ordersSearch.toLowerCase();
    return orders.filter((order) => {
      return (
        order.id.toLowerCase().includes(query) ||
        (order.orderNumber ?? "").toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.statusLabel.toLowerCase().includes(query)
      );
    });
  }, [orders, ordersSearch]);

  const formatVendorStatusLabel = (status: string) =>
    formatStatus((status || "").toLowerCase() === "completed" ? "delivered" : status);

  const getStatusColor = (status: string) => {
    const value = (status || "").toLowerCase();
    switch (value) {
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "processing":
      case "confirmed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "shipped":
      case "out_for_delivery":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "low stock":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "out of stock":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };


  const formatShippingAddress = (address?: Record<string, any> | null) => {
    if (!address || typeof address !== "object") {
      return null;
    }

    const lines = [
      address.fullName ?? address.name ?? null,
      address.street1 ?? address.street ?? address.address ?? null,
      address.street2 ?? null,
      [address.city, address.state, address.postalCode ?? address.zip]
        .filter(Boolean)
        .join(", ") || null,
      address.country ?? null,
      address.phone || address.phoneNumber || address.contactNumber
        ? `Phone: ${address.phone || address.phoneNumber || address.contactNumber}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    return lines || null;
  };

  const handleOpenOrderDetails = (order: Order) => {
    setOrderDetails(order);
    setShowOrderDialog(true);
  };

  const handleCloseOrderDetails = () => {
    setOrderDetails(null);
    setShowOrderDialog(false);
  };

  // Load data when component mounts or tab changes
  useEffect(() => {
    if (isAuthenticated && user?.role === 'vendor') {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (activeTab === 'products' && isAuthenticated && user?.role === 'vendor') {
      const statusFilter = productStatusFilter === 'all' ? '' : productStatusFilter;
      fetchProducts(1, productSearch, statusFilter);
    }
  }, [activeTab, productSearch, productStatusFilter, isAuthenticated, user]);

  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated && user?.role === 'vendor') {
      const statusFilter = orderStatusFilter === 'all' ? '' : orderStatusFilter;
      fetchOrders(1, statusFilter);
    }
  }, [activeTab, orderStatusFilter, isAuthenticated, user, fetchOrders]);

  // Auto-refresh orders when orders tab is active
  useEffect(() => {
    if (activeTab !== 'orders' || !isAuthenticated || user?.role !== 'vendor') {
      return;
    }

    // Refresh orders every 30 seconds when orders tab is active
    const interval = setInterval(() => {
      const statusFilter = orderStatusFilter === 'all' ? '' : orderStatusFilter;
      fetchOrders(ordersPage, statusFilter);
    }, 30000); // 30 seconds

    // Also refresh when window becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const statusFilter = orderStatusFilter === 'all' ? '' : orderStatusFilter;
        fetchOrders(ordersPage, statusFilter);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeTab, orderStatusFilter, ordersPage, isAuthenticated, user, fetchOrders]);

  // Handle product image upload
  const handleProductImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      setNewImages(prev => [...prev, ...fileList]);

      // Generate previews
      fileList.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setNewImagePreviews(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (imageToRemove: string) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageToRemove)
    }));
  };

  // Product form handlers

  // Product form handlers
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingProduct(true);

    try {
      const payload: any = {
        ...productForm,
      };

      // Process new images
      const processedNewImages: { base64: string; name: string }[] = [];
      if (newImages.length > 0) {
        for (const file of newImages) {
          try {
            const base64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (event) => resolve(event.target?.result as string);
              reader.onerror = () => reject(new Error(i18n.t('pages.vendorDashboard.failedToReadImageFile')));
              reader.readAsDataURL(file);
            });
            processedNewImages.push({ base64, name: file.name });
          } catch (err) {
            console.error('Error processing image:', file.name, err);
          }
        }
      }

      payload.newImages = processedNewImages;

      const data: any = editingProduct
        ? await apiClient.updateVendorProduct(editingProduct.id, payload)
        : await apiClient.createVendorProduct(payload);

      if (!data.success) {
        toast({
          title: i18n.t('pages.vendorDashboard.error'),
          description: data.error?.message || i18n.t('pages.vendorDashboard.failedToSaveProduct'),
          variant: "destructive",
        });
        return;
      }

      toast({
        title: editingProduct ? i18n.t('pages.vendorDashboard.productUpdated') : i18n.t('pages.vendorDashboard.productCreated'),
        description: data.message,
      });

      setShowProductDialog(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        images: [],
        sizes: [],
        colors: [],
        status: 'active'
      });
      setNewImages([]);
      setNewImagePreviews([]);

      // Refresh products list and dashboard statistics
      const statusFilter = productStatusFilter === 'all' ? '' : productStatusFilter;
      fetchProducts(productsPage, productSearch, statusFilter);
      fetchDashboardData(); // Refresh dashboard statistics
    } catch (err) {
      console.error('Product save error:', err);
      toast({
        title: i18n.t('pages.vendorDashboard.error'),
        description: i18n.t('pages.vendorDashboard.networkErrorPleaseTryAgain'),
        variant: "destructive",
      });
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      // Extract base price for the form since stored price is tax-inclusive
      price: extractBasePrice(product.price).toFixed(2),
      stock: product.stock.toString(),
      category: product.category || '',
      images: product.images || (product.image ? [product.image] : []),
      status: product.status || 'active'
    });
    setNewImages([]);
    setNewImagePreviews([]);
    setShowProductDialog(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm(i18n.t('pages.vendorDashboard.areYouSureYouWantTo'))) return;

    try {
      const data = await apiClient.deleteVendorProduct(productId) as any;

      if (data.success) {
        toast({
          title: i18n.t('pages.vendorDashboard.productDeleted'),
          description: data.message,
        });

        // Refresh products list and dashboard statistics
        const statusFilter = productStatusFilter === 'all' ? '' : productStatusFilter;
        fetchProducts(productsPage, productSearch, statusFilter);
        fetchDashboardData(); // Refresh dashboard statistics
      } else {
        toast({
          title: i18n.t('pages.vendorDashboard.error'),
          description: data.error?.message || i18n.t('pages.vendorDashboard.failedToDeleteProduct'),
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Product delete error:', err);
      toast({
        title: i18n.t('pages.vendorDashboard.error'),
        description: i18n.t('pages.vendorDashboard.networkErrorPleaseTryAgain'),
        variant: "destructive",
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      const data = await apiClient.updateVendorOrderStatus(orderId, newStatus) as any;

      if (data.success) {
        toast({
          title: i18n.t('pages.vendorDashboard.orderUpdated'),
          description: data.message,
        });

        // Refresh orders list and dashboard statistics
        const statusFilter = orderStatusFilter === 'all' ? '' : orderStatusFilter;
        fetchOrders(ordersPage, statusFilter);
        fetchDashboardData(); // Refresh dashboard statistics
      } else {
        toast({
          title: i18n.t('pages.vendorDashboard.error'),
          description: data.error?.message || i18n.t('pages.vendorDashboard.failedToUpdateOrder'),
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Order update error:', err);
      toast({
        title: i18n.t('pages.vendorDashboard.error'),
        description: i18n.t('pages.vendorDashboard.networkErrorPleaseTryAgain'),
        variant: "destructive",
      });
    } finally {
      setUpdatingOrderId(null);
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t('pages.vendorDashboard.loadingDashboard')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('pages.vendorDashboard.retry')}
          </Button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'vendor') {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Dashboard Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                {t('pages.vendorDashboard.backToStore')}
              </Button>
              <div className="flex items-center space-x-3">
                {vendor?.profilePhoto || user?.profilePhoto ? (
                  <img
                    src={vendor?.profilePhoto || user?.profilePhoto}
                    alt={t('pages.vendorDashboard.profile')}
                    className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-full flex items-center justify-center">
                    <Store className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('pages.vendorDashboard.vendorDashboard')}</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('pages.vendorDashboard.welcomeBack')} {vendor?.businessName || user?.businessName || t('pages.vendorDashboard.vendor')}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/vendor/profile')}>
                <Settings className="h-4 w-4 mr-2" />
                {t('pages.vendorDashboard.profile')}
              </Button>
              <Button variant="outline" size="sm" onClick={fetchDashboardData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('pages.vendorDashboard.refresh')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          {stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('pages.vendorDashboard.totalSales')}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatMoney(stats?.totalSales || 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('pages.vendorDashboard.orders')}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalOrders || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('pages.vendorDashboard.products')}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalProducts || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                      <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('pages.vendorDashboard.customers')}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalCustomers || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="tabs-scroll no-scrollbar sm:grid-cols-5">
              <TabsTrigger value="overview" className="min-w-[140px] sm:min-w-0">{t('pages.vendorDashboard.overview')}</TabsTrigger>
              <TabsTrigger value="products" className="min-w-[140px] sm:min-w-0">{t('pages.vendorDashboard.products')}</TabsTrigger>
              <TabsTrigger value="orders" className="min-w-[140px] sm:min-w-0">{t('pages.vendorDashboard.orders')}</TabsTrigger>
              <TabsTrigger value="reviews" className="min-w-[140px] sm:min-w-0">{t('pages.vendorDashboard.reviews')}</TabsTrigger>
              <TabsTrigger value="settings" className="min-w-[140px] sm:min-w-0">{t('pages.vendorDashboard.settings')}</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {t('pages.vendorDashboard.recentOrders')}
                      <Button variant="outline" size="sm" onClick={() => setActiveTab("orders")}>
                        {t('pages.vendorDashboard.viewAll')}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {!recentOrders || recentOrders.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">{t('pages.vendorDashboard.noRecentOrders')}</p>
                      ) : (
                        recentOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <p className="font-medium">{t('pages.vendorDashboard.orderOrderNumber', { order_number: order.order_number ?? order.orderNumber ?? order.id })}</p>
                              <p className="text-sm text-gray-500">{order.customer}</p>
                              <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">${order.total}</p>
                              <Badge className={getStatusColor(order.status)}>
                                {formatStatus(order.status)}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Products */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {t('pages.vendorDashboard.topProducts')}
                      <Button variant="outline" size="sm" onClick={() => setActiveTab("products")}>
                        {t('pages.vendorDashboard.viewAll')}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {!topProducts || topProducts.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">{t('pages.vendorDashboard.noProductsYet')}</p>
                      ) : (
                        topProducts.map((product) => {
                          // Get product image - support both images array and image single value
                          const productImage = (product.images && product.images.length > 0)
                            ? product.images[0]
                            : product.image || null;

                          return (
                            <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                {productImage ? (
                                  <img
                                    src={productImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                      const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                                      if (fallback) fallback.classList.remove('hidden');
                                    }}
                                  />
                                ) : null}
                                {!productImage && (
                                  <Package className="h-6 w-6 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{product.name || t('pages.vendorDashboard.unnamedProduct')}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                                </p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="flex items-center justify-end">
                                  <Star className={`h-4 w-4 ${product.rating > 0 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                  <span className="text-sm ml-1">
                                    {typeof product.rating === 'number' && product.rating > 0
                                      ? product.rating.toFixed(1)
                                      : '0.0'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('pages.vendorDashboard.quickActions')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      className="h-20 flex-col"
                      onClick={() => {
                        setEditingProduct(null);
                        setProductForm({
                          name: '',
                          description: '',
                          price: '',
                          stock: '',
                          category: '',
                          images: [],
                          sizes: [],
                          colors: [],
                          status: 'active'
                        });
                        setNewImages([]);
                        setNewImagePreviews([]);
                        setShowProductDialog(true);
                      }}
                    >
                      <Plus className="h-6 w-6 mb-2" />
                      {t('pages.vendorDashboard.addProduct')}
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab("orders")}>
                      <BarChart3 className="h-6 w-6 mb-2" />
                      {t('pages.vendorDashboard.viewOrders')}
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab("products")}>
                      <Package className="h-6 w-6 mb-2" />
                      {t('pages.vendorDashboard.manageProducts')}
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/vendor/profile')}>
                      <Settings className="h-6 w-6 mb-2" />
                      {t('pages.vendorDashboard.storeSettings')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {t('pages.vendorDashboard.products')}
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingProduct(null);
                        setProductForm({
                          name: '',
                          description: '',
                          price: '',
                          stock: '',
                          category: '',
                          images: [],
                          sizes: [],
                          colors: [],
                          status: 'active'
                        });
                        setNewImages([]);
                        setNewImagePreviews([]);
                        setShowProductDialog(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('pages.vendorDashboard.addProduct')}
                    </Button>
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder={t('pages.vendorDashboard.searchProducts')}
                        className="pl-10"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                      />
                    </div>
                    <Select value={productStatusFilter} onValueChange={setProductStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder={t('pages.vendorDashboard.filterByStatus')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('pages.vendorDashboard.allStatus')}</SelectItem>
                        <SelectItem value="active">{t('pages.vendorDashboard.active')}</SelectItem>
                        <SelectItem value="inactive">{t('pages.vendorDashboard.inactive')}</SelectItem>
                        <SelectItem value="draft">{t('pages.vendorDashboard.draft')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {productsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t('pages.vendorDashboard.product')}</TableHead>
                            <TableHead>{t('pages.vendorDashboard.category')}</TableHead>
                            <TableHead>{t('pages.vendorDashboard.price')}</TableHead>
                            <TableHead>{t('pages.vendorDashboard.stock')}</TableHead>
                            <TableHead>{t('pages.vendorDashboard.rating')}</TableHead>
                            <TableHead>{t('pages.vendorDashboard.status')}</TableHead>
                            <TableHead>{t('pages.vendorDashboard.actions')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {!products || products.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                {t('pages.vendorDashboard.noProductsFound')}
                              </TableCell>
                            </TableRow>
                          ) : (
                            products.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center space-x-3">
                                    {(product.images && product.images.length > 0) || product.image ? (
                                      <img
                                        src={product.images?.[0] || product.image || '/marketplace.jpeg'}
                                        alt={product.name}
                                        className="w-10 h-10 rounded-lg object-cover border"
                                        onError={(e) => {
                                          e.currentTarget.src = '/marketplace.jpeg';
                                        }}
                                      />
                                    ) : (
                                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <Package className="h-5 w-5 text-gray-400" />
                                      </div>
                                    )}
                                    <span>{product.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{categoryLabel(product.category)}</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Star className={`h-4 w-4 mr-1 ${product.rating > 0 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                    <span className="text-sm">
                                      {typeof product.rating === 'number' && product.rating > 0
                                        ? product.rating.toFixed(1)
                                        : '0.0'}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(product.status || 'Active')}>
                                    {product.status || t('pages.vendorDashboard.active')}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteProduct(product.id)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <CardTitle>{t('pages.vendorDashboard.orderManagement')}</CardTitle>
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const statusFilter = orderStatusFilter === 'all' ? '' : orderStatusFilter;
                            fetchOrders(ordersPage, statusFilter);
                          }}
                          disabled={ordersLoading}
                        >
                          {ordersLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                          <span className="ml-2">{t('pages.vendorDashboard.refresh')}</span>
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={t('pages.vendorDashboard.searchOrdersByIdCustomerOr')}
                          value={ordersSearch}
                          onChange={(e) => setOrdersSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                        <SelectTrigger className="w-full sm:w-40">
                          <SelectValue placeholder={t('pages.vendorDashboard.filterByStatus')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('pages.vendorDashboard.allStatus')}</SelectItem>
                          <SelectItem value="pending">{t('pages.vendorDashboard.pending')}</SelectItem>
                          <SelectItem value="processing">{t('pages.vendorDashboard.processing')}</SelectItem>
                          <SelectItem value="shipped">{t('pages.vendorDashboard.shipped')}</SelectItem>
                          <SelectItem value="out_for_delivery">{t('pages.vendorDashboard.outForDelivery')}</SelectItem>
                          <SelectItem value="delivered">{t('pages.vendorDashboard.delivered')}</SelectItem>
                          <SelectItem value="cancelled">{t('pages.vendorDashboard.cancelled')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t('pages.vendorDashboard.orderId')}</TableHead>
                            <TableHead>{t('pages.vendorDashboard.customer')}</TableHead>
                            <TableHead>{t('pages.vendorDashboard.date')}</TableHead>
                            <TableHead>{t('pages.vendorDashboard.status')}</TableHead>
                            <TableHead>{t('pages.vendorDashboard.items')}</TableHead>
                            <TableHead>{t('pages.vendorDashboard.total')}</TableHead>
                            <TableHead>{t('pages.vendorDashboard.paymentStatus')}</TableHead>
                            <TableHead>{t('pages.vendorDashboard.actions')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {!filteredOrders || filteredOrders.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                {t('pages.vendorDashboard.noOrdersFound')}
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredOrders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.orderNumber ?? order.id}</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>{formatDate(order.date)}</TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(order.status)}>
                                    {formatVendorStatusLabel(order.status)}
                                  </Badge>
                                </TableCell>
                                <TableCell>{order.items}</TableCell>
                                <TableCell>{formatMoney(order.total)}</TableCell>
                                <TableCell>{order.paymentStatus ? formatStatus(order.paymentStatus) : "—"}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Select
                                      value={order.status}
                                      onValueChange={(value) => {
                                        if (updatingOrderId === order.id) return;
                                        handleUpdateOrderStatus(order.id, value);
                                      }}
                                      disabled={order.status.toLowerCase() === 'cancelled' || updatingOrderId === order.id}
                                    >
                                      <SelectTrigger className="w-32" disabled={order.status.toLowerCase() === 'cancelled' || updatingOrderId === order.id}>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">{t('pages.vendorDashboard.pending')}</SelectItem>
                                        <SelectItem value="confirmed">{t('pages.vendorDashboard.confirmed')}</SelectItem>
                                        <SelectItem value="processing">{t('pages.vendorDashboard.processing')}</SelectItem>
                                        <SelectItem value="shipped">{t('pages.vendorDashboard.shipped')}</SelectItem>
                                        <SelectItem value="out_for_delivery">{t('pages.vendorDashboard.outForDelivery')}</SelectItem>
                                        <SelectItem value="delivered">{t('pages.vendorDashboard.delivered')}</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    {updatingOrderId === order.id && (
                                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleOpenOrderDetails(order)}
                                      disabled={updatingOrderId === order.id}
                                    >
                                      <Eye className="mr-1.5 h-4 w-4" />
                                      {t('pages.vendorDashboard.view')}
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Dialog
                open={showOrderDialog}
                onOpenChange={(open) => {
                  if (!open) {
                    handleCloseOrderDetails();
                  }
                }}
              >
                <DialogContent className="max-w-3xl">
                  {orderDetails ? (
                    <div className="space-y-6">
                      <DialogHeader>
                        <DialogTitle>
                          {t('pages.vendorDashboard.orderId2', { id: orderDetails.orderNumber ?? orderDetails.id })}
                        </DialogTitle>
                        <DialogDescription>
                          {formatDateTime(orderDetails.date)}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-5 md:grid-cols-2">
                        <div className="rounded-lg border p-4">
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {t('pages.vendorDashboard.customer')}
                          </h4>
                          <p className="mt-2 text-sm font-medium text-foreground">
                            {orderDetails.customer}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {orderDetails.paymentStatus
                              ? t('pages.vendorDashboard.paymentStatusPaymentstatus', { paymentStatus: formatStatus(orderDetails.paymentStatus) })
                              : t('pages.vendorDashboard.awaitingPaymentConfirmation')}
                          </p>
                        </div>
                        <div className="rounded-lg border p-4">
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {t('pages.vendorDashboard.payment')}
                          </h4>
                          <p className="mt-2 text-sm font-medium text-foreground">
                            {t('pages.vendorDashboard.methodPayment', { payment: formatPaymentMethod(orderDetails.payment) })}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t('pages.vendorDashboard.totalTotal', { total: formatMoney(orderDetails.total) })}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {t('pages.vendorDashboard.shippingAddress')}
                        </h4>
                        <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                          {formatShippingAddress(orderDetails.shippingAddress) ??
                            t('pages.vendorDashboard.noShippingAddressProvidedYet')}
                        </pre>
                      </div>

                      {orderDetails.status.toLowerCase() === 'cancelled' && orderDetails.cancellationReason && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/10">
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-red-800 dark:text-red-400">
                            {t('pages.vendorDashboard.cancellationReason')}
                          </h4>
                          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                            {orderDetails.cancellationReason}
                          </p>
                        </div>
                      )}

                      <div className="rounded-lg border p-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {t('pages.vendorDashboard.items')}
                        </h4>
                        <div className="mt-3 space-y-3">
                          {orderDetails.orderItems && orderDetails.orderItems.length > 0 ? (
                            <>
                              {orderDetails.orderItems.map((item, index) => {
                                const quantity = Number(item.quantity ?? 0);
                                const unitPrice = Number(item.price ?? 0);
                                const lineTotal = unitPrice * quantity;
                                return (
                                  <div
                                    key={item.id ?? `${orderDetails.id}-${index}`}
                                    className="flex items-center justify-between rounded-md border px-3 py-2"
                                  >
                                    <div>
                                      <p className="text-sm font-medium">
                                        {item.product?.name ?? t('pages.vendorDashboard.product')}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {t('pages.vendorDashboard.qty')} {Number.isFinite(quantity) ? quantity : 0}
                                      </p>
                                    </div>
                                    <p className="text-sm font-semibold">
                                      {formatMoney(Number.isFinite(lineTotal) ? lineTotal : 0)}
                                    </p>
                                  </div>
                                );
                              })}
                              <div className="pt-2 space-y-1">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                  <span>{t('pages.vendorDashboard.subtotalExclVat')}</span>
                                  <span>{formatMoney(orderDetails.total - calculateIncludedVAT(orderDetails.total))}</span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                  <span>{t('pages.vendorDashboard.vat16')}</span>
                                  <span>{formatMoney(calculateIncludedVAT(orderDetails.total))}</span>
                                </div>
                                <div className="flex justify-between text-base font-bold border-t pt-1">
                                  <span>{t('pages.vendorDashboard.totalInclVat')}</span>
                                  <span>{formatMoney(orderDetails.total)}</span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {t('pages.vendorDashboard.noLineItemsAvailableForThis')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end pt-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            const address = orderDetails.shippingAddress ?? {};
                            const invoiceData = {
                              orderId: orderDetails.id,
                              orderNumber: orderDetails.orderNumber ?? orderDetails.order_number,
                              createdAt: orderDetails.date,
                              customer: {
                                name: orderDetails.customer,
                                email: (address as Record<string, any>).email ?? "",
                                phone: (address as Record<string, any>).phone ?? (address as Record<string, any>).phoneNumber,
                                address: orderDetails.shippingAddress,
                              },
                              items: (orderDetails.orderItems ?? []).map((item) => {
                                const price = Number(item.price ?? 0);
                                const quantity = Number(item.quantity ?? 0);
                                return {
                                  productName: item.product?.name ?? "",
                                  quantity,
                                  price,
                                  subtotal: price * quantity,
                                };
                              }),
                              totalAmount: orderDetails.total,
                              paymentMethod: orderDetails.payment,
                              status: orderDetails.status,
                            };
                            import("@/utils/invoice").then((mod) => mod.generateInvoicePDF(invoiceData));
                          }}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          {t('pages.vendorDashboard.downloadInvoice', 'Download invoice')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      {t('pages.vendorDashboard.selectAnOrderToViewThe')}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <VendorReviewsSection />
            </TabsContent>


            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('pages.vendorDashboard.storeSettings')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">{t('pages.vendorDashboard.storeSettingsAreManagedInYour')}</p>
                    <Button onClick={() => navigate('/vendor/profile')}>
                      {t('pages.vendorDashboard.goToProfile')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? t('pages.vendorDashboard.editProduct') : t('pages.vendorDashboard.addNewProduct')}</DialogTitle>
            <DialogDescription>
              {editingProduct ? t('pages.vendorDashboard.updateYourProductInformation') : t('pages.vendorDashboard.addANewProductToYour')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t('pages.vendorDashboard.productName')}</Label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">{t('pages.vendorDashboard.category2')}</Label>
                <Select
                  value={productForm.category}
                  onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('pages.vendorDashboard.selectACategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">{t('pages.vendorDashboard.description')}</Label>
              <Textarea
                id="description"
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">{t('pages.vendorDashboard.price2')}</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
                {productForm.price && !isNaN(Number(productForm.price)) && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {t('pages.vendorDashboard.inc16Vat')} <span className="font-medium text-primary">{formatPrice(calculateTotalWithVAT(Number(productForm.price)))}</span>
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="stock">{t('pages.vendorDashboard.stock2')}</Label>
                <Input
                  id="stock"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">{t('pages.vendorDashboard.status')}</Label>
                <Select value={productForm.status} onValueChange={(value) => setProductForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t('pages.vendorDashboard.active')}</SelectItem>
                    <SelectItem value="inactive">{t('pages.vendorDashboard.inactive')}</SelectItem>
                    <SelectItem value="draft">{t('pages.vendorDashboard.draft')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>


            <div>
              <Label htmlFor="product_image">{t('pages.vendorDashboard.productImages')}</Label>
              <div className="space-y-4">
                {/* Image Previews Grid */}
                <div className="grid grid-cols-4 gap-4">
                  {/* Existing Images */}
                  {productForm.images.map((url, index) => (
                    <div key={`existing-${index}`} className="relative group aspect-square">
                      <img
                        src={url}
                        alt={t('pages.vendorDashboard.existingIndex', { index })}
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(url)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {/* New Image Previews */}
                  {newImagePreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="relative group aspect-square">
                      <img
                        src={preview}
                        alt={t('pages.vendorDashboard.newIndex', { index })}
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {/* Upload Button */}
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => document.getElementById('product-image-upload')?.click()}
                  >
                    <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500">{t('pages.vendorDashboard.upload')}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="product-image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleProductImageUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('pages.vendorDashboard.youCanUploadMultipleImagesThe')}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowProductDialog(false)}>
                {t('pages.vendorDashboard.cancel')}
              </Button>
              <Button type="submit" disabled={isCreatingProduct}>
                {isCreatingProduct ? t('pages.vendorDashboard.creating') : editingProduct ? t('pages.vendorDashboard.updateProduct') : t('pages.vendorDashboard.createProduct')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}