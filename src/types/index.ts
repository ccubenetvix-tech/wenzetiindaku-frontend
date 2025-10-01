/**
 * WENZE TII NDAKU Marketplace Type Definitions
 * 
 * This file contains all TypeScript interfaces and types used throughout
 * the marketplace application. It provides type safety and better developer
 * experience with IntelliSense and compile-time error checking.
 * 
 * @author WENZE TII NDAKU Team
 * @version 1.0.0
 */

/**
 * Base Entity Interface
 * Common fields shared across all entities in the system
 */
export interface BaseEntity {
  id: string;           // Unique identifier for the entity
  createdAt?: string;   // ISO timestamp when entity was created
  updatedAt?: string;   // ISO timestamp when entity was last updated
}

/**
 * User Management Types
 * Defines user accounts, roles, and preferences
 */

/**
 * User Interface
 * Represents a user account in the marketplace
 */
export interface User extends BaseEntity {
  email: string;                                    // User's email address (unique)
  firstName: string;                                // User's first name
  lastName: string;                                 // User's last name
  avatar?: string;                                  // Optional profile picture URL
  role: 'customer' | 'vendor' | 'admin';           // User role in the system
  isVerified: boolean;                              // Email verification status
  preferences?: UserPreferences;                    // User's personal preferences
}

/**
 * User Preferences Interface
 * Stores user's personal settings and preferences
 */
export interface UserPreferences {
  language: string;                                 // Preferred language code
  currency: string;                                 // Preferred currency code
  notifications: NotificationSettings;              // Notification preferences
  theme: 'light' | 'dark' | 'system';              // UI theme preference
}

/**
 * Notification Settings Interface
 * Controls how and when users receive notifications
 */
export interface NotificationSettings {
  email: boolean;                                   // Email notifications enabled
  push: boolean;                                    // Push notifications enabled
  sms: boolean;                                     // SMS notifications enabled
  marketing: boolean;                               // Marketing emails enabled
}

/**
 * Product Management Types
 * Defines product structure, variants, and related information
 */

/**
 * Product Interface
 * Represents a product in the marketplace
 */
export interface Product extends BaseEntity {
  name: string;                                       // Product name
  description: string;                                // Detailed product description
  price: number;                                      // Current selling price
  originalPrice?: number;                             // Original price (for discounts)
  images: string[];                                   // Array of product image URLs
  thumbnail: string;                                  // Main product image URL
  category: string;                                   // Primary category
  subcategory?: string;                               // Optional subcategory
  tags: string[];                                     // Searchable tags
  vendor: string;                                     // Vendor name
  vendorId: string;                                   // Vendor ID reference
  rating: number;                                     // Average rating (0-5)
  reviewCount: number;                                // Number of reviews
  stockQuantity: number;                              // Available stock
  isActive: boolean;                                  // Product visibility status
  isFeatured: boolean;                                // Featured product flag
  isNew: boolean;                                     // New product flag
  specifications?: Record<string, string | number | boolean>; // Product specs
  variants?: ProductVariant[];                        // Product variants (size, color, etc.)
  shipping?: ShippingInfo;                            // Shipping information
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceModifier: number;
  stockQuantity: number;
}

export interface ShippingInfo {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  freeShipping: boolean;
  shippingCost: number;
}

// Category related types
export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  parentCategory?: string;
  subcategories?: string[];
  productCount: number;
  isActive: boolean;
  sortOrder: number;
}

// Store/Vendor related types
export interface Store extends BaseEntity {
  name: string;
  description: string;
  logo: string;
  banner: string;
  owner: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  followerCount: number;
  location: StoreLocation;
  contact: ContactInfo;
  social: SocialMedia;
  policies: StorePolicies;
  categories: string[];
  specialties: string[];
  isVerified: boolean;
  isFeatured: boolean;
  status: 'active' | 'suspended' | 'pending';
  commission: number;
}

export interface StoreLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ContactInfo {
  phone: string;
  email: string;
  website?: string;
  workingHours?: WorkingHours;
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

export interface SocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

export interface StorePolicies {
  shipping: ShippingPolicy;
  returns: ReturnPolicy;
  responseTime: string;
  minimumOrder?: number;
}

export interface ShippingPolicy {
  freeShippingThreshold?: number;
  shippingCost: number;
  estimatedDelivery: string;
  shippingMethods: string[];
}

export interface ReturnPolicy {
  returnWindow: number;
  returnConditions: string[];
  refundMethod: string;
}

// Order related types
export interface Order extends BaseEntity {
  orderNumber: string;
  customer: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  payment: PaymentInfo;
  shipping: ShippingDetails;
  billing: BillingAddress;
  notes?: string;
}

export interface OrderItem {
  product: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  vendor: string;
}

export interface PaymentInfo {
  method: string;
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  currency: string;
}

export interface ShippingDetails {
  method: string;
  trackingNumber?: string;
  estimatedDelivery: string;
  status: 'pending' | 'shipped' | 'delivered';
  address: Address;
}

export type BillingAddress = Address;

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

// Review related types
export interface Review extends BaseEntity {
  product: string;
  customer: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  isVerified: boolean;
  helpful: number;
  reported: boolean;
}

// Cart related types
export interface CartItem {
  product: string;
  quantity: number;
  selectedVariant?: string;
}

export interface Cart extends BaseEntity {
  customer: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  expiresAt: string;
}

// Search and Filter types
export interface SearchFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  availability?: 'inStock' | 'outOfStock' | 'all';
  vendors?: string[];
  tags?: string[];
  sortBy?: 'price' | 'rating' | 'newest' | 'popular';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: string | number | RegExp;
  message: string;
}

// UI Component types
export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  children?: MenuItem[];
  isActive?: boolean;
  isDisabled?: boolean;
}
