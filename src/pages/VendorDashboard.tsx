import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
  RefreshCw
} from "lucide-react";
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

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
}

interface Order {
  id: string;
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
  const { toast } = useToast();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          title: "Error",
          description: "Failed to load reviews",
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
          <CardTitle>Product Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-10 text-center">
            <Star className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium">No reviews yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Reviews from customers will appear here once they review your products.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Reviews</CardTitle>
        <CardDescription>Customer reviews for your products</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.map((review) => {
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
                              className={`h-3 w-3 ${
                                i < (review.rating || 0)
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
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState("overview");
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
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string>('');
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'vendor')) {
      toast({
        title: "Authentication Required",
        description: "Please log in as a vendor to access the dashboard.",
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
        setError(data.error?.message || 'Failed to load dashboard data');
        toast({
          title: "Error",
          description: data.error?.message || "Failed to load dashboard data",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Network error. Please try again.');
      toast({
        title: "Error",
        description: "Network error. Please try again.",
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
          title: "Error",
          description: data.error?.message || "Failed to load products",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Products fetch error:', err);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
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
        setOrdersTotal(data.data.pagination.total);
        setOrdersPage(page);
      } else {
        toast({
          title: "Error",
          description: data.error?.message || "Failed to load orders",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Orders fetch error:', err);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setOrdersLoading(false);
    }
  }, [toast]);

  const formatVendorStatusLabel = (status: string) => {
    const value = (status || "").toLowerCase();
    switch (value) {
      case "pending":
        return "Pending";
      case "confirmed":
        return "Confirmed";
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "out_for_delivery":
        return "Out for Delivery";
      case "delivered":
      case "completed":
        return "Delivered";
      case "cancelled":
      case "canceled":
        return "Cancelled";
      default:
        return status || "Unknown";
    }
  };

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

  const formatMoney = (value: number) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(Number.isFinite(value) ? value : 0);

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
    const file = event.target.files?.[0];
    if (file) {
      setProductImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Product form handlers
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingProduct(true);
    
    try {
      let primaryImageBase64: string | undefined;
      let primaryImageName: string | undefined;

      if (productImage) {
        try {
          primaryImageBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target?.result as string);
            reader.onerror = () => reject(new Error('Failed to read image file'));
            reader.readAsDataURL(productImage);
          });
          primaryImageName = productImage.name;
        } catch (readError) {
          console.error('Product image encoding error:', readError);
          toast({
            title: "Image Error",
            description: "We couldn't process the product image. Please try a different file.",
            variant: "destructive",
          });
          setIsCreatingProduct(false);
          return;
        }
      }

      const payload: any = {
        ...productForm,
      };

      if (primaryImageBase64 && primaryImageName) {
        payload.primaryImage = primaryImageBase64;
        payload.primaryImageName = primaryImageName;
      }

      const data: any = editingProduct
        ? await apiClient.updateVendorProduct(editingProduct.id, payload)
        : await apiClient.createVendorProduct(payload);

      if (!data.success) {
        toast({
          title: "Error",
          description: data.error?.message || "Failed to save product",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: editingProduct ? "Product Updated" : "Product Created",
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
        status: 'active'
      });
      setProductImage(null);
      setProductImagePreview('');
      
      // Refresh products list and dashboard statistics
      const statusFilter = productStatusFilter === 'all' ? '' : productStatusFilter;
      fetchProducts(productsPage, productSearch, statusFilter);
      fetchDashboardData(); // Refresh dashboard statistics
    } catch (err) {
      console.error('Product save error:', err);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
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
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category || '',
      images: product.images || [],
      status: product.status || 'active'
    });
    if (product.images && product.images.length > 0) {
      setProductImagePreview(product.images[0]);
    }
    setShowProductDialog(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const data = await apiClient.deleteVendorProduct(productId) as any;
      
      if (data.success) {
        toast({
          title: "Product Deleted",
          description: data.message,
        });
        
        // Refresh products list and dashboard statistics
        const statusFilter = productStatusFilter === 'all' ? '' : productStatusFilter;
        fetchProducts(productsPage, productSearch, statusFilter);
        fetchDashboardData(); // Refresh dashboard statistics
      } else {
        toast({
          title: "Error",
          description: data.error?.message || "Failed to delete product",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Product delete error:', err);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
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
          title: "Order Updated",
          description: data.message,
        });
        
        // Refresh orders list and dashboard statistics
        const statusFilter = orderStatusFilter === 'all' ? '' : orderStatusFilter;
        fetchOrders(ordersPage, statusFilter);
        fetchDashboardData(); // Refresh dashboard statistics
      } else {
        toast({
          title: "Error",
          description: data.error?.message || "Failed to update order",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Order update error:', err);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
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
          <p className="text-muted-foreground">Loading dashboard...</p>
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
            Retry
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
                ← Back to Store
              </Button>
              <div className="flex items-center space-x-3">
                {vendor?.profilePhoto || user?.profilePhoto ? (
                  <img
                    src={vendor?.profilePhoto || user?.profilePhoto}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-full flex items-center justify-center">
                    <Store className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vendor Dashboard</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Welcome back, {vendor?.businessName || user?.businessName || 'Vendor'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/vendor/profile')}>
                <Settings className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="outline" size="sm" onClick={fetchDashboardData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
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
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sales</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">${(stats?.totalSales || 0).toLocaleString()}</p>
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
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Orders</p>
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
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Products</p>
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
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customers</p>
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
              <TabsTrigger value="overview" className="min-w-[140px] sm:min-w-0">Overview</TabsTrigger>
              <TabsTrigger value="products" className="min-w-[140px] sm:min-w-0">Products</TabsTrigger>
              <TabsTrigger value="orders" className="min-w-[140px] sm:min-w-0">Orders</TabsTrigger>
              <TabsTrigger value="reviews" className="min-w-[140px] sm:min-w-0">Reviews</TabsTrigger>
              <TabsTrigger value="settings" className="min-w-[140px] sm:min-w-0">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Recent Orders
                      <Button variant="outline" size="sm" onClick={() => setActiveTab("orders")}>
                        View All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {!recentOrders || recentOrders.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No recent orders</p>
                      ) : (
                        recentOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <p className="font-medium">Order {order.id}</p>
                              <p className="text-sm text-gray-500">{order.customer}</p>
                              <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">${order.total}</p>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
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
                      Top Products
                      <Button variant="outline" size="sm" onClick={() => setActiveTab("products")}>
                        View All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {!topProducts || topProducts.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No products yet</p>
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
                                <p className="font-medium truncate">{product.name || 'Unnamed Product'}</p>
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
                  <CardTitle>Quick Actions</CardTitle>
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
                          status: 'active'
                        });
                        setShowProductDialog(true);
                      }}
                    >
                      <Plus className="h-6 w-6 mb-2" />
                      Add Product
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab("orders")}>
                      <BarChart3 className="h-6 w-6 mb-2" />
                      View Orders
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab("products")}>
                      <Package className="h-6 w-6 mb-2" />
                      Manage Products
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/vendor/profile')}>
                      <Settings className="h-6 w-6 mb-2" />
                      Store Settings
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
                    Products
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
                          status: 'active'
                        });
                        setShowProductDialog(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="Search products..." 
                        className="pl-10"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                      />
                    </div>
                    <Select value={productStatusFilter} onValueChange={setProductStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
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
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {!products || products.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                No products found
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
                                <TableCell>{product.category}</TableCell>
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
                                    {product.status || 'Active'}
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
                  <div className="flex items-center justify-between">
                    <CardTitle>Order Management</CardTitle>
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
                        <span className="ml-2">Refresh</span>
                      </Button>
                      <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="out_for_delivery">Out for delivery</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
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
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Payment Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {!orders || orders.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                No orders found
                              </TableCell>
                            </TableRow>
                          ) : (
                            orders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(order.status)}>
                                    {formatVendorStatusLabel(order.status)}
                                  </Badge>
                                </TableCell>
                                <TableCell>{order.items}</TableCell>
                                <TableCell>{formatMoney(order.total)}</TableCell>
                                <TableCell>{order.paymentStatus ?? "—"}</TableCell>
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
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="out_for_delivery">Out for delivery</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
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
                                      View
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
                          Order {orderDetails.id}
                        </DialogTitle>
                        <DialogDescription>
                          {new Date(orderDetails.date).toLocaleString()}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-5 md:grid-cols-2">
                        <div className="rounded-lg border p-4">
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Customer
                          </h4>
                          <p className="mt-2 text-sm font-medium text-foreground">
                            {orderDetails.customer}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {orderDetails.paymentStatus
                              ? `Payment status: ${orderDetails.paymentStatus}`
                              : "Awaiting payment confirmation"}
                          </p>
                        </div>
                        <div className="rounded-lg border p-4">
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Payment
                          </h4>
                          <p className="mt-2 text-sm font-medium text-foreground">
                            Method: {orderDetails.payment}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Total: {formatMoney(orderDetails.total)}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Shipping address
                        </h4>
                        <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                          {formatShippingAddress(orderDetails.shippingAddress) ??
                            "No shipping address provided yet."}
                        </pre>
                      </div>

                      {orderDetails.status.toLowerCase() === 'cancelled' && orderDetails.cancellationReason && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/10">
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-red-800 dark:text-red-400">
                            Cancellation Reason
                          </h4>
                          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                            {orderDetails.cancellationReason}
                          </p>
                        </div>
                      )}

                      <div className="rounded-lg border p-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Items
                        </h4>
                        <div className="mt-3 space-y-3">
                          {orderDetails.orderItems && orderDetails.orderItems.length > 0 ? (
                            orderDetails.orderItems.map((item, index) => {
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
                                      {item.product?.name ?? "Product"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Qty: {Number.isFinite(quantity) ? quantity : 0}
                                    </p>
                                  </div>
                                  <p className="text-sm font-semibold">
                                    {formatMoney(Number.isFinite(lineTotal) ? lineTotal : 0)}
                                  </p>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No line items available for this order.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Select an order to view the details.
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
                  <CardTitle>Store Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Store settings are managed in your profile</p>
                    <Button onClick={() => navigate('/vendor/profile')}>
                      Go to Profile
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update your product information' : 'Add a new product to your store'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={productForm.category}
                  onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
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
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={productForm.status} onValueChange={(value) => setProductForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="product_image">Product Image</Label>
              <div className="space-y-2">
                {productImagePreview || (productForm.images && productForm.images.length > 0) ? (
                  <div className="relative w-32 h-32">
                    <img
                      src={productImagePreview || (productForm.images?.[0])}
                      alt="Product preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                ) : null}
                <div className="flex items-center space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => document.getElementById('product-image-upload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {productImagePreview || (productForm.images && productForm.images.length > 0) ? 'Change Image' : 'Upload Image'}
                  </Button>
                  <input
                    id="product-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageUpload}
                    className="hidden"
                  />
                  {productImagePreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setProductImage(null);
                        setProductImagePreview('');
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowProductDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingProduct}>
                {isCreatingProduct ? 'Creating...' : editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}