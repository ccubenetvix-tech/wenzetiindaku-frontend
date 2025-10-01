import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manage vendors, products, and customers</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalVendors}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingVendors} pending approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.flaggedProducts} flagged
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalSales?.toLocaleString() || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalOrders} total orders
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">System Overview</p>
                        <p className="text-xs text-gray-500">All systems operational</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Database Status</p>
                        <p className="text-xs text-gray-500">Connected and healthy</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                      onClick={() => setActiveTab('vendors')}
                    >
                      <Store className="h-5 w-5" />
                      <span className="text-xs">Manage Vendors</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                      onClick={() => setActiveTab('products')}
                    >
                      <Package className="h-5 w-5" />
                      <span className="text-xs">Manage Products</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                      onClick={() => setActiveTab('customers')}
                    >
                      <Users className="h-5 w-5" />
                      <span className="text-xs">Manage Customers</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                      onClick={fetchDashboardData}
                    >
                      <RefreshCw className="h-5 w-5" />
                      <span className="text-xs">Refresh Data</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Vendors Tab */}
          <TabsContent value="vendors" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Vendor Management</CardTitle>
                    <CardDescription>Manage vendor accounts and approvals</CardDescription>
                  </div>
                  <Button onClick={fetchVendors} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search vendors..."
                      value={vendorsSearch}
                      onChange={(e) => setVendorsSearch(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <Select value={vendorsStatusFilter} onValueChange={setVendorsStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendorsLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <div className="flex items-center justify-center space-x-2">
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              <span>Loading vendors...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : vendors.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No vendors found
                          </TableCell>
                        </TableRow>
                      ) : (
                        vendors.map((vendor) => (
                          <TableRow key={vendor.id}>
                            <TableCell className="font-medium">{vendor.business_name}</TableCell>
                            <TableCell>{vendor.business_email}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={vendor.approved ? "default" : vendor.rejected_at ? "destructive" : "secondary"}
                              >
                                {vendor.approved ? "Approved" : vendor.rejected_at ? "Rejected" : "Pending"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(vendor.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedVendor(vendor);
                                    setIsViewModalOpen(true);
                                  }}
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
