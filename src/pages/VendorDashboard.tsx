import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { apiClient } from '../utils/api';
import { 
  Store,
  Package, 
  DollarSign, 
  TrendingUp, 
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
  Target,
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  growth: number;
  conversionRate: number;
}

interface Order {
  id: string;
  customer: string;
  date: string;
  status: string;
  total: number;
  items: number;
  payment: string;
}

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  sales: number;
  revenue: number;
  rating: number;
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
  
  // Product form
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image_url: '',
    status: 'active'
  });

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
      const data = await apiClient.getVendorDashboard();
      
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
      const data = await apiClient.getVendorProducts(page, 10, status, search);
      
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
  const fetchOrders = async (page = 1, status = '') => {
    setOrdersLoading(true);
    
    try {
      const data = await apiClient.getVendorOrders(page, 10, status);
      
      if (data.success) {
        setOrders(data.data.orders);
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
  }, [activeTab, orderStatusFilter, isAuthenticated, user]);

  // Product form handlers
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = editingProduct 
        ? await apiClient.updateVendorProduct(editingProduct.id, productForm)
        : await apiClient.createVendorProduct(productForm);
      
      if (data.success) {
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
          image_url: '',
          status: 'active'
        });
        
        // Refresh products list and dashboard statistics
        const statusFilter = productStatusFilter === 'all' ? '' : productStatusFilter;
        fetchProducts(productsPage, productSearch, statusFilter);
        fetchDashboardData(); // Refresh dashboard statistics
      } else {
        toast({
          title: "Error",
          description: data.error?.message || "Failed to save product",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Product save error:', err);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
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
      image_url: product.image,
      status: product.status || 'active'
    });
    setShowProductDialog(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const data = await apiClient.deleteVendorProduct(productId);
      
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
      const data = await apiClient.updateVendorOrderStatus(orderId, newStatus);
      
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
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Processing": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Shipped": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Active": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Low Stock": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "Out of Stock": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vendor Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Welcome back, {vendor?.businessName || user?.businessName || 'Vendor'}
                </p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
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

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Growth</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">+{stats?.growth || 0}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg">
                      <Target className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Conversion</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.conversionRate || 0}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading...</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
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
                        topProducts.map((product) => (
                          <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.sales} sales</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">${product.revenue.toFixed(2)}</p>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm ml-1">{product.rating}</span>
                              </div>
                            </div>
                          </div>
                        ))
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
                          image_url: '',
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
                          image_url: '',
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
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {!products || products.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                              No products found
                            </TableCell>
                          </TableRow>
                        ) : (
                          products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>${product.price}</TableCell>
                              <TableCell>{product.stock}</TableCell>
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
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                  <div className="flex items-center space-x-4">
                    <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {!orders || orders.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
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
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell>${order.total}</TableCell>
                              <TableCell>
                                <Select 
                                  value={order.status} 
                                  onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Customers Tab */}
            <TabsContent value="customers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Customer management features coming soon</p>
                  </div>
                </CardContent>
              </Card>
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
                <Input
                  id="category"
                  value={productForm.category}
                  onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                  required
                />
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
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={productForm.image_url}
                onChange={(e) => setProductForm(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowProductDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}