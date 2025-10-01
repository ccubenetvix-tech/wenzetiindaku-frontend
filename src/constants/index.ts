/**
 * Application Constants
 * 
 * This file contains all application-wide constants including configuration,
 * API endpoints, validation rules, and other static values used throughout
 * the WENZE TII NDAKU marketplace.
 * 
 * @author WENZE TII NDAKU Team
 * @version 1.0.0
 */

/**
 * Application Configuration
 * Core application settings and metadata
 */
export const APP_CONFIG = {
  name: 'WENZE TII NDAKU',                    // Application name
  description: 'Multi-Vendor Marketplace',     // Application description
  version: '1.0.0',                           // Current version
  supportEmail: 'support@wenzetiindaku.com',  // Customer support email
  vendorEmail: 'vendors@wenzetiindaku.com'    // Vendor support email
} as const;

/**
 * API Endpoints Configuration
 * Defines all API endpoints for backend communication
 */
export const API_ENDPOINTS = {
  base: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',  // Base API URL
  products: '/products',      // Products endpoint
  categories: '/categories',  // Categories endpoint
  stores: '/stores',          // Stores endpoint
  auth: '/auth',              // Authentication endpoint
  users: '/users'             // Users endpoint
} as const;

// Image Configuration
export const IMAGE_CONFIG = {
  product: {
    width: 400,
    height: 400,
    quality: 'crop&crop=center'
  },
  banner: {
    width: 1200,
    height: 400,
    quality: 'crop&crop=center'
  },
  store: {
    width: 400,
    height: 400,
    quality: 'crop&crop=center'
  }
} as const;

// Pagination
export const PAGINATION = {
  defaultPageSize: 12,
  maxPageSize: 50,
  pageSizeOptions: [12, 24, 36, 48]
} as const;

// Validation Rules
export const VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-()]+$/,
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  }
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  userToken: 'wtn_user_token',
  userPreferences: 'wtn_user_preferences',
  cartItems: 'wtn_cart_items',
  recentlyViewed: 'wtn_recently_viewed'
} as const;

// Route Paths
export const ROUTES = {
  home: '/',
  categories: '/categories',
  category: '/category/:categoryName',
  stores: '/stores',
  store: '/store/:storeId',
  product: '/product/:productId',
  cart: '/cart',
  checkout: '/checkout',
  profile: '/profile',
  userLogin: '/user/login',
  vendorLogin: '/vendor/login'
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

// Animation Durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500
} as const;
