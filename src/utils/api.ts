
// Global auth state management for API client
let authState: { 
  clearAuth: () => void; 
  redirectToLogin: () => void; 
} | null = null;

export const setAuthState = (state: typeof authState) => {
  authState = state;
};

// Environment-based API URL configuration
export const getApiBaseUrl = () => {
  // Priority 1: VITE_API_URL (explicit override, highest priority)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Priority 2: Check environment setting
  const environment = import.meta.env.VITE_ENVIRONMENT || 'production';
  
  if (environment === 'development') {
    // In development, use local backend from env
    const localUrl = import.meta.env.VITE_LOCAL_BACKEND_URL;
    if (!localUrl) {
      throw new Error('VITE_LOCAL_BACKEND_URL is not set in .env file. Please set it to your local backend URL (e.g., http://localhost:5000/api)');
    }
    return localUrl;
  } else {
    // In production, use deployed backend from env
    const productionUrl = import.meta.env.VITE_PRODUCTION_BACKEND_URL;
    if (!productionUrl) {
      throw new Error('VITE_PRODUCTION_BACKEND_URL is not set in .env file. Please set it to your production backend URL');
    }
    return productionUrl;
  }
};

const API_BASE_URL = getApiBaseUrl();

export class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
      ...options,
    };

    // Check for admin token first, then regular token
    const adminToken = localStorage.getItem('adminToken');
    const userToken = this.token || localStorage.getItem('auth_token');
    
    // For vendor routes, prioritize user token over admin token
    const isVendorRoute = endpoint.includes('/vendor/');
    
    if (isVendorRoute && userToken) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${userToken}`,
      };
    } else if (adminToken) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${adminToken}`,
      };
    } else if (userToken) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${userToken}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      
      if (!response.ok) {
        // read text to avoid JSON parse on HTML/text errors (e.g., 429)
        const text = await response.text();
        const error = new Error(text || response.statusText || `HTTP ${response.status}`);
        (error as Error & { status?: number }).status = response.status;
        throw error;
      }

      if (isJson) {
        return await response.json();
      }
      const text = await response.text();
      return text as unknown as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string, role: 'customer' | 'vendor') {
    return this.request(`/auth/${role}/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(data: any, role: 'customer' | 'vendor') {
    return this.request(`/auth/${role}/signup`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEmailStatus(email: string, role?: 'customer' | 'vendor', signal?: AbortSignal) {
    const params = new URLSearchParams({ email });
    if (role) {
      params.append('role', role);
    }

    const query = params.toString();
    return this.request(`/auth/email-status?${query}`, {
      method: 'GET',
      signal,
    });
  }

  async verifyOTP(email: string, otp: string, role: 'customer' | 'vendor') {
    return this.request(`/auth/${role}/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async resendOTP(email: string, role: 'customer' | 'vendor') {
    return this.request(`/auth/${role}/resend-otp`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getProfile() {
    return this.request(`/auth/me`);
  }

  // Customer methods
  async getCustomerProfile() {
    return this.request(`/customer/profile`);
  }

  async updateCustomerProfile(data: any) {
    return this.request(`/customer/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Address management methods
  async getCustomerAddresses() {
    return this.request(`/customer/addresses`);
  }

  async createCustomerAddress(addressData: {
    label?: string;
    fullName: string;
    email: string;
    phone: string;
    street1: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
  }) {
    return this.request(`/customer/addresses`, {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  async updateCustomerAddress(addressId: string, addressData: {
    label?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    isDefault?: boolean;
  }) {
    return this.request(`/customer/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  }

  async deleteCustomerAddress(addressId: string) {
    return this.request(`/customer/addresses/${addressId}`, {
      method: 'DELETE',
    });
  }

  async getCustomerOrders(page = 1, limit = 10) {
    return this.request(`/customer/orders?page=${page}&limit=${limit}`);
  }

  async createCustomerOrders(payload: {
    paymentMethod: string;
    shippingAddress: Record<string, unknown>;
    saveAddressToProfile?: boolean;
  }) {
    return this.request(`/customer/orders`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getCustomerOrder(orderId: string) {
    return this.request(`/customer/orders/${orderId}`);
  }

  async cancelCustomerOrder(orderId: string, cancellationReason: string) {
    return this.request(`/customer/orders/${orderId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ cancellationReason }),
    });
  }

  async getWishlist() {
    return this.request(`/customer/wishlist`);
  }

  async addToWishlist(productId: string) {
    return this.request(`/customer/wishlist`, {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromWishlist(productId: string) {
    return this.request(`/customer/wishlist/${productId}`, {
      method: 'DELETE',
    });
  }

  async deleteCustomerAccount(confirmation: string): Promise<{ success: boolean; message?: string; error?: { message: string } }> {
    return this.request(`/customer/delete-account`, {
      method: 'DELETE',
      body: JSON.stringify({ confirmation }),
    });
  }

  async fixRegistrationMethod(registrationMethod: 'google' | 'email'): Promise<{ success: boolean; message?: string; error?: { message: string } }> {
    return this.request(`/customer/fix-registration-method`, {
      method: 'POST',
      body: JSON.stringify({ registrationMethod }),
    });
  }

  // Vendor uploads
  async uploadVendorProfilePhoto(fileBase64: string, fileName: string): Promise<{ success: boolean; data?: { url: string } }> {
    return this.request(`/vendor/profile/photo`, {
      method: 'POST',
      body: JSON.stringify({ fileBase64, fileName })
    });
  }

  async uploadProductImage(productId: string, fileBase64: string, fileName: string): Promise<{ success: boolean; data?: { url: string } }> {
    return this.request(`/vendor/products/${productId}/image`, {
      method: 'POST',
      body: JSON.stringify({ fileBase64, fileName })
    });
  }

  // Cart methods
  async getCart() {
    return this.request(`/cart`);
  }

  async addToCart(productId: string, quantity = 1) {
    return this.request(`/cart`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.request(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId: string) {
    return this.request(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request(`/cart`, {
      method: 'DELETE',
    });
  }

  // Vendor methods
  async getVendorProfile() {
    return this.request(`/vendor/profile`);
  }

  async updateVendorProfile(data: any) {
    return this.request(`/vendor/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getVendorDashboard() {
    return this.request(`/vendor/dashboard`);
  }

  async getVendorProducts(page = 1, limit = 10, status?: string, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    
    return this.request(`/vendor/products?${params}`);
  }

  async createProduct(data: any) {
    return this.request(`/vendor/products`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(productId: string, data: any) {
    return this.request(`/vendor/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(productId: string) {
    return this.request(`/vendor/products/${productId}`, {
      method: 'DELETE',
    });
  }

  async createVendorProduct(productData: any) {
    return this.request('/vendor/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateVendorProduct(productId: string, productData: any) {
    return this.request(`/vendor/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteVendorProduct(productId: string) {
    return this.deleteProduct(productId);
  }

  // Public product endpoints
  async getFeaturedProducts(location?: string, limit = 12) {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });
    if (location) params.append('location', location);
    
    return this.request(`/products/featured?${params}`);
  }

  async getAllProducts(params: {
    location?: string;
    category?: string;
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    
    return this.request(`/products?${searchParams}`);
  }

  async getProductById(productId: string) {
    return this.request(`/products/${productId}`);
  }

  async getVendorOrders(page = 1, limit = 10, status?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) params.append('status', status);
    
    return this.request(`/vendor/orders?${params}`);
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.request(`/vendor/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async updateVendorOrderStatus(orderId: string, status: string) {
    return this.updateOrderStatus(orderId, status);
  }

  // Admin methods
  async adminLogin(email: string, password: string) {
    return this.request(`/admin/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getAdminDashboard() {
    return this.request(`/admin/dashboard`, {
      method: 'GET',
    });
  }

  async getVendors(page = 1, limit = 10, status?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) params.append('status', status);
    
    return this.request(`/admin/vendors?${params.toString()}`, {
      method: 'GET',
    });
  }

  async updateVendor(vendorId: string, vendorData: any) {
    return this.request(`/admin/vendors/${vendorId}`, {
      method: 'PUT',
      body: JSON.stringify(vendorData),
    });
  }

  async deleteVendor(vendorId: string) {
    return this.request(`/admin/vendors/${vendorId}`, {
      method: 'DELETE',
    });
  }

  async getAdminProducts(page = 1, limit = 10, search = '', status = '', vendorId = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (vendorId) params.append('vendor_id', vendorId);
    
    return this.request(`/admin/products?${params.toString()}`, {
      method: 'GET',
    });
  }

  async updateAdminProduct(productId: string, productData: any) {
    return this.request(`/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteAdminProduct(productId: string) {
    return this.request(`/admin/products/${productId}`, {
      method: 'DELETE',
    });
  }

  async redMarkProduct(productId: string, reason: string) {
    return this.request(`/admin/products/${productId}/red-mark`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  async getAdminCustomers(page = 1, limit = 10, search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) params.append('search', search);
    
    return this.request(`/admin/customers?${params.toString()}`, {
      method: 'GET',
    });
  }

  async getAdminCustomerDetails(customerId: string) {
    return this.request(`/admin/customers/${customerId}`, {
      method: 'GET',
    });
  }

  async deleteAdminCustomer(customerId: string) {
    return this.request(`/admin/customers/${customerId}`, {
      method: 'DELETE',
    });
  }

  async getVendorDetails(vendorId: string) {
    return this.request(`/admin/vendors/${vendorId}`, {
      method: 'GET',
    });
  }

  async approveVendor(vendorId: string) {
    return this.request(`/admin/vendors/${vendorId}/approve`, {
      method: 'PUT',
    });
  }

  async rejectVendor(vendorId: string, reason: string) {
    return this.request(`/admin/vendors/${vendorId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  // Public vendor methods
  async getAllVendors() {
    return this.request('/products/vendors');
  }

  async getVendorById(vendorId: string) {
    return this.request(`/products/vendors/${vendorId}`);
  }

  // Review Methods
  async createReview(productId: string, rating: number, comment: string, orderId?: string) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify({ productId, rating, comment, orderId }),
    });
  }

  async updateReview(reviewId: string, rating?: number, comment?: string) {
    return this.request(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify({ rating, comment }),
    });
  }

  async deleteReview(reviewId: string) {
    return this.request(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }

  async getProductReviews(productId: string, page = 1, limit = 20, sort = 'newest') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
    });
    return this.request(`/reviews/product/${productId}?${params}`);
  }

  async getCustomerReviews(page = 1, limit = 20) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return this.request(`/reviews/customer?${params}`);
  }

  async getVendorReviews(page = 1, limit = 20) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return this.request(`/reviews/vendor?${params}`);
  }

  async canReviewProduct(productId: string) {
    return this.request(`/reviews/can-review/${productId}`);
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();

// Note: Do not import AuthContext here to avoid circular imports during HMR
