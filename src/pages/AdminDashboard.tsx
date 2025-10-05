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
import { 
  Shield, 
  Users, 
  Store, 
  Package,
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye, 
  Edit,
  Trash2,
  AlertTriangle,
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  LogOut,
  Search,
  Filter,
  RefreshCw,
  Plus,
  DollarSign,
  ShoppingCart,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '../utils/api';

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
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
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

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for different tabs
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dashboard stats
  const [stats, setStats] = useState<DashboardStats>({
    totalVendors: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalSales: 0,
    pendingVendors: 0,
    flaggedProducts: 0
  });
  
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
  
  // Modals state
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isRedMarkModalOpen, setIsRedMarkModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [redMarkReason, setRedMarkReason] = useState('');
  
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
    try {
      const response = await apiClient.getAdminDashboard();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    }
  };

  // Fetch vendors
  const fetchVendors = async () => {
    setVendorsLoading(true);
    try {
      const statusFilter = vendorsStatusFilter === 'all' ? '' : vendorsStatusFilter;
      const response = await apiClient.getVendors(vendorsPage, 10, statusFilter);
      if (response.success) {
        setVendors(response.data.vendors);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch vendors",
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
      const response = await apiClient.getAdminProducts(productsPage, 10, productsSearch, statusFilter, vendorFilter);
      if (response.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
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
      const response = await apiClient.getAdminCustomers(customersPage, 10, customersSearch);
      if (response.success) {
        setCustomers(response.data.customers);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    } finally {
      setCustomersLoading(false);
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
    }
  }, [activeTab, vendorsPage, vendorsStatusFilter, productsPage, productsSearch, productsStatusFilter, productsVendorFilter, customersPage, customersSearch]);

  // Handle vendor actions
  const handleApproveVendor = async (vendorId: string) => {
    try {
      const response = await apiClient.approveVendor(vendorId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Vendor approved successfully",
        });
        fetchVendors();
        fetchDashboardData();
        setIsApproveModalOpen(false);
      }
    } catch (error) {
      console.error('Error approving vendor:', error);
      toast({
        title: "Error",
        description: "Failed to approve vendor",
        variant: "destructive",
      });
    }
  };

  const handleRejectVendor = async (vendorId: string) => {
    try {
      const response = await apiClient.rejectVendor(vendorId, rejectionReason);
      if (response.success) {
        toast({
          title: "Success",
          description: "Vendor rejected successfully",
        });
        fetchVendors();
        fetchDashboardData();
        setIsRejectModalOpen(false);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Error rejecting vendor:', error);
      toast({
        title: "Error",
        description: "Failed to reject vendor",
        variant: "destructive",
      });
    }
  };

  const handleUpdateVendor = async () => {
    if (!selectedVendor) return;
    
    try {
      const response = await apiClient.updateVendor(selectedVendor.id, vendorForm);
      if (response.success) {
        toast({
          title: "Success",
          description: "Vendor updated successfully",
        });
        fetchVendors();
        setIsEditModalOpen(false);
        setVendorForm({});
      }
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast({
        title: "Error",
        description: "Failed to update vendor",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    try {
      const response = await apiClient.deleteVendor(vendorId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Vendor deleted successfully",
        });
        fetchVendors();
        fetchDashboardData();
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast({
        title: "Error",
        description: "Failed to delete vendor",
        variant: "destructive",
      });
    }
  };

  // Handle product actions
  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      const response = await apiClient.updateAdminProduct(selectedProduct.id, productForm);
      if (response.success) {
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
        fetchProducts();
        setIsEditModalOpen(false);
        setProductForm({});
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await apiClient.deleteAdminProduct(productId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
        fetchProducts();
        fetchDashboardData();
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleRedMarkProduct = async (productId: string) => {
    try {
      const response = await apiClient.redMarkProduct(productId, redMarkReason);
      if (response.success) {
        toast({
          title: "Success",
          description: "Product red-marked successfully",
        });
        fetchProducts();
        fetchDashboardData();
        setIsRedMarkModalOpen(false);
        setRedMarkReason('');
      }
    } catch (error) {
      console.error('Error red-marking product:', error);
      toast({
        title: "Error",
        description: "Failed to red-mark product",
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
          title: "Success",
          description: "Customer deleted successfully",
        });
        fetchCustomers();
        fetchDashboardData();
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    }
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
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">WENZE TII NDAKU Management</p>
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
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm"
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
              <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
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
             <TabsList className="grid w-full grid-cols-4 bg-transparent gap-1">
               <TabsTrigger 
                 value="overview" 
                 className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-navy-600 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-md py-2.5 font-medium hover:bg-gradient-to-r hover:from-navy-50 hover:to-orange-50"
               >
                 <TrendingUp className="h-4 w-4 mr-2" />
                 Overview
               </TabsTrigger>
               <TabsTrigger 
                 value="vendors" 
                 className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-navy-600 data-[state=active]:text-white rounded-md py-2.5 font-medium hover:bg-gradient-to-r hover:from-orange-50 hover:to-navy-50"
               >
                 <Store className="h-4 w-4 mr-2" />
                 Vendors
               </TabsTrigger>
               <TabsTrigger 
                 value="products" 
                 className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-navy-600 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-md py-2.5 font-medium hover:bg-gradient-to-r hover:from-navy-50 hover:to-orange-50"
               >
                 <Package className="h-4 w-4 mr-2" />
                 Products
               </TabsTrigger>
               <TabsTrigger 
                 value="customers" 
                 className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-navy-600 data-[state=active]:text-white rounded-md py-2.5 font-medium hover:bg-gradient-to-r hover:from-orange-50 hover:to-navy-50"
               >
                 <Users className="h-4 w-4 mr-2" />
                 Customers
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
                      <p className="text-sm font-medium text-navy-600 dark:text-navy-400">Total Vendors</p>
                      <p className="text-3xl font-bold text-navy-900 dark:text-navy-100">{stats.totalVendors}</p>
                      <p className="text-xs text-navy-600 dark:text-navy-400 mt-1">
                    {stats.pendingVendors} pending approval
                  </p>
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
                      <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Total Products</p>
                      <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats.totalProducts}</p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    {stats.flaggedProducts} flagged
                  </p>
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
                      <p className="text-sm font-medium text-navy-600 dark:text-navy-400">Total Customers</p>
                      <p className="text-3xl font-bold text-navy-900 dark:text-navy-100">{stats.totalCustomers}</p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                        Active users
                      </p>
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
                      <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Total Sales</p>
                      <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">${stats.totalSales?.toLocaleString() || 0}</p>
                      <p className="text-xs text-navy-600 dark:text-navy-400 mt-1">
                        {stats.totalOrders} orders
                      </p>
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
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Frequently used admin actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={() => setActiveTab('vendors')}
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-navy-50 hover:border-navy-300 dark:hover:bg-navy-900/50"
                    >
                      <Store className="h-6 w-6 text-navy-600" />
                      <span className="text-sm font-medium">Manage Vendors</span>
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('products')}
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-navy-50 hover:border-navy-300 dark:hover:bg-navy-900/50"
                    >
                      <Package className="h-6 w-6 text-navy-600" />
                      <span className="text-sm font-medium">Review Products</span>
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('customers')}
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-navy-50 hover:border-navy-300 dark:hover:bg-navy-900/50"
                    >
                      <Users className="h-6 w-6 text-navy-600" />
                      <span className="text-sm font-medium">View Customers</span>
                    </Button>
                    <Button 
                      onClick={fetchDashboardData}
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-navy-50 hover:border-navy-300 dark:hover:bg-navy-900/50"
                    >
                      <RefreshCw className="h-6 w-6 text-navy-600" />
                      <span className="text-sm font-medium">Refresh Data</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* System Status & Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-navy-600" />
                    System Status
                  </CardTitle>
                  <CardDescription>Platform health and alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900 dark:text-green-100">Platform Status</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Online</Badge>
                  </div>
                  
                  {stats.pendingVendors > 0 && (
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Pending Approvals</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{stats.pendingVendors}</Badge>
                    </div>
                  )}
                  
                  {stats.flaggedProducts > 0 && (
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span className="text-sm font-medium text-red-900 dark:text-red-100">Flagged Products</span>
                      </div>
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{stats.flaggedProducts}</Badge>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Last Updated</span>
                    </div>
                    <span className="text-sm text-blue-600 dark:text-blue-400">{new Date().toLocaleTimeString()}</span>
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
                       <CardTitle className="text-navy-900 dark:text-navy-100">Vendor Management</CardTitle>
                       <CardDescription className="text-orange-600 dark:text-orange-400">
                         Manage vendor accounts, approvals, and business profiles
                       </CardDescription>
                  </div>
                   </div>
                   <div className="flex items-center space-x-2">
                     <Badge variant="secondary" className="bg-navy-100 text-navy-800">
                       {vendors.length} vendors
                     </Badge>
                     <Button onClick={fetchVendors} variant="outline" size="sm" className="border-orange-300 hover:bg-orange-50">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
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
                      placeholder="Search by business name, email, or location..."
                      value={vendorsSearch}
                      onChange={(e) => setVendorsSearch(e.target.value)}
                      className="pl-10 bg-white dark:bg-navy-800 border-gray-300 dark:border-navy-700"
                    />
                  </div>
                  <Select value={vendorsStatusFilter} onValueChange={setVendorsStatusFilter}>
                    <SelectTrigger className="w-48 bg-white dark:bg-navy-800 border-gray-300 dark:border-navy-700">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending Approval</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Professional Vendor Table */}
                <div className="bg-white dark:bg-navy-900 rounded-lg border border-gray-200 dark:border-navy-800 overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-navy-800/50 border-b border-gray-200 dark:border-navy-700">
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Business Details</TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Contact</TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Status</TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Registration</TableHead>
                        <TableHead className="text-right font-semibold text-gray-900 dark:text-gray-100">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendorsLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-12">
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <div className="w-8 h-8 border-4 border-navy-600 border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-gray-500 dark:text-gray-400">Loading vendors...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : vendors.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-12">
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <Store className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                              <div className="text-center">
                                <p className="text-gray-500 dark:text-gray-400 font-medium">No vendors found</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your search or filter criteria</p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        vendors.map((vendor) => (
                          <TableRow key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-navy-800/30 transition-colors">
                            <TableCell className="py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-navy-600 rounded-lg flex items-center justify-center">
                                  <span className="text-sm font-bold text-white">
                                    {vendor.business_name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
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
                                  className={`w-fit ${
                                    vendor.approved 
                                      ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                      : vendor.rejected_at 
                                      ? "bg-red-100 text-red-800 hover:bg-red-100" 
                                      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                  }`}
                                >
                                  {vendor.approved ? (
                                    <>
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Approved
                                    </>
                                  ) : vendor.rejected_at ? (
                                    <>
                                      <XCircle className="h-3 w-3 mr-1" />
                                      Rejected
                                    </>
                                  ) : (
                                    <>
                                      <Clock className="h-3 w-3 mr-1" />
                                      Pending
                                    </>
                                  )}
                              </Badge>
                                {vendor.verified && (
                                  <Badge variant="secondary" className="w-fit text-xs bg-blue-100 text-blue-800">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="text-sm text-gray-900 dark:text-gray-100">
                              {new Date(vendor.created_at).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(vendor.created_at).toLocaleTimeString()}
                              </div>
                            </TableCell>
                            <TableCell className="text-right py-4">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedVendor(vendor);
                                    setIsViewModalOpen(true);
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
                                    setVendorForm(vendor);
                                    setIsEditModalOpen(true);
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>Manage all products across vendors</CardDescription>
                  </div>
                  <Button onClick={fetchProducts} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search products..."
                      value={productsSearch}
                      onChange={(e) => setProductsSearch(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <Select value={productsStatusFilter} onValueChange={setProductsStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productsLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="flex items-center justify-center space-x-2">
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              <span>Loading products...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : products.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No products found
                          </TableCell>
                        </TableRow>
                      ) : (
                        products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
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
                                {product.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setIsViewModalOpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setProductForm(product);
                                    setIsEditModalOpen(true);
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Customer Management</CardTitle>
                    <CardDescription>View and manage customer accounts</CardDescription>
                  </div>
                  <Button onClick={fetchCustomers} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search customers..."
                      value={customersSearch}
                      onChange={(e) => setCustomersSearch(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customersLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="flex items-center justify-center space-x-2">
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              <span>Loading customers...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : customers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No customers found
                          </TableCell>
                        </TableRow>
                      ) : (
                        customers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell className="font-medium">
                              {customer.first_name} {customer.last_name}
                            </TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{customer.phone_number || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge variant={customer.verified ? "default" : "secondary"}>
                                {customer.verified ? "Verified" : "Unverified"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(customer.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedCustomer(customer);
                                    setIsViewModalOpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* View Vendor Modal */}
      <Dialog open={isViewModalOpen && selectedVendor} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vendor Details</DialogTitle>
            <DialogDescription>
              Complete information about {selectedVendor?.business_name}
            </DialogDescription>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Business Name</Label>
                  <p className="text-sm text-gray-600">{selectedVendor.business_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-gray-600">{selectedVendor.business_email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm text-gray-600">{selectedVendor.business_phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={selectedVendor.approved ? "default" : selectedVendor.rejected_at ? "destructive" : "secondary"}>
                    {selectedVendor.approved ? "Approved" : selectedVendor.rejected_at ? "Rejected" : "Pending"}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Address</Label>
                <p className="text-sm text-gray-600">
                  {selectedVendor.business_address}, {selectedVendor.city}, {selectedVendor.state} {selectedVendor.postal_code}, {selectedVendor.country}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-gray-600">{selectedVendor.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Vendor Modal */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Vendor</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve {selectedVendor?.business_name}? This will send an approval email to the vendor.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => selectedVendor && handleApproveVendor(selectedVendor.id)}>
              Approve Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Vendor Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Vendor</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {selectedVendor?.business_name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection_reason">Rejection Reason</Label>
              <Textarea
                id="rejection_reason"
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedVendor && handleRejectVendor(selectedVendor.id)}
              disabled={!rejectionReason.trim()}
            >
              Reject Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {selectedVendor && `Are you sure you want to delete ${selectedVendor.business_name}? This will permanently delete the vendor and all associated data.`}
              {selectedProduct && `Are you sure you want to delete ${selectedProduct.name}? This action cannot be undone.`}
              {selectedCustomer && `Are you sure you want to delete ${selectedCustomer.first_name} ${selectedCustomer.last_name}? This will permanently delete the customer and all associated data.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
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
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Red Mark Product Modal */}
      <Dialog open={isRedMarkModalOpen} onOpenChange={setIsRedMarkModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Red Mark Product</DialogTitle>
            <DialogDescription>
              Please provide a reason for flagging {selectedProduct?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="red_mark_reason">Reason for Flagging</Label>
              <Textarea
                id="red_mark_reason"
                placeholder="Enter reason for flagging this product..."
                value={redMarkReason}
                onChange={(e) => setRedMarkReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRedMarkModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedProduct && handleRedMarkProduct(selectedProduct.id)}
              disabled={!redMarkReason.trim()}
            >
              Red Mark Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vendor Modal */}
      <Dialog open={isEditModalOpen && selectedVendor} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
            <DialogDescription>
              Update vendor information for {selectedVendor?.business_name}
            </DialogDescription>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    value={vendorForm.business_name || ''}
                    onChange={(e) => setVendorForm({...vendorForm, business_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="business_email">Email</Label>
                  <Input
                    id="business_email"
                    type="email"
                    value={vendorForm.business_email || ''}
                    onChange={(e) => setVendorForm({...vendorForm, business_email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="business_phone">Phone</Label>
                  <Input
                    id="business_phone"
                    value={vendorForm.business_phone || ''}
                    onChange={(e) => setVendorForm({...vendorForm, business_phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="business_type">Business Type</Label>
                  <Input
                    id="business_type"
                    value={vendorForm.business_type || ''}
                    onChange={(e) => setVendorForm({...vendorForm, business_type: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="business_address">Address</Label>
                <Textarea
                  id="business_address"
                  value={vendorForm.business_address || ''}
                  onChange={(e) => setVendorForm({...vendorForm, business_address: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={vendorForm.description || ''}
                  onChange={(e) => setVendorForm({...vendorForm, description: e.target.value})}
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={vendorForm.verified || false}
                    onChange={(e) => setVendorForm({...vendorForm, verified: e.target.checked})}
                  />
                  <Label htmlFor="verified">Verified</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="approved"
                    checked={vendorForm.approved || false}
                    onChange={(e) => setVendorForm({...vendorForm, approved: e.target.checked})}
                  />
                  <Label htmlFor="approved">Approved</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateVendor}>
              Update Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Product Modal */}
      <Dialog open={isViewModalOpen && selectedProduct} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Complete information about {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Product Name</Label>
                  <p className="text-sm text-gray-600">{selectedProduct.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Price</Label>
                  <p className="text-sm text-gray-600">${selectedProduct.price}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm text-gray-600">{selectedProduct.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Stock</Label>
                  <p className="text-sm text-gray-600">{selectedProduct.stock}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={selectedProduct.status === 'active' ? "default" : selectedProduct.status === 'flagged' ? "destructive" : "secondary"}>
                    {selectedProduct.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Vendor</Label>
                  <p className="text-sm text-gray-600">{selectedProduct.vendor.business_name}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-gray-600">{selectedProduct.description}</p>
              </div>
              {selectedProduct.flagged_reason && (
                <div>
                  <Label className="text-sm font-medium">Flagged Reason</Label>
                  <p className="text-sm text-red-600">{selectedProduct.flagged_reason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Customer Modal */}
      <Dialog open={isViewModalOpen && selectedCustomer} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              Complete information about {selectedCustomer?.first_name} {selectedCustomer?.last_name}
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-gray-600">{selectedCustomer.first_name} {selectedCustomer.last_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm text-gray-600">{selectedCustomer.phone_number || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Gender</Label>
                  <p className="text-sm text-gray-600">{selectedCustomer.gender || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date of Birth</Label>
                  <p className="text-sm text-gray-600">{selectedCustomer.date_of_birth || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={selectedCustomer.verified ? "default" : "secondary"}>
                    {selectedCustomer.verified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Address</Label>
                <p className="text-sm text-gray-600">{selectedCustomer.address || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Profile Completed</Label>
                <Badge variant={selectedCustomer.profile_completed ? "default" : "secondary"}>
                  {selectedCustomer.profile_completed ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
