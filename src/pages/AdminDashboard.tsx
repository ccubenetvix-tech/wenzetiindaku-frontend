import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Shield,
  Users,
  Store,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  RefreshCw,
  Edit,
  Trash2,
  AlertTriangle,
  Mail,
  Phone,
  LayoutDashboard,
  Calendar,
  LogOut,
  Search,
  Filter,
  MapPin,
  Plus,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Truck,
  CreditCard,
  FileText,
  History,
  MessageSquare,
  BarChart2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '../utils/api';
import VendorRevenueModal from '../components/admin/VendorRevenueModal';
import CustomerHistoryModal from '../components/admin/CustomerHistoryModal';
import CustomerReviewsModal from '../components/admin/CustomerReviewsModal';
import i18n from "@/lib/i18n";

import { formatDate, formatDateTime, formatMoney, formatStatus, formatTime } from "@/lib/format";
interface Vendor {
  id: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  business_website?: string;
  business_address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  business_type: string;
  description: string;
  categories: string[];
  verified: boolean;
  approved: boolean;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  profile_photo?: string;
  profilePhoto?: string;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  images: string[];
  stock: number;
  status: string;
  flagged_reason?: string;
  flagged_at?: string;
  created_at: string;
  updated_at: string;
  vendor: {
    id: string;
    business_name: string;
    business_email: string;
    approved: boolean;
    verified: boolean;
  };
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  address?: string;
  gender?: string;
  date_of_birth?: string;
  profile_photo?: string;
  verified: boolean;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface DashboardStats {
  totalVendors: number;
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  totalSales: number;
  pendingVendors: number;
  flaggedProducts: number;
}

interface Order {
  id: string;
  orderId: string;
  orderNumber?: string | null;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  vendor: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentPendingReason?: string | null;
  shippingAddress?: any;
  cancellationReason?: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  itemsCount: number;
  createdAt: string;
  updatedAt: string;
}

const formatDateSafe = (dateString: string | null | undefined, includeTime = false) => {
  if (!dateString) return i18n.t('notAvailable');
  try {
    return includeTime ? formatDateTime(dateString) : formatDate(dateString);
  } catch (error) {
    return i18n.t('notAvailable');
  }
};

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for different tabs
  const [activeTab, setActiveTab] = useState('overview');

  // Dashboard stats
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Vendors state
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [vendorsPage, setVendorsPage] = useState(1);
  const [vendorsSearch, setVendorsSearch] = useState('');
  const [vendorsStatusFilter, setVendorsStatusFilter] = useState('all');

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsPage, setProductsPage] = useState(1);
  const [productsSearch, setProductsSearch] = useState('');
  const [productsStatusFilter, setProductsStatusFilter] = useState('all');
  const [productsVendorFilter, setProductsVendorFilter] = useState('all');

  // Customers state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersPage, setCustomersPage] = useState(1);
  const [customersSearch, setCustomersSearch] = useState('');

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersSearch, setOrdersSearch] = useState('');
  const [ordersStatusFilter, setOrdersStatusFilter] = useState('all');
  const [ordersDateFrom, setOrdersDateFrom] = useState('');
  const [ordersDateTo, setOrdersDateTo] = useState('');
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);

  // Modals state
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isVendorViewModalOpen, setIsVendorViewModalOpen] = useState(false);
  const [isProductViewModalOpen, setIsProductViewModalOpen] = useState(false);
  const [isCustomerViewModalOpen, setIsCustomerViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVendorEditModalOpen, setIsVendorEditModalOpen] = useState(false);
  const [isProductEditModalOpen, setIsProductEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isRedMarkModalOpen, setIsRedMarkModalOpen] = useState(false);
  const [isOrderViewModalOpen, setIsOrderViewModalOpen] = useState(false);
  const [isOrderStatusModalOpen, setIsOrderStatusModalOpen] = useState(false);
  const [isOrderPaymentModalOpen, setIsOrderPaymentModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [redMarkReason, setRedMarkReason] = useState('');
  const [orderStatusNotes, setOrderStatusNotes] = useState('');
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [isVendorActionLoading, setIsVendorActionLoading] = useState(false);
  const [isOrderActionLoading, setIsOrderActionLoading] = useState(false);

  // New Modals State
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [selectedRevenueVendorId, setSelectedRevenueVendorId] = useState<string | null>(null);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedHistoryCustomerId, setSelectedHistoryCustomerId] = useState<string | null>(null);

  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [selectedReviewsCustomerId, setSelectedReviewsCustomerId] = useState<string | null>(null);

  // Form state
  const [vendorForm, setVendorForm] = useState<Partial<Vendor>>({});
  const [productForm, setProductForm] = useState<Partial<Product>>({});

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');

    if (!adminToken || !adminUser) {
      navigate('/admin/login');
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  // Fetch dashboard overview data
  const fetchDashboardData = async () => {
    setIsStatsLoading(true);
    try {
      const response = await apiClient.getAdminDashboard();
      if (response.success) {
        setStats(response.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: i18n.t('pages.adminDashboard.error'),
        description: i18n.t('pages.adminDashboard.failedToFetchDashboardData'),
        variant: "destructive",
      });
    }
    finally {
      setIsStatsLoading(false);
    }
  };

  // Clear Filters
  const handleClearVendorFilters = () => {
    setVendorsSearch('');
    setVendorsStatusFilter('all');
  };

  const handleClearProductFilters = () => {
    setProductsSearch('');
    setProductsStatusFilter('all');
    setProductsVendorFilter('all');
  };

  const handleClearCustomerFilters = () => {
    setCustomersSearch('');
  };

  const handleClearOrderFilters = () => {
    setOrdersSearch('');
    setOrdersStatusFilter('all');
    setOrdersDateFrom('');
    setOrdersDateTo('');
  };

  // Fetch vendors
  const fetchVendors = async () => {
    setVendorsLoading(true);
    try {
      const statusFilter = vendorsStatusFilter === 'all' ? '' : vendorsStatusFilter;
      const response = await apiClient.getVendors(vendorsPage, 'all', statusFilter, vendorsSearch);
      if (response.success) {
        setVendors(response.data.vendors);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: i18n.t('pages.adminDashboard.error'),
        description: i18n.t('pages.adminDashboard.failedToFetchVendors'),
        variant: "destructive",
      });
    } finally {
      setVendorsLoading(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const statusFilter = productsStatusFilter === 'all' ? '' : productsStatusFilter;
      const vendorFilter = productsVendorFilter === 'all' ? '' : productsVendorFilter;
      const response = await apiClient.getAdminProducts(productsPage, 'all', productsSearch, statusFilter, vendorFilter);
      if (response.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: i18n.t('pages.adminDashboard.error'),
        description: i18n.t('pages.adminDashboard.failedToFetchProducts'),
        variant: "destructive",
      });
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch customers
  const fetchCustomers = async () => {
    setCustomersLoading(true);
    try {
      const response = await apiClient.getAdminCustomers(customersPage, 'all', customersSearch);
      if (response.success) {
        setCustomers(response.data.customers);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: i18n.t('pages.adminDashboard.error'),
        description: i18n.t('pages.adminDashboard.failedToFetchCustomers'),
        variant: "destructive",
      });
    } finally {
      setCustomersLoading(false);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const statusFilter = ordersStatusFilter === 'all' ? '' : ordersStatusFilter;
      const response = await apiClient.getAdminOrders(
        ordersPage,
        'all',
        statusFilter,
        ordersSearch,
        ordersDateFrom,
        ordersDateTo
      );
      if (response.success) {
        setOrders(response.data.orders || []);
        setOrdersTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: i18n.t('pages.adminDashboard.error'),
        description: i18n.t('pages.adminDashboard.failedToFetchOrders'),
        variant: "destructive",
      });
    } finally {
      setOrdersLoading(false);
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'vendors') {
      fetchVendors();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'customers') {
      fetchCustomers();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, vendorsPage, vendorsStatusFilter, vendorsSearch, productsPage, productsSearch, productsStatusFilter, productsVendorFilter, customersPage, customersSearch, ordersPage, ordersStatusFilter, ordersSearch, ordersDateFrom, ordersDateTo]);

  // Handle vendor actions
  const handleApproveVendor = async (vendorId: string) => {
    setIsVendorActionLoading(true);
    try {
      const response = await apiClient.approveVendor(vendorId);
      if (response.success) {
        toast({
          title: i18n.t('pages.adminDashboard.success'),
          description: i18n.t('pages.adminDashboard.vendorApprovedSuccessfully'),
        });
        fetchVendors();
        fetchDashboardData();
        setIsApproveModalOpen(false);
      }
    } catch (error) {
      console.error('Error approving vendor:', error);
      toast({
        title: i18n.t('pages.adminDashboard.error'),
        description: i18n.t('pages.adminDashboard.failedToApproveVendor'),
        variant: "destructive",
      });
    } finally {
      setIsVendorActionLoading(false);
    }
  };

  const handleRejectVendor = async (vendorId: string) => {
    setIsVendorActionLoading(true);
    try {
      const response = await apiClient.rejectVendor(vendorId, rejectionReason);
      if (response.success) {
        toast({
          title: i18n.t('pages.adminDashboard.success'),
          description: i18n.t('pages.adminDashboard.vendorRejectedSuccessfully'),
        });
        fetchVendors();
        fetchDashboardData();
        setIsRejectModalOpen(false);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Error rejecting vendor:', error);
      toast({
        title: i18n.t('pages.adminDashboard.error'),
        description: i18n.t('pages.adminDashboard.failedToRejectVendor'),
        variant: "destructive",
      });
    } finally {
      setIsVendorActionLoading(false);
    }
  };

  const handleUpdateVendor = async () => {
    if (!selectedVendor) return;

    try {
      const response = await apiClient.updateVendor(selectedVendor.id, vendorForm);
      if (response.success) {
        toast({
          title: i18n.t('pages.adminDashboard.success'),
          description: i18n.t('pages.adminDashboard.vendorUpdatedSuccessfully'),
        });
        fetchVendors();
        setIsVendorEditModalOpen(false);
        setSelectedVendor(null);
        setVendorForm({});
      }
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast({
        title: i18n.t('pages.adminDashboard.error'),
        description: i18n.t('pages.adminDashboard.failedToUpdateVendor'),
        variant: "destructive",
      });
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    setIsVendorActionLoading(true);
    try {
      const response = await apiClient.deleteVendor(vendorId);
      if (response.success) {
        toast({
          title: i18n.t('pages.adminDashboard.success'),
          description: i18n.t('pages.adminDashboard.vendorDeletedSuccessfully'),
        });
        fetchVendors();
        fetchDashboardData();
        setIsDeleteModalOpen(false);
        setSelectedVendor(null);
      }
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast({
        title: i18n.t('pages.adminDashboard.error'),
        description: i18n.t('pages.adminDashboard.failedToDeleteVendor'),
        variant: "destructive",
      });
    } finally {
      setIsVendorActionLoading(false);
    }
  };

  // Handle product actions
  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    try {
      const response = await apiClient.updateAdminProduct(selectedProduct.id, productForm);
      if (response.success) {
        toast({
          title: i18n.t('pages.adminDashboard.success'),
          description: i18n.t('pages.adminDashboard.productUpdatedSuccessfully'),
        });
        fetchProducts();
        setIsProductEditModalOpen(false);
        setSelectedProduct(null);
        setProductForm({});
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: i18n.t('pages.adminDashboard.error'),
        description: i18n.t('pages.adminDashboard.failedToUpdateProduct'),
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await apiClient.deleteAdminProduct(productId);
      if (response.success) {
        toast({
          title: i18n.t('pages.adminDashboard.success'),
          description: i18n.t('pages.adminDashboard.productDeletedSuccessfully'),
        });
        fetchProducts();
        fetchDashboardData();
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: i18n.t('pages.adminDashboard.error'),
        description: i18n.t('pages.adminDashboard.failedToDeleteProduct'),
        variant: "destructive",
      });
    }
  };

  const handleRedMarkProduct = async (productId: string) => {
    try {
      const response = await apiClient.redMarkProduct(productId, redMarkReason);
      if (response.success) {
        toast({
          title: i18n.t('pages.adminDashboard.success'),
          description: i18n.t('pages.adminDashboard.productRedMarkedSuccessfully'),
        });
        fetchProducts();
        fetchDashboardData();
        setIsRedMarkModalOpen(false);
        setRedMarkReason('');
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error('Error red-marking product:', error);
      toast({
        title: i18n.t('pages.adminDashboard.error'),
        description: i18n.t('pages.adminDashboard.failedToRedMarkProduct'),
        variant: "destructive",
      });
    }
  };

  // Handle customer actions
  const handleDeleteCustomer = async (customerId: string) => {
    try {
      const response = await apiClient.deleteAdminCustomer(customerId);
      if (response.success) {
        toast({
          title: i18n.t('pages.adminDashboard.success'),
          description: i18n.t('pages.adminDashboard.customerDeletedSuccessfully'),
        });
        fetchCustomers();
        fetchDashboardData();
        setIsDeleteModalOpen(false);
        setSelectedCustomer(null);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: i18n.t('pages.adminDashboard.error'),
        description: i18n.t('pages.adminDashboard.failedToDeleteCustomer'),
        variant: "destructive",
      });
    }
  };

  // Handle order actions
  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder || !newOrderStatus) return;

    setIsOrderActionLoading(true);
    try {
      const response = await apiClient.updateAdminOrderStatus(
        selectedOrder.id,
        newOrderStatus,
        orderStatusNotes || undefined
      );
      if (response.success) {
        toast({
          title: i18n.t('pages.adminDashboard.success'),
          description: i18n.t('pages.adminDashboard.orderStatusUpdatedSuccessfully'),
        });
        fetchOrders();
        fetchDashboardData();
        setIsOrderStatusModalOpen(false);
        setSelectedOrder(null);
        setNewOrderStatus('');
        setOrderStatusNotes('');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: i18n.t('pages.adminDashboard.error'),
        description: i18n.t('pages.adminDashboard.failedToUpdateOrderStatus'),
        variant: "destructive",
      });
    } finally {
      setIsOrderActionLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async () => {
    if (!selectedOrder || !newPaymentStatus) return;

    setIsOrderActionLoading(true);
    try {
      const response = await apiClient.updateAdminOrderPaymentStatus(
        selectedOrder.id,
        newPaymentStatus
      );
      if (response.success) {
        toast({
          title: i18n.t('pages.adminDashboard.success'),
          description: i18n.t('pages.adminDashboard.paymentStatusUpdatedSuccessfully'),
        });
        fetchOrders();
        setIsOrderPaymentModalOpen(false);
        setSelectedOrder(null);
        setNewPaymentStatus('');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: i18n.t('pages.adminDashboard.error'),
        description: i18n.t('pages.adminDashboard.failedToUpdatePaymentStatus'),
        variant: "destructive",
      });
    } finally {
      setIsOrderActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      confirmed: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      processing: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
      shipped: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100',
      out_for_delivery: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
      delivered: 'bg-green-100 text-green-800 hover:bg-green-100',
      completed: 'bg-green-100 text-green-800 hover:bg-green-100',
      cancelled: 'bg-red-100 text-red-800 hover:bg-red-100',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  };

  const getPaymentStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-orange-100 text-orange-800',
      partially_refunded: 'bg-orange-100 text-orange-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };


  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      {/* Professional Header */}
      <div className="bg-white dark:bg-navy-900 shadow-sm border-b border-gray-200 dark:border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-navy-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('pages.adminDashboard.adminDashboard')}</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('pages.adminDashboard.wenzeTiiNdakuManagement')}</p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={fetchDashboardData}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">{t('pages.adminDashboard.refresh')}</span>
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t('pages.adminDashboard.logout')}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Professional Tab Navigation - Navy & Orange Balance */}
          <div className="bg-white dark:bg-navy-900 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-navy-800">
            <TabsList className="tabs-scroll no-scrollbar bg-transparent gap-1 sm:grid-cols-5">
              <TabsTrigger
                value="overview"
                className="min-w-[150px] sm:min-w-0 data-[state=active]:bg-gradient-to-r data-[state=active]:from-navy-600 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-md py-2.5 font-medium hover:bg-gradient-to-r hover:from-navy-50 hover:to-orange-50"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                {t('pages.adminDashboard.overview')}
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="min-w-[150px] sm:min-w-0 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-navy-600 data-[state=active]:text-white rounded-md py-2.5 font-medium hover:bg-gradient-to-r hover:from-orange-50 hover:to-navy-50"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {t('pages.adminDashboard.orders')}
              </TabsTrigger>
              <TabsTrigger
                value="vendors"
                className="min-w-[150px] sm:min-w-0 data-[state=active]:bg-gradient-to-r data-[state=active]:from-navy-600 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-md py-2.5 font-medium hover:bg-gradient-to-r hover:from-navy-50 hover:to-orange-50"
              >
                <Store className="h-4 w-4 mr-2" />
                {t('pages.adminDashboard.vendors')}
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="min-w-[150px] sm:min-w-0 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-navy-600 data-[state=active]:text-white rounded-md py-2.5 font-medium hover:bg-gradient-to-r hover:from-orange-50 hover:to-navy-50"
              >
                <Package className="h-4 w-4 mr-2" />
                {t('pages.adminDashboard.products')}
              </TabsTrigger>
              <TabsTrigger
                value="customers"
                className="min-w-[150px] sm:min-w-0 data-[state=active]:bg-gradient-to-r data-[state=active]:from-navy-600 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-md py-2.5 font-medium hover:bg-gradient-to-r hover:from-navy-50 hover:to-orange-50"
              >
                <Users className="h-4 w-4 mr-2" />
                {t('pages.adminDashboard.customers')}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Professional Key Metrics - Navy & Orange Balance */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-navy-50 to-navy-100 dark:from-navy-900/20 dark:to-navy-800/20 border-navy-200 dark:border-navy-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-navy-600 dark:text-navy-400">{t('pages.adminDashboard.totalVendors')}</p>
                      {isStatsLoading ? (
                        <div className="mt-2 space-y-2">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-3 w-28" />
                        </div>
                      ) : (
                        <>
                          <p className="text-3xl font-bold text-navy-900 dark:text-navy-100">{stats?.totalVendors ?? 0}</p>
                          <p className="text-xs text-navy-600 dark:text-navy-400 mt-1">
                            {t('pages.adminDashboard.pendingvendorsPendingApproval', { pendingVendors: stats?.pendingVendors ?? 0 })}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-navy-600 to-orange-500 rounded-lg flex items-center justify-center">
                      <Store className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600 dark:text-orange-400">{t('pages.adminDashboard.totalProducts')}</p>
                      {isStatsLoading ? (
                        <div className="mt-2 space-y-2">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      ) : (
                        <>
                          <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats?.totalProducts ?? 0}</p>
                          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                            {t('pages.adminDashboard.flaggedCount', { count: stats?.flaggedProducts ?? 0 })}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-navy-600 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-navy-50 to-orange-50 dark:from-navy-900/20 dark:to-orange-900/20 border-navy-200 dark:border-orange-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-navy-600 dark:text-navy-400">{t('pages.adminDashboard.totalCustomers')}</p>
                      {isStatsLoading ? (
                        <div className="mt-2 space-y-2">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      ) : (
                        <>
                          <p className="text-3xl font-bold text-navy-900 dark:text-navy-100">{stats?.totalCustomers ?? 0}</p>
                          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                            {t('pages.adminDashboard.activeUsers')}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-navy-600 to-orange-500 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-navy-50 dark:from-orange-900/20 dark:to-navy-900/20 border-orange-200 dark:border-navy-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600 dark:text-orange-400">{t('pages.adminDashboard.totalSales')}</p>
                      {isStatsLoading ? (
                        <div className="mt-2 space-y-2">
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      ) : (
                        <>
                          <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                            {formatMoney(stats?.totalSales ?? 0)}
                          </p>
                          <p className="text-xs text-navy-600 dark:text-navy-400 mt-1">
                            {t('pages.adminDashboard.orderCount', { count: stats?.totalOrders ?? 0 })}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-navy-600 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Professional Quick Actions & System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-navy-600" />
                    {t('pages.adminDashboard.quickActions')}
                  </CardTitle>
                  <CardDescription>{t('pages.adminDashboard.frequentlyUsedAdminActions')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => setActiveTab('vendors')}
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-navy-50 hover:border-navy-300 dark:hover:bg-navy-900/50"
                    >
                      <Store className="h-6 w-6 text-navy-600" />
                      <span className="text-sm font-medium">{t('pages.adminDashboard.manageVendors')}</span>
                    </Button>
                    <Button
                      onClick={() => setActiveTab('products')}
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-navy-50 hover:border-navy-300 dark:hover:bg-navy-900/50"
                    >
                      <Package className="h-6 w-6 text-navy-600" />
                      <span className="text-sm font-medium">{t('pages.adminDashboard.reviewProducts')}</span>
                    </Button>
                    <Button
                      onClick={() => setActiveTab('orders')}
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-navy-50 hover:border-navy-300 dark:hover:bg-navy-900/50"
                    >
                      <ShoppingCart className="h-6 w-6 text-navy-600" />
                      <span className="text-sm font-medium">{t('pages.adminDashboard.manageOrders')}</span>
                    </Button>
                    <Button
                      onClick={() => setActiveTab('customers')}
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-navy-50 hover:border-navy-300 dark:hover:bg-navy-900/50"
                    >
                      <Users className="h-6 w-6 text-navy-600" />
                      <span className="text-sm font-medium">{t('pages.adminDashboard.viewCustomers')}</span>
                    </Button>

                  </div>
                </CardContent>
              </Card>

              {/* System Status & Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-navy-600" />
                    {t('pages.adminDashboard.systemStatus')}
                  </CardTitle>
                  <CardDescription>{t('pages.adminDashboard.platformHealthAndAlerts')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900 dark:text-green-100">{t('pages.adminDashboard.platformStatus')}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t('pages.adminDashboard.online')}</Badge>
                  </div>

                  {isStatsLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : (
                    <>
                      {(stats?.pendingVendors ?? 0) > 0 && (
                        <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <div className="flex items-center space-x-3">
                            <Clock className="h-5 w-5 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">{t('pages.adminDashboard.pendingApprovals')}</span>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{stats?.pendingVendors ?? 0}</Badge>
                        </div>
                      )}

                      {(stats?.flaggedProducts ?? 0) > 0 && (
                        <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <span className="text-sm font-medium text-red-900 dark:text-red-100">{t('pages.adminDashboard.flaggedProducts')}</span>
                          </div>
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{stats?.flaggedProducts ?? 0}</Badge>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-100">{t('pages.adminDashboard.lastUpdated')}</span>
                    </div>
                    {isStatsLoading && !lastUpdated ? (
                      <Skeleton className="h-4 w-24" />
                    ) : (
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        {lastUpdated ? formatTime(lastUpdated) : '—'}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Professional Vendors Tab */}
          <TabsContent value="vendors" className="space-y-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-navy-50 to-orange-50 dark:from-navy-900/20 dark:to-orange-900/20 border-b border-navy-200 dark:border-orange-800">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-navy-600 to-orange-500 rounded-lg flex items-center justify-center">
                      <Store className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-navy-900 dark:text-navy-100">{t('pages.adminDashboard.vendorManagement')}</CardTitle>
                      <CardDescription className="text-orange-600 dark:text-orange-400">
                        {t('pages.adminDashboard.manageVendorAccountsApprovalsAndBusiness')}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-navy-100 text-navy-800">
                      {t('pages.adminDashboard.countVendors', { count: vendors.length })}
                    </Badge>
                    <Button onClick={fetchVendors} variant="outline" size="sm" className="border-orange-300 hover:bg-orange-50">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t('pages.adminDashboard.refresh')}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Professional Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 dark:bg-navy-900/50 rounded-lg border border-gray-200 dark:border-navy-800">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder={t('pages.adminDashboard.searchByBusinessNameEmailOr')}
                      value={vendorsSearch}
                      onChange={(e) => setVendorsSearch(e.target.value)}
                      className="pl-10 bg-white dark:bg-navy-800 border-gray-300 dark:border-navy-700"
                    />
                  </div>
                  <Select value={vendorsStatusFilter} onValueChange={setVendorsStatusFilter}>
                    <SelectTrigger className="w-48 bg-white dark:bg-navy-800 border-gray-300 dark:border-navy-700">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder={t('pages.adminDashboard.filterByStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('pages.adminDashboard.allStatus')}</SelectItem>
                      <SelectItem value="pending">{t('pages.adminDashboard.pendingApproval')}</SelectItem>
                      <SelectItem value="approved">{t('pages.adminDashboard.approved')}</SelectItem>
                      <SelectItem value="rejected">{t('pages.adminDashboard.rejected')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {(vendorsSearch || vendorsStatusFilter !== 'all') && (
                    <Button
                      variant="ghost"
                      onClick={handleClearVendorFilters}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {t('pages.adminDashboard.clearAll')}
                    </Button>
                  )}
                </div>

                {/* Professional Vendor Table */}
                <div className="bg-white dark:bg-navy-900 rounded-lg border border-gray-200 dark:border-navy-800 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-navy-800/50 border-b border-gray-200 dark:border-navy-700">
                          <TableHead className="font-semibold text-gray-900 dark:text-gray-100">{t('pages.adminDashboard.businessDetails')}</TableHead>
                          <TableHead className="font-semibold text-gray-900 dark:text-gray-100">{t('pages.adminDashboard.contact')}</TableHead>
                          <TableHead className="font-semibold text-gray-900 dark:text-gray-100">{t('pages.adminDashboard.status')}</TableHead>
                          <TableHead className="font-semibold text-gray-900 dark:text-gray-100">{t('pages.adminDashboard.registration')}</TableHead>
                          <TableHead className="text-right font-semibold text-gray-900 dark:text-gray-100">{t('pages.adminDashboard.actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vendorsLoading ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-12">
                              <div className="flex flex-col items-center justify-center space-y-3">
                                <div className="w-8 h-8 border-4 border-navy-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-gray-500 dark:text-gray-400">{t('pages.adminDashboard.loadingVendors')}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : vendors.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-12">
                              <div className="flex flex-col items-center justify-center space-y-3">
                                <Store className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                                <div className="text-center">
                                  <p className="text-gray-500 dark:text-gray-400 font-medium">{t('pages.adminDashboard.noVendorsFound')}</p>
                                  <p className="text-sm text-gray-400 dark:text-gray-500">{t('pages.adminDashboard.tryAdjustingYourSearchOrFilter')}</p>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          vendors.map((vendor) => (
                            <TableRow key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-navy-800/30 transition-colors">
                              <TableCell className="py-4">
                                <div className="flex items-center space-x-3">
                                  {vendor.profile_photo ? (
                                    <img
                                      src={vendor.profile_photo}
                                      alt={vendor.business_name}
                                      className="w-10 h-10 rounded-lg object-cover border"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-navy-600 rounded-lg flex items-center justify-center">
                                      <span className="text-sm font-bold text-white">
                                        {vendor.business_name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-gray-100">{vendor.business_name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{vendor.business_type}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{vendor.business_email}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{vendor.business_phone}</div>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex flex-col space-y-1">
                                  <Badge
                                    className={`w-fit ${vendor.approved
                                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                                      : vendor.rejected_at
                                        ? "bg-red-100 text-red-800 hover:bg-red-100"
                                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                      }`}
                                  >
                                    {vendor.approved ? (
                                      <>
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        {t('pages.adminDashboard.approved')}
                                      </>
                                    ) : vendor.rejected_at ? (
                                      <>
                                        <XCircle className="h-3 w-3 mr-1" />
                                        {t('pages.adminDashboard.rejected')}
                                      </>
                                    ) : (
                                      <>
                                        <Clock className="h-3 w-3 mr-1" />
                                        {t('pages.adminDashboard.pending')}
                                      </>
                                    )}
                                  </Badge>
                                  {vendor.verified && (
                                    <Badge variant="secondary" className="w-fit text-xs bg-blue-100 text-blue-800">
                                      {t('pages.adminDashboard.verified')}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="text-sm text-gray-900 dark:text-gray-100">
                                  {formatDate(vendor.created_at)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatTime(vendor.created_at)}
                                </div>
                              </TableCell>
                              <TableCell className="text-right py-4">
                                <div className="flex items-center justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedVendor(vendor);
                                      setSelectedProduct(null);
                                      setSelectedCustomer(null);
                                      setSelectedOrder(null);
                                      setIsVendorViewModalOpen(true);
                                    }}
                                    className="hover:bg-blue-50 hover:border-blue-300"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedVendor(vendor);
                                      setSelectedProduct(null);
                                      setSelectedCustomer(null);
                                      setVendorForm(vendor);
                                      setIsVendorEditModalOpen(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  {!vendor.approved && !vendor.rejected_at && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedVendor(vendor);
                                        setIsApproveModalOpen(true);
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  )}
                                  {!vendor.approved && !vendor.rejected_at && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedVendor(vendor);
                                        setIsRejectModalOpen(true);
                                      }}
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedRevenueVendorId(vendor.id);
                                      setIsRevenueModalOpen(true);
                                    }}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <BarChart2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedVendor(vendor);
                                      setIsDeleteModalOpen(true);
                                    }}
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-orange-50 to-navy-50 dark:from-orange-900/20 dark:to-navy-900/20 border-b border-orange-200 dark:border-navy-800">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-navy-600 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-navy-900 dark:text-navy-100">{t('pages.adminDashboard.orderManagement')}</CardTitle>
                      <CardDescription className="text-orange-600 dark:text-orange-400">
                        {t('pages.adminDashboard.viewManageAndTrackAllMarketplace')}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {t('pages.adminDashboard.countOrders', { count: orders.length })}
                    </Badge>
                    <Button onClick={fetchOrders} variant="outline" size="sm" className="border-orange-300 hover:bg-orange-50">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t('pages.adminDashboard.refresh')}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 dark:bg-navy-900/50 rounded-lg border border-gray-200 dark:border-navy-800">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder={t('pages.adminDashboard.searchByOrderIdCustomerVendor')}
                      value={ordersSearch}
                      onChange={(e) => setOrdersSearch(e.target.value)}
                      className="pl-10 bg-white dark:bg-navy-800 border-gray-300 dark:border-navy-700"
                    />
                  </div>
                  <Select value={ordersStatusFilter} onValueChange={setOrdersStatusFilter}>
                    <SelectTrigger className="w-48 bg-white dark:bg-navy-800 border-gray-300 dark:border-navy-700">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder={t('pages.adminDashboard.filterByStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('pages.adminDashboard.allStatus')}</SelectItem>
                      <SelectItem value="pending">{t('pages.adminDashboard.pending')}</SelectItem>
                      <SelectItem value="confirmed">{t('pages.adminDashboard.confirmed')}</SelectItem>
                      <SelectItem value="processing">{t('pages.adminDashboard.processing')}</SelectItem>
                      <SelectItem value="shipped">{t('pages.adminDashboard.shipped')}</SelectItem>
                      <SelectItem value="out_for_delivery">{t('pages.adminDashboard.outForDelivery')}</SelectItem>
                      <SelectItem value="delivered">{t('pages.adminDashboard.delivered')}</SelectItem>
                      <SelectItem value="completed">{t('pages.adminDashboard.completed')}</SelectItem>
                      <SelectItem value="cancelled">{t('pages.adminDashboard.cancelled')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    placeholder={t('pages.adminDashboard.fromDate')}
                    value={ordersDateFrom}
                    onChange={(e) => setOrdersDateFrom(e.target.value)}
                    className="w-48 bg-white dark:bg-navy-800 border-gray-300 dark:border-navy-700"
                  />
                  <Input
                    type="date"
                    placeholder={t('pages.adminDashboard.toDate')}
                    value={ordersDateTo}
                    onChange={(e) => setOrdersDateTo(e.target.value)}
                    className="w-48 bg-white dark:bg-navy-800 border-gray-300 dark:border-navy-700"
                  />
                  {(ordersSearch || ordersStatusFilter !== 'all' || ordersDateFrom || ordersDateTo) && (
                    <Button
                      variant="ghost"
                      onClick={handleClearOrderFilters}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {t('pages.adminDashboard.clearAll')}
                    </Button>
                  )}
                </div>

                {/* Orders Table */}
                <div className="bg-white dark:bg-navy-900 rounded-lg border border-gray-200 dark:border-navy-800 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-navy-800/50 border-b border-gray-200 dark:border-navy-700">
                          <TableHead className="font-semibold text-gray-900 dark:text-gray-100">{t('pages.adminDashboard.orderId')}</TableHead>
                          <TableHead className="font-semibold text-gray-900 dark:text-gray-100">{t('pages.adminDashboard.customer')}</TableHead>
                          <TableHead className="font-semibold text-gray-900 dark:text-gray-100">{t('pages.adminDashboard.vendor')}</TableHead>
                          <TableHead className="font-semibold text-gray-900 dark:text-gray-100">{t('pages.adminDashboard.items')}</TableHead>
                          <TableHead className="font-semibold text-gray-900 dark:text-gray-100">{t('pages.adminDashboard.total')}</TableHead>
                          <TableHead className="font-semibold text-gray-900 dark:text-gray-100">{t('pages.adminDashboard.status')}</TableHead>
                          <TableHead className="font-semibold text-gray-900 dark:text-gray-100">{t('pages.adminDashboard.payment')}</TableHead>
                          <TableHead className="font-semibold text-gray-900 dark:text-gray-100">{t('pages.adminDashboard.date')}</TableHead>
                          <TableHead className="font-semibold text-gray-900 dark:text-gray-100">{t('pages.adminDashboard.invoice')}</TableHead>
                          <TableHead className="text-right font-semibold text-gray-900 dark:text-gray-100">{t('pages.adminDashboard.actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ordersLoading ? (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center py-12">
                              <div className="flex flex-col items-center justify-center space-y-3">
                                <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-gray-500 dark:text-gray-400">{t('pages.adminDashboard.loadingOrders')}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : orders.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center py-12">
                              <div className="flex flex-col items-center justify-center space-y-3">
                                <ShoppingCart className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                                <div className="text-center">
                                  <p className="text-gray-500 dark:text-gray-400 font-medium">{t('pages.adminDashboard.noOrdersFound')}</p>
                                  <p className="text-sm text-gray-400 dark:text-gray-500">{t('pages.adminDashboard.tryAdjustingYourSearchOrFilter')}</p>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          orders.map((order) => (
                            <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-navy-800/30 transition-colors">
                              <TableCell className="font-medium text-navy-600 dark:text-navy-400">
                                {order.orderNumber ?? `#${order.orderId.substring(0, 8)}`}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-gray-100">{order.customer.name}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{order.customer.email}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-gray-100">{order.vendor.name}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{order.vendor.email}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Package className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm">{t('itemCount', { count: order.itemsCount })}</span>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium text-green-600 dark:text-green-400">
                                {formatMoney(order.totalAmount)}
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(order.status)}>
                                  {formatStatus(order.status)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                                  {formatStatus(order.paymentStatus)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-gray-900 dark:text-gray-100">
                                  {formatDate(order.createdAt)}
                                </div>

                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatTime(order.createdAt)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const invoiceData = {
                                      orderId: order.orderId,
                                      orderNumber: order.orderNumber,
                                      createdAt: order.createdAt,
                                      customer: {
                                        name: order.customer.name,
                                        email: order.customer.email,
                                        phone: order.customer.phone,
                                        address: order.shippingAddress
                                      },
                                      items: order.items.map(item => ({
                                        productName: item.productName,
                                        quantity: item.quantity,
                                        price: item.price,
                                        subtotal: item.subtotal
                                      })),
                                      totalAmount: order.totalAmount,
                                      paymentMethod: order.paymentMethod,
                                      status: order.status
                                    };
                                    import("@/utils/invoice").then(mod => mod.generateInvoicePDF(invoiceData));
                                  }}
                                  title={t('pages.adminDashboard.downloadInvoice')}
                                >
                                  <FileText className="h-4 w-4 text-blue-600" />
                                </Button>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setIsOrderViewModalOpen(true);
                                    }}
                                    className="hover:bg-blue-50 hover:border-blue-300"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setNewOrderStatus(order.status);
                                      setIsOrderStatusModalOpen(true);
                                    }}
                                    className="hover:bg-green-50 hover:border-green-300"
                                  >
                                    <Truck className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setNewPaymentStatus(order.paymentStatus);
                                      setIsOrderPaymentModalOpen(true);
                                    }}
                                    className="hover:bg-purple-50 hover:border-purple-300"
                                  >
                                    <CreditCard className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Pagination */}
                {!ordersLoading && orders.length > 0 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {t('pages.adminDashboard.pageOrderspageOfOrderstotalpages', { ordersPage, ordersTotalPages })}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOrdersPage(prev => Math.max(1, prev - 1))}
                        disabled={ordersPage === 1}
                      >
                        {t('pages.adminDashboard.previous')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOrdersPage(prev => Math.min(ordersTotalPages, prev + 1))}
                        disabled={ordersPage >= ordersTotalPages}
                      >
                        {t('pages.adminDashboard.next')}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-orange-50 to-navy-50 dark:from-orange-900/20 dark:to-navy-900/20 border-b border-orange-200 dark:border-navy-800">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-navy-600 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-navy-900 dark:text-navy-100">{t('pages.adminDashboard.productManagement')}</CardTitle>
                      <CardDescription className="text-orange-600 dark:text-orange-400">
                        {t('pages.adminDashboard.manageAllProductsAcrossVendors')}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-navy-100 text-navy-800">
                      {t('pages.adminDashboard.countProducts', { count: products.length })}
                    </Badge>
                    <Button
                      onClick={fetchProducts}
                      variant="outline"
                      size="sm"
                      className="border-orange-300 hover:bg-orange-50"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t('pages.adminDashboard.refresh')}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex space-x-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder={t('pages.adminDashboard.searchProducts')}
                      value={productsSearch}
                      onChange={(e) => setProductsSearch(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <Select value={productsStatusFilter} onValueChange={setProductsStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder={t('pages.adminDashboard.filterByStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('pages.adminDashboard.allStatus')}</SelectItem>
                      <SelectItem value="active">{t('pages.adminDashboard.active')}</SelectItem>
                      <SelectItem value="inactive">{t('pages.adminDashboard.inactive')}</SelectItem>
                      <SelectItem value="flagged">{t('pages.adminDashboard.flagged')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {(productsSearch || productsStatusFilter !== 'all' || productsVendorFilter !== 'all') && (
                    <Button
                      variant="ghost"
                      onClick={handleClearProductFilters}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {t('pages.adminDashboard.clearAll')}
                    </Button>
                  )}
                </div>

                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('pages.adminDashboard.productName')}</TableHead>
                          <TableHead>{t('pages.adminDashboard.vendor')}</TableHead>
                          <TableHead>{t('pages.adminDashboard.price')}</TableHead>
                          <TableHead>{t('pages.adminDashboard.stock')}</TableHead>
                          <TableHead>{t('pages.adminDashboard.status')}</TableHead>
                          <TableHead className="text-right">{t('pages.adminDashboard.actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {productsLoading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <div className="flex items-center justify-center space-x-2">
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                <span>{t('pages.adminDashboard.loadingProducts')}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : products.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                              {t('pages.adminDashboard.noProductsFound')}
                            </TableCell>
                          </TableRow>
                        ) : (
                          products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-3">
                                  {(product.image || (product.images && product.images.length > 0)) ? (
                                    <img
                                      src={product.image || product.images[0]}
                                      alt={product.name}
                                      className="w-12 h-12 rounded-lg object-cover border"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                      <Package className="h-6 w-6 text-gray-400" />
                                    </div>
                                  )}
                                  <span>{product.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{product.vendor.business_name}</div>
                                  <div className="text-sm text-gray-500">{product.vendor.business_email}</div>
                                </div>
                              </TableCell>
                              <TableCell>${product.price}</TableCell>
                              <TableCell>{product.stock}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={product.status === 'active' ? "default" : product.status === 'flagged' ? "destructive" : "secondary"}
                                >
                                  {formatStatus(product.status)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedProduct(product);
                                      setSelectedVendor(null);
                                      setSelectedCustomer(null);
                                      setSelectedOrder(null);
                                      setIsProductViewModalOpen(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedProduct(product);
                                      setSelectedVendor(null);
                                      setSelectedCustomer(null);
                                      setProductForm(product);
                                      setIsProductEditModalOpen(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  {product.status !== 'flagged' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedProduct(product);
                                        setIsRedMarkModalOpen(true);
                                      }}
                                    >
                                      <AlertTriangle className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedProduct(product);
                                      setIsDeleteModalOpen(true);
                                    }}
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-navy-50 to-orange-50 dark:from-navy-900/20 dark:to-orange-900/20 border-b border-navy-200 dark:border-orange-800">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-navy-600 to-orange-500 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-navy-900 dark:text-navy-100">{t('pages.adminDashboard.customerManagement')}</CardTitle>
                      <CardDescription className="text-navy-600 dark:text-orange-400">
                        {t('pages.adminDashboard.viewAndManageCustomerAccounts')}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-navy-100 text-navy-800">
                      {t('pages.adminDashboard.countCustomers', { count: customers.length })}
                    </Badge>
                    <Button
                      onClick={fetchCustomers}
                      variant="outline"
                      size="sm"
                      className="border-orange-300 hover:bg-orange-50"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t('pages.adminDashboard.refresh')}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex space-x-4 mb-6">
                  <div className="flex-1 flex items-center space-x-4">
                    <Input
                      placeholder={t('pages.adminDashboard.searchCustomers')}
                      value={customersSearch}
                      onChange={(e) => setCustomersSearch(e.target.value)}
                      className="max-w-sm"
                    />
                    {customersSearch && (
                      <Button
                        variant="ghost"
                        onClick={handleClearCustomerFilters}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        {t('pages.adminDashboard.clearAll')}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('pages.adminDashboard.name')}</TableHead>
                          <TableHead>{t('pages.adminDashboard.email')}</TableHead>
                          <TableHead>{t('pages.adminDashboard.phone')}</TableHead>
                          <TableHead>{t('pages.adminDashboard.status')}</TableHead>
                          <TableHead>{t('pages.adminDashboard.created')}</TableHead>
                          <TableHead className="text-right">{t('pages.adminDashboard.actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customersLoading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <div className="flex items-center justify-center space-x-2">
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                <span>{t('pages.adminDashboard.loadingCustomers')}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : customers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                              {t('pages.adminDashboard.noCustomersFound')}
                            </TableCell>
                          </TableRow>
                        ) : (
                          customers.map((customer) => (
                            <TableRow key={customer.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-3">
                                  {customer.profile_photo ? (
                                    <img
                                      src={customer.profile_photo}
                                      alt={`${customer.first_name} ${customer.last_name}`}
                                      className="w-8 h-8 rounded-full object-cover border"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-bold text-white">
                                        {customer.first_name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  )}
                                  <span>{customer.first_name} {customer.last_name}</span>
                                </div>
                              </TableCell>
                              <TableCell>{customer.email}</TableCell>
                              <TableCell>{customer.phone_number || 'N/A'}</TableCell>
                              <TableCell>
                                <Badge variant={customer.verified ? "default" : "secondary"}>
                                  {customer.verified ? t('pages.adminDashboard.verified') : t('pages.adminDashboard.unverified')}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {formatDate(customer.created_at)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedCustomer(customer);
                                      setSelectedVendor(null);
                                      setSelectedProduct(null);
                                      setSelectedOrder(null);
                                      setIsCustomerViewModalOpen(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedHistoryCustomerId(customer.id);
                                      setIsHistoryModalOpen(true);
                                    }}
                                    title={t('pages.adminDashboard.purchaseHistory')}
                                  >
                                    <History className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedReviewsCustomerId(customer.id);
                                      setIsReviewsModalOpen(true);
                                    }}
                                    title={t('pages.adminDashboard.feedbackReviews')}
                                  >
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedCustomer(customer);
                                      setIsDeleteModalOpen(true);
                                    }}
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* View Vendor Modal */}
      <Dialog open={isVendorViewModalOpen} onOpenChange={setIsVendorViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('pages.adminDashboard.vendorDetails')}</DialogTitle>
            <DialogDescription>
              {t('pages.adminDashboard.completeInformationAboutBusinessName', { business_name: selectedVendor?.business_name })}
            </DialogDescription>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-6">
              {/* Profile Photo Section */}
              <div className="flex justify-center mb-6">
                {(selectedVendor.profile_photo || selectedVendor.profilePhoto) ? (
                  <div className="relative">
                    <img
                      src={selectedVendor.profile_photo || selectedVendor.profilePhoto}
                      alt={selectedVendor.business_name}
                      className="w-40 h-40 rounded-lg object-cover border-4 border-gray-200 dark:border-navy-700 shadow-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-40 h-40 rounded-lg bg-gradient-to-br from-orange-100 to-navy-100 dark:from-orange-900/20 dark:to-navy-900/20 border-4 border-gray-200 dark:border-navy-700 shadow-lg flex items-center justify-center">
                      <Store className="h-16 w-16 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                ) : (
                  <div className="w-40 h-40 rounded-lg bg-gradient-to-br from-orange-100 to-navy-100 dark:from-orange-900/20 dark:to-navy-900/20 border-4 border-gray-200 dark:border-navy-700 shadow-lg flex items-center justify-center">
                    <Store className="h-16 w-16 text-orange-600 dark:text-orange-400" />
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Store className="h-5 w-5 mr-2 text-orange-600" />
                  {t('pages.adminDashboard.basicInformation')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.businessName')}</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{selectedVendor.business_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.businessType')}</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{selectedVendor.business_type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.email')}</Label>
                    <div className="flex items-center mt-1">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedVendor.business_email}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.phone')}</Label>
                    <div className="flex items-center mt-1">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedVendor.business_phone}</p>
                    </div>
                  </div>
                  {selectedVendor.business_website && (
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.website')}</Label>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                        <a href={selectedVendor.business_website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {selectedVendor.business_website}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                  {t('pages.adminDashboard.addressInformation')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.streetAddress')}</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{selectedVendor.business_address}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.city')}</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{selectedVendor.city}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.stateProvince')}</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{selectedVendor.state}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.postalCode')}</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{selectedVendor.postal_code}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.country')}</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{selectedVendor.country}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedVendor.description && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">{t('pages.adminDashboard.description')}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-navy-800/50 p-4 rounded-lg">
                    {selectedVendor.description}
                  </p>
                </div>
              )}

              {/* Categories */}
              {selectedVendor.categories && selectedVendor.categories.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">{t('pages.adminDashboard.categories')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVendor.categories.map((category, index) => (
                      <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-orange-600" />
                  {t('pages.adminDashboard.statusVerification')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.approvalStatus')}</Label>
                    <div className="mt-1">
                      <Badge className={
                        selectedVendor.approved
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : selectedVendor.rejected_at
                            ? "bg-red-100 text-red-800 hover:bg-red-100"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      }>
                        {selectedVendor.approved ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1 inline" />
                            {t('pages.adminDashboard.approved')}
                          </>
                        ) : selectedVendor.rejected_at ? (
                          <>
                            <XCircle className="h-3 w-3 mr-1 inline" />
                            {t('pages.adminDashboard.rejected')}
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1 inline" />
                            {t('pages.adminDashboard.pending')}
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.verificationStatus')}</Label>
                    <div className="mt-1">
                      <Badge variant={selectedVendor.verified ? "default" : "secondary"}>
                        {selectedVendor.verified ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1 inline" />
                            {t('pages.adminDashboard.verified')}
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1 inline" />
                            {t('pages.adminDashboard.notVerified')}
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                  {selectedVendor.approved_at && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.approvedDate')}</Label>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                        {formatDateTime(selectedVendor.approved_at)}
                      </p>
                    </div>
                  )}
                  {selectedVendor.rejected_at && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.rejectedDate')}</Label>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                        {formatDateTime(selectedVendor.rejected_at)}
                      </p>
                    </div>
                  )}
                  {selectedVendor.rejection_reason && (
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-red-600">{t('pages.adminDashboard.rejectionReason')}</Label>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        {selectedVendor.rejection_reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                  {t('pages.adminDashboard.accountInformation')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.createdAt')}</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                      {formatDateTime(selectedVendor.created_at)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.lastUpdated')}</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                      {formatDateTime(selectedVendor.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Vendor Modal */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('pages.adminDashboard.approveVendor')}</DialogTitle>
            <DialogDescription>
              {t('pages.adminDashboard.areYouSureYouWantTo', { business_name: selectedVendor?.business_name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveModalOpen(false)}>
              {t('pages.adminDashboard.cancel')}
            </Button>
            <Button
              onClick={() => selectedVendor && handleApproveVendor(selectedVendor.id)}
              disabled={isVendorActionLoading}
            >
              {isVendorActionLoading ? t('pages.adminDashboard.approving') : t('pages.adminDashboard.approveVendor')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Vendor Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('pages.adminDashboard.rejectVendor')}</DialogTitle>
            <DialogDescription>
              {t('pages.adminDashboard.pleaseProvideAReasonForRejecting', { business_name: selectedVendor?.business_name })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection_reason">{t('pages.adminDashboard.rejectionReason')}</Label>
              <Textarea
                id="rejection_reason"
                placeholder={t('pages.adminDashboard.enterReasonForRejection')}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
              {t('pages.adminDashboard.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedVendor && handleRejectVendor(selectedVendor.id)}
              disabled={!rejectionReason.trim() || isVendorActionLoading}
            >
              {isVendorActionLoading ? t('pages.adminDashboard.rejecting') : t('pages.adminDashboard.rejectVendor')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('pages.adminDashboard.confirmDeletion')}</DialogTitle>
            <DialogDescription>
              {selectedVendor && t('pages.adminDashboard.areYouSureYouWantTo2', { business_name: selectedVendor.business_name })}
              {selectedProduct && t('pages.adminDashboard.areYouSureYouWantTo3', { name: selectedProduct.name })}
              {selectedCustomer && t('pages.adminDashboard.areYouSureYouWantTo4', { first_name: selectedCustomer.first_name, last_name: selectedCustomer.last_name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              {t('pages.adminDashboard.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedVendor) {
                  handleDeleteVendor(selectedVendor.id);
                } else if (selectedProduct) {
                  handleDeleteProduct(selectedProduct.id);
                } else if (selectedCustomer) {
                  handleDeleteCustomer(selectedCustomer.id);
                }
              }}
              disabled={isVendorActionLoading}
            >
              {isVendorActionLoading ? t('pages.adminDashboard.deleting') : t('pages.adminDashboard.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Red Mark Product Modal */}
      <Dialog open={isRedMarkModalOpen} onOpenChange={setIsRedMarkModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('pages.adminDashboard.redMarkProduct')}</DialogTitle>
            <DialogDescription>
              {t('pages.adminDashboard.pleaseProvideAReasonForFlagging', { name: selectedProduct?.name })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="red_mark_reason">{t('pages.adminDashboard.reasonForFlagging')}</Label>
              <Textarea
                id="red_mark_reason"
                placeholder={t('pages.adminDashboard.enterReasonForFlaggingThisProduct')}
                value={redMarkReason}
                onChange={(e) => setRedMarkReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRedMarkModalOpen(false)}>
              {t('pages.adminDashboard.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedProduct && handleRedMarkProduct(selectedProduct.id)}
              disabled={!redMarkReason.trim()}
            >
              {t('pages.adminDashboard.redMarkProduct')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vendor Modal */}
      <Dialog open={isVendorEditModalOpen} onOpenChange={setIsVendorEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('pages.adminDashboard.editVendor')}</DialogTitle>
            <DialogDescription>
              {t('pages.adminDashboard.updateVendorInformationForBusinessName', { business_name: selectedVendor?.business_name })}
            </DialogDescription>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business_name">{t('pages.adminDashboard.businessName')}</Label>
                  <Input
                    id="business_name"
                    value={vendorForm.business_name || ''}
                    onChange={(e) => setVendorForm({ ...vendorForm, business_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="business_email">{t('pages.adminDashboard.email')}</Label>
                  <Input
                    id="business_email"
                    type="email"
                    value={vendorForm.business_email || ''}
                    onChange={(e) => setVendorForm({ ...vendorForm, business_email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="business_phone">{t('pages.adminDashboard.phone')}</Label>
                  <Input
                    id="business_phone"
                    value={vendorForm.business_phone || ''}
                    onChange={(e) => setVendorForm({ ...vendorForm, business_phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="business_type">{t('pages.adminDashboard.businessType')}</Label>
                  <Input
                    id="business_type"
                    value={vendorForm.business_type || ''}
                    onChange={(e) => setVendorForm({ ...vendorForm, business_type: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="business_address">{t('pages.adminDashboard.address')}</Label>
                <Textarea
                  id="business_address"
                  value={vendorForm.business_address || ''}
                  onChange={(e) => setVendorForm({ ...vendorForm, business_address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">{t('pages.adminDashboard.description')}</Label>
                <Textarea
                  id="description"
                  value={vendorForm.description || ''}
                  onChange={(e) => setVendorForm({ ...vendorForm, description: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={vendorForm.verified || false}
                    onChange={(e) => setVendorForm({ ...vendorForm, verified: e.target.checked })}
                  />
                  <Label htmlFor="verified">{t('pages.adminDashboard.verified')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="approved"
                    checked={vendorForm.approved || false}
                    onChange={(e) => setVendorForm({ ...vendorForm, approved: e.target.checked })}
                  />
                  <Label htmlFor="approved">{t('pages.adminDashboard.approved')}</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsVendorEditModalOpen(false);
              setSelectedVendor(null);
              setVendorForm({});
            }}>
              {t('pages.adminDashboard.cancel')}
            </Button>
            <Button onClick={handleUpdateVendor}>
              {t('pages.adminDashboard.updateVendor')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isProductEditModalOpen} onOpenChange={setIsProductEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('pages.adminDashboard.editProduct')}</DialogTitle>
            <DialogDescription>
              {t('pages.adminDashboard.updateProductInformationForName', { name: selectedProduct?.name })}
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product_name">{t('pages.adminDashboard.productName')}</Label>
                  <Input
                    id="product_name"
                    value={productForm.name || selectedProduct.name || ''}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="product_price">{t('pages.adminDashboard.price')}</Label>
                  <Input
                    id="product_price"
                    type="number"
                    step="0.01"
                    value={productForm.price || selectedProduct.price || ''}
                    onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="product_category">{t('pages.adminDashboard.category')}</Label>
                  <Input
                    id="product_category"
                    value={productForm.category || selectedProduct.category || ''}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="product_stock">{t('pages.adminDashboard.stock')}</Label>
                  <Input
                    id="product_stock"
                    type="number"
                    value={productForm.stock || selectedProduct.stock || ''}
                    onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="product_status">{t('pages.adminDashboard.status')}</Label>
                  <Select
                    value={productForm.status || selectedProduct.status || 'active'}
                    onValueChange={(value) => setProductForm({ ...productForm, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('pages.adminDashboard.selectStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('pages.adminDashboard.active')}</SelectItem>
                      <SelectItem value="inactive">{t('pages.adminDashboard.inactive')}</SelectItem>
                      <SelectItem value="flagged">{t('pages.adminDashboard.flagged')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="product_description">{t('pages.adminDashboard.description')}</Label>
                <Textarea
                  id="product_description"
                  value={productForm.description || selectedProduct.description || ''}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="product_images">{t('pages.adminDashboard.imagesJsonArray')}</Label>
                <Textarea
                  id="product_images"
                  value={Array.isArray(productForm.images) ? productForm.images.join(', ') : (productForm.images || '')}
                  onChange={(e) => {
                    const images = e.target.value.split(',').map(img => img.trim()).filter(img => img);
                    setProductForm({ ...productForm, images });
                  }}
                  placeholder={t('pages.adminDashboard.enterImageUrlsSeparatedByCommas')}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsProductEditModalOpen(false);
              setSelectedProduct(null);
              setProductForm({});
            }}>
              {t('pages.adminDashboard.cancel')}
            </Button>
            <Button onClick={handleUpdateProduct}>
              {t('pages.adminDashboard.updateProduct')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Product Modal */}
      <Dialog open={isProductViewModalOpen} onOpenChange={setIsProductViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('pages.adminDashboard.productDetails')}</DialogTitle>
            <DialogDescription>
              {t('pages.adminDashboard.completeInformationAboutName', { name: selectedProduct?.name })}
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              {/* Product Image */}
              <div className="flex justify-center">
                {(selectedProduct.image || (selectedProduct.images && selectedProduct.images.length > 0)) ? (
                  <img
                    src={selectedProduct.image || selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className="w-32 h-32 rounded-lg object-cover border"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">{t('pages.adminDashboard.productName')}</Label>
                  <p className="text-sm text-gray-600">{selectedProduct.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">{t('pages.adminDashboard.price')}</Label>
                  <p className="text-sm text-gray-600">${selectedProduct.price}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">{t('pages.adminDashboard.category')}</Label>
                  <p className="text-sm text-gray-600">{selectedProduct.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">{t('pages.adminDashboard.stock')}</Label>
                  <p className="text-sm text-gray-600">{selectedProduct.stock}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">{t('pages.adminDashboard.status')}</Label>
                  <Badge variant={selectedProduct.status === 'active' ? "default" : selectedProduct.status === 'flagged' ? "destructive" : "secondary"}>
                    {formatStatus(selectedProduct.status)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">{t('pages.adminDashboard.vendor')}</Label>
                  <p className="text-sm text-gray-600">{selectedProduct.vendor.business_name}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">{t('pages.adminDashboard.description')}</Label>
                <p className="text-sm text-gray-600">{selectedProduct.description}</p>
              </div>
              {selectedProduct.flagged_reason && (
                <div>
                  <Label className="text-sm font-medium">{t('pages.adminDashboard.flaggedReason')}</Label>
                  <p className="text-sm text-red-600">{selectedProduct.flagged_reason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Customer Modal */}
      <Dialog open={isCustomerViewModalOpen} onOpenChange={setIsCustomerViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('pages.adminDashboard.customerDetails')}</DialogTitle>
            <DialogDescription>
              {t('pages.adminDashboard.completeInformationAboutFirstNameLast', { first_name: selectedCustomer?.first_name, last_name: selectedCustomer?.last_name })}
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Profile Photo Section */}
              <div className="flex justify-center mb-6">
                {selectedCustomer.profile_photo ? (
                  <div className="relative">
                    <img
                      src={selectedCustomer.profile_photo}
                      alt={`${selectedCustomer.first_name} ${selectedCustomer.last_name}`}
                      className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 dark:border-navy-700 shadow-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-40 h-40 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-4 border-gray-200 dark:border-navy-700 shadow-lg flex items-center justify-center">
                      <Users className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-4 border-gray-200 dark:border-navy-700 shadow-lg flex items-center justify-center">
                    <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                      {selectedCustomer.first_name.charAt(0).toUpperCase()}
                      {selectedCustomer.last_name?.charAt(0).toUpperCase() || ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Personal Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  {t('pages.adminDashboard.personalInformation')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.fullName')}</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                      {selectedCustomer.first_name} {selectedCustomer.last_name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.email')}</Label>
                    <div className="flex items-center mt-1">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.phoneNumber')}</Label>
                    <div className="flex items-center mt-1">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {selectedCustomer.phone_number || t('pages.adminDashboard.notProvided')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.gender')}</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                      {selectedCustomer.gender ? selectedCustomer.gender.charAt(0).toUpperCase() + selectedCustomer.gender.slice(1) : t('pages.adminDashboard.notSpecified')}
                    </p>
                  </div>
                  {selectedCustomer.date_of_birth && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.dateOfBirth')}</Label>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatDate(selectedCustomer.date_of_birth)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              {selectedCustomer.address && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    {t('pages.adminDashboard.addressInformation')}
                  </h3>
                  <div className="bg-gray-50 dark:bg-navy-800/50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {selectedCustomer.address}
                    </p>
                  </div>
                </div>
              )}

              {/* Account Status */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-600" />
                  {t('pages.adminDashboard.accountStatus')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.verificationStatus')}</Label>
                    <div className="mt-1">
                      <Badge variant={selectedCustomer.verified ? "default" : "secondary"}>
                        {selectedCustomer.verified ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1 inline" />
                            {t('pages.adminDashboard.verified')}
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1 inline" />
                            {t('pages.adminDashboard.notVerified')}
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.profileCompletion')}</Label>
                    <div className="mt-1">
                      <Badge variant={selectedCustomer.profile_completed ? "default" : "secondary"}>
                        {selectedCustomer.profile_completed ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1 inline" />
                            {t('pages.adminDashboard.completed')}
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1 inline" />
                            {t('pages.adminDashboard.incomplete')}
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  {t('pages.adminDashboard.accountInformation')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.accountCreated')}</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                      {formatDateTime(selectedCustomer.created_at)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.lastUpdated')}</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                      {formatDateTime(selectedCustomer.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Order Modal */}
      <Dialog open={isOrderViewModalOpen} onOpenChange={setIsOrderViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('pages.adminDashboard.orderDetailsValue', { value: selectedOrder?.orderNumber ?? selectedOrder?.orderId.substring(0, 8) })}</DialogTitle>
            <DialogDescription>
              {t('pages.adminDashboard.completeInformationAboutThisOrder')}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.orderId')}</Label>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedOrder.orderId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.orderDate')}</Label>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatDateTime(selectedOrder.createdAt)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.status')}</Label>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {formatStatus(selectedOrder.status)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.paymentStatus')}</Label>
                  <Badge className={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                    {formatStatus(selectedOrder.paymentStatus)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.paymentMethod')}</Label>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.totalAmount')}</Label>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatMoney(selectedOrder.totalAmount)}</p>
                </div>
              </div>

              {/* Customer Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">{t('pages.adminDashboard.customerInformation')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.name')}</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.email')}</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedOrder.customer.email}</p>
                  </div>
                  {selectedOrder.customer.phone && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.phone')}</Label>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedOrder.customer.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Vendor Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">{t('pages.adminDashboard.vendorInformation')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.businessName')}</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedOrder.vendor.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.email')}</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedOrder.vendor.email}</p>
                  </div>
                  {selectedOrder.vendor.phone && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">{t('pages.adminDashboard.phone')}</Label>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedOrder.vendor.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">{t('pages.adminDashboard.orderItems')}</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-navy-800/50 rounded-lg">
                      {item.productImage && (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-16 h-16 rounded-lg object-cover border"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{item.productName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t('pages.adminDashboard.quantityQuantityPrice', { quantity: item.quantity, price: formatMoney(item.price) })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{formatMoney(item.subtotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('pages.adminDashboard.total')}</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">{formatMoney(selectedOrder.totalAmount)}</span>
                </div>
              </div>

              {/* Cancellation Reason */}
              {selectedOrder.cancellationReason && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-2 text-red-600">{t('pages.adminDashboard.cancellationReason')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedOrder.cancellationReason}</p>
                </div>
              )}

              {/* Payment Pending Reason (COD not yet collected) */}
              {selectedOrder.paymentPendingReason && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-2 text-amber-600">{t('pages.adminDashboard.paymentPendingReason', 'Payment Pending Reason')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedOrder.paymentPendingReason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Order Status Modal */}
      <Dialog open={isOrderStatusModalOpen} onOpenChange={setIsOrderStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('pages.adminDashboard.updateOrderStatus')}</DialogTitle>
            <DialogDescription>
              {t('pages.adminDashboard.updateTheStatusOfOrderValue', { value: selectedOrder?.orderId.substring(0, 8) })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="order_status">{t('pages.adminDashboard.orderStatus')}</Label>
              <Select value={newOrderStatus} onValueChange={setNewOrderStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('pages.adminDashboard.selectOrderStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{t('pages.adminDashboard.pending')}</SelectItem>
                  <SelectItem value="confirmed">{t('pages.adminDashboard.confirmed')}</SelectItem>
                  <SelectItem value="processing">{t('pages.adminDashboard.processing')}</SelectItem>
                  <SelectItem value="shipped">{t('pages.adminDashboard.shipped')}</SelectItem>
                  <SelectItem value="out_for_delivery">{t('pages.adminDashboard.outForDelivery')}</SelectItem>
                  <SelectItem value="delivered">{t('pages.adminDashboard.delivered')}</SelectItem>
                  <SelectItem value="completed">{t('pages.adminDashboard.completed')}</SelectItem>
                  <SelectItem value="cancelled">{t('pages.adminDashboard.cancelled')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status_notes">{t('pages.adminDashboard.notesOptional')}</Label>
              <Textarea
                id="status_notes"
                placeholder={t('pages.adminDashboard.addAnyNotesAboutThisStatus')}
                value={orderStatusNotes}
                onChange={(e) => setOrderStatusNotes(e.target.value)}
                className="min-h-[100px]"
                maxLength={500}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {orderStatusNotes.length}/500
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsOrderStatusModalOpen(false);
              setSelectedOrder(null);
              setNewOrderStatus('');
              setOrderStatusNotes('');
            }}>
              {t('pages.adminDashboard.cancel')}
            </Button>
            <Button
              onClick={handleUpdateOrderStatus}
              disabled={!newOrderStatus || isOrderActionLoading}
            >
              {isOrderActionLoading ? t('pages.adminDashboard.updating') : t('pages.adminDashboard.updateStatus')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Payment Status Modal */}
      <Dialog open={isOrderPaymentModalOpen} onOpenChange={setIsOrderPaymentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('pages.adminDashboard.updatePaymentStatus')}</DialogTitle>
            <DialogDescription>
              {t('pages.adminDashboard.updateThePaymentStatusOfOrder', { value: selectedOrder?.orderId.substring(0, 8) })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="payment_status">{t('pages.adminDashboard.paymentStatus')}</Label>
              <Select value={newPaymentStatus} onValueChange={setNewPaymentStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('pages.adminDashboard.selectPaymentStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{t('pages.adminDashboard.pending')}</SelectItem>
                  <SelectItem value="paid">{t('pages.adminDashboard.paid')}</SelectItem>
                  <SelectItem value="failed">{t('pages.adminDashboard.failed')}</SelectItem>
                  <SelectItem value="refunded">{t('pages.adminDashboard.refunded')}</SelectItem>
                  <SelectItem value="partially_refunded">{t('pages.adminDashboard.partiallyRefunded')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsOrderPaymentModalOpen(false);
              setSelectedOrder(null);
              setNewPaymentStatus('');
            }}>
              {t('pages.adminDashboard.cancel')}
            </Button>
            <Button
              onClick={handleUpdatePaymentStatus}
              disabled={!newPaymentStatus || isOrderActionLoading}
            >
              {isOrderActionLoading ? t('pages.adminDashboard.updating') : t('pages.adminDashboard.updatePaymentStatus')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vendor Revenue Modal */}
      <VendorRevenueModal
        isOpen={isRevenueModalOpen}
        onClose={() => setIsRevenueModalOpen(false)}
        vendorId={selectedRevenueVendorId}
      />

      {/* Customer Purchase History Modal */}
      <CustomerHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        customerId={selectedHistoryCustomerId}
      />

      {/* Customer Reviews Modal */}
      <CustomerReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        customerId={selectedReviewsCustomerId}
      />
    </div >
  );
};

export default AdminDashboard;
