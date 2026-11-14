// Import UI notification components for toast messages
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
// Import tooltip provider for enhanced UI interactions
import { TooltipProvider } from "@/components/ui/tooltip";
// Import React Query for server state management and caching
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Import React Router for client-side routing and navigation
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
// Import i18next for internationalization support
import { I18nextProvider } from "react-i18next";
// Import auth context provider for authentication state management
import { AuthProvider } from "@/contexts/AuthContext";
// Import cart and wishlist providers for shopping experience state
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ChatProvider } from "@/contexts/ChatContext";
// Import cookie consent component for GDPR compliance
import { CookieConsent } from "@/components/CookieConsent";
// Import i18n configuration for multi-language support
import i18n from "./lib/i18n";
// Page components. The home page and 404 load with the app; every other page is
// loaded on demand (code splitting) so the first visit downloads much less JavaScript.
// Main marketplace pages
import Index from "./pages/Index";                    // Homepage with hero section and featured content
const Category = lazy(() => import("./pages/Category"));              // Individual category page with products
const Categories = lazy(() => import("./pages/Categories"));          // Categories listing page
const Store = lazy(() => import("./pages/Store"));                    // Individual store page
const Stores = lazy(() => import("./pages/Stores"));                  // Stores listing page
const ProductDetail = lazy(() => import("./pages/ProductDetail"));    // Product details and purchase page
const Cart = lazy(() => import("./pages/Cart"));                      // Shopping cart page
const Checkout = lazy(() => import("./pages/Checkout"));              // Checkout and payment page
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));      // Order success confirmation page
const OrderFailure = lazy(() => import("./pages/OrderFailure"));      // Order failure page
const CustomerProfile = lazy(() => import("./pages/CustomerProfile")); // Customer profile management
const CustomerDashboard = lazy(() => import("./pages/CustomerDashboard")); // Customer dashboard
const AddAddress = lazy(() => import("./pages/AddAddress")); // Add Address page
const VendorProfile = lazy(() => import("./pages/VendorProfile"));     // Vendor profile management
const SearchResults = lazy(() => import("./pages/SearchResults"));    // Search results page
const Chat = lazy(() => import("./pages/Chat"));                        // Chat page
const LogoutConfirmation = lazy(() => import("./pages/LogoutConfirmation")); // Logout confirmation page

// Information and legal pages
const About = lazy(() => import("./pages/About"));                    // About the marketplace
const Contact = lazy(() => import("./pages/Contact"));                // Contact information and form
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));    // Privacy policy page
const TermsOfService = lazy(() => import("./pages/TermsOfService"));  // Terms of service page
const VendorTerms = lazy(() => import("./pages/VendorTerms"));        // Vendor terms page
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));      // Cookie policy page
const HelpCenter = lazy(() => import("./pages/HelpCenter"));          // Help and support center
const ShippingInfo = lazy(() => import("./pages/ShippingInfo"));      // Shipping information
const Returns = lazy(() => import("./pages/Returns"));                // Returns and refunds policy
const Faq = lazy(() => import("./pages/Faq"));                      // Frequently Asked Questions page

// Authentication and dashboard pages
const CustomerLogin = lazy(() => import("./pages/CustomerLogin"));    // Customer login page
const CustomerSignup = lazy(() => import("./pages/CustomerSignup"));  // Customer registration page
const VendorLogin = lazy(() => import("./pages/VendorLogin"));        // Vendor login page
const VendorRegister = lazy(() => import("./pages/VendorRegister"));  // Vendor registration page
const VendorDashboard = lazy(() => import("./pages/VendorDashboard")); // Vendor management dashboard
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));    // Customer password reset page
const VendorForgotPassword = lazy(() => import("./pages/VendorForgotPassword")); // Vendor password reset page
const AdminLogin = lazy(() => import("./pages/AdminLogin"));          // Admin login page
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));  // Admin dashboard
const AuthCallback = lazy(() => import("./pages/AuthCallback"));      // OAuth callback page
const UpdateProfile = lazy(() => import("./pages/UpdateProfile"));    // Profile update page

// Utility components
import ProtectedAdminRoute from "./components/ProtectedAdminRoute"; // Route protection for admin access
import NotFound from "./pages/NotFound";              // 404 error page

// Create a new QueryClient instance for React Query
// This manages server state, caching, and background updates
const queryClient = new QueryClient();

import { HelmetProvider } from "react-helmet-async";
import AnalyticsTracker from "@/components/AnalyticsTracker";

// Main App component that sets up all providers and routing
// Uses a nested provider pattern for clean separation of concerns
const App = () => (
  // Internationalization provider for multi-language support
  <I18nextProvider i18n={i18n}>
    <HelmetProvider>
      {/* React Query provider for server state management */}
      <QueryClientProvider client={queryClient}>
        {/* Auth context provider for authentication state */}
        <AuthProvider>
          {/* Cart and wishlist providers for shopping experience state */}
          <CartProvider>
            <WishlistProvider>
              <ChatProvider>
                {/* Tooltip provider for enhanced UI interactions */}
                <TooltipProvider>
                  {/* Toast notification components for user feedback */}
                  <Toaster />
                  <Sonner />
                  {/* Browser router for client-side navigation */}
                  <BrowserRouter>
                    <ScrollToTop />
                    <AnalyticsTracker />
                    {/* Route definitions for all application pages */}
                    <Suspense
                      fallback={
                        <div className="flex min-h-screen items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      }
                    >
                    <Routes>
                      {/* Main marketplace routes */}
                      <Route path="/" element={<Index />} />                                    {/* Homepage */}
                      <Route path="/categories" element={<Categories />} />                    {/* Categories listing */}
                      <Route path="/category/:categoryName" element={<Category />} />          {/* Individual category with dynamic parameter */}
                      <Route path="/stores" element={<Stores />} />                            {/* Stores listing */}
                      <Route path="/store/:storeId" element={<Store />} />                     {/* Individual store with dynamic parameter */}
                      <Route path="/product/:productId" element={<ProductDetail />} />         {/* Product details with dynamic parameter */}
                      <Route path="/cart" element={<Cart />} />                                {/* Shopping cart */}
                      <Route path="/checkout" element={<Checkout />} />                        {/* Checkout process */}
                      <Route path="/checkout/success" element={<OrderSuccess />} />            {/* Order success */}
                      <Route path="/checkout/failure" element={<OrderFailure />} />            {/* Order failure */}
                      <Route path="/profile" element={<Navigate to="/customer/profile" replace />} /> {/* Old demo page; real profile requires login */}
                      <Route path="/customer/profile" element={<CustomerProfile />} />         {/* Customer profile */}
                      <Route path="/customer/address/add" element={<AddAddress />} />          {/* Add Address */}
                      <Route path="/vendor/profile" element={<VendorProfile />} />             {/* Vendor profile */}
                      <Route path="/search" element={<SearchResults />} />                     {/* Search results */}

                      {/* Information and legal pages */}
                      <Route path="/about" element={<About />} />                              {/* About page */}
                      <Route path="/contact" element={<Contact />} />                          {/* Contact page */}
                      <Route path="/privacy" element={<PrivacyPolicy />} />                    {/* Privacy policy */}
                      <Route path="/terms" element={<TermsOfService />} />                     {/* Terms of service */}
                      <Route path="/vendor-terms" element={<VendorTerms />} />                 {/* Vendor terms */}
                      <Route path="/cookies" element={<CookiePolicy />} />                     {/* Cookie policy */}
                      <Route path="/help" element={<HelpCenter />} />                          {/* Help center */}
                      <Route path="/shipping" element={<ShippingInfo />} />                    {/* Shipping information */}
                      <Route path="/returns" element={<Returns />} />                          {/* Returns policy */}
                      <Route path="/faq" element={<Faq />} />                                  {/* Frequently Asked Questions */}

                      {/* Authentication routes */}
                      <Route path="/customer/login" element={<CustomerLogin />} />             {/* Customer login */}
                      <Route path="/customer/signup" element={<CustomerSignup />} />           {/* Customer registration */}
                      <Route path="/vendor/login" element={<VendorLogin />} />                 {/* Vendor login */}
                      <Route path="/vendor/register" element={<VendorRegister />} />           {/* Vendor registration */}
                      <Route path="/forgot-password" element={<ForgotPassword />} />         {/* Customer forgot password */}
                      <Route path="/vendor/forgot-password" element={<VendorForgotPassword />} /> {/* Vendor forgot password */}
                      <Route path="/admin/login" element={<AdminLogin />} />                   {/* Admin login */}
                      <Route path="/auth/callback" element={<AuthCallback />} />               {/* OAuth callback */}
                      <Route path="/update-profile" element={<UpdateProfile />} />             {/* Profile update */}
                      <Route path="/logout" element={<LogoutConfirmation />} />                 {/* Logout confirmation */}

                      {/* Dashboard routes */}
                      <Route path="/customer/dashboard" element={<CustomerDashboard />} />     {/* Customer dashboard */}
                      <Route path="/vendor/dashboard" element={<VendorDashboard />} />         {/* Vendor dashboard */}
                      <Route path="/chat" element={<Chat />} />                                {/* Chat page */}
                      {/* Admin dashboard with route protection */}
                      <Route path="/admin/dashboard" element={
                        <ProtectedAdminRoute>
                          <AdminDashboard />
                        </ProtectedAdminRoute>
                      } />

                      {/* Catch-all route for 404 errors - MUST be last */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    </Suspense>
                    {/* Cookie consent component for GDPR compliance - rendered on all pages */}
                    <CookieConsent />
                  </BrowserRouter>
                </TooltipProvider>
              </ChatProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </I18nextProvider>
);

// Export the App component as the default export
export default App;
