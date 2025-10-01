// Import UI notification components for toast messages
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
// Import tooltip provider for enhanced UI interactions
import { TooltipProvider } from "@/components/ui/tooltip";
// Import React Query for server state management and caching
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Import React Router for client-side routing and navigation
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Import i18next for internationalization support
import { I18nextProvider } from "react-i18next";
// Import cart context provider for global cart state management
import { CartProvider } from "@/contexts/CartContext";
// Import auth context provider for authentication state management
import { AuthProvider } from "@/contexts/AuthContext";
// Import cookie consent component for GDPR compliance
import { CookieConsent } from "@/components/CookieConsent";
// Import i18n configuration for multi-language support
import i18n from "./lib/i18n";
// Import all page components for routing
// Main marketplace pages
import Index from "./pages/Index";                    // Homepage with hero section and featured content
import Category from "./pages/Category";              // Individual category page with products
import Categories from "./pages/Categories";          // Categories listing page
import Store from "./pages/Store";                    // Individual store page
import Stores from "./pages/Stores";                  // Stores listing page
import ProductDetail from "./pages/ProductDetail";    // Product details and purchase page
import Cart from "./pages/Cart";                      // Shopping cart page
import Checkout from "./pages/Checkout";              // Checkout and payment page
import Profile from "./pages/Profile";                // User profile management
import CustomerProfile from "./pages/CustomerProfile"; // Customer profile management
import VendorProfile from "./pages/VendorProfile";     // Vendor profile management
import SearchResults from "./pages/SearchResults";    // Search results page

// Information and legal pages
import About from "./pages/About";                    // About the marketplace
import Contact from "./pages/Contact";                // Contact information and form
import PrivacyPolicy from "./pages/PrivacyPolicy";    // Privacy policy page
import TermsOfService from "./pages/TermsOfService";  // Terms of service page
import CookiePolicy from "./pages/CookiePolicy";      // Cookie policy page
import HelpCenter from "./pages/HelpCenter";          // Help and support center
import FAQs from "./pages/FAQs";                      // Frequently asked questions
import ShippingInfo from "./pages/ShippingInfo";      // Shipping information
import Returns from "./pages/Returns";                // Returns and refunds policy

// Authentication and dashboard pages
import CustomerLogin from "./pages/CustomerLogin";    // Customer login page
import CustomerSignup from "./pages/CustomerSignup";  // Customer registration page
import VendorLogin from "./pages/VendorLogin";        // Vendor login page
import VendorRegister from "./pages/VendorRegister";  // Vendor registration page
import VendorDashboard from "./pages/VendorDashboard"; // Vendor management dashboard
import AdminLogin from "./pages/AdminLogin";          // Admin login page
import AdminDashboard from "./pages/AdminDashboard";  // Admin dashboard
import AuthCallback from "./pages/AuthCallback";      // OAuth callback page
import UpdateProfile from "./pages/UpdateProfile";    // Profile update page

// Utility components
import ProtectedAdminRoute from "./components/ProtectedAdminRoute"; // Route protection for admin access
import NotFound from "./pages/NotFound";              // 404 error page

// Create a new QueryClient instance for React Query
// This manages server state, caching, and background updates
const queryClient = new QueryClient();

// Main App component that sets up all providers and routing
// Uses a nested provider pattern for clean separation of concerns
const App = () => (
  // Internationalization provider for multi-language support
  <I18nextProvider i18n={i18n}>
    {/* React Query provider for server state management */}
    <QueryClientProvider client={queryClient}>
      {/* Auth context provider for authentication state */}
      <AuthProvider>
        {/* Cart context provider for global shopping cart state */}
        <CartProvider>
        {/* Tooltip provider for enhanced UI interactions */}
        <TooltipProvider>
          {/* Toast notification components for user feedback */}
          <Toaster />
          <Sonner />
          {/* Browser router for client-side navigation */}
          <BrowserRouter>
            {/* Route definitions for all application pages */}
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
              <Route path="/profile" element={<Profile />} />                          {/* User profile */}
              <Route path="/customer/profile" element={<CustomerProfile />} />         {/* Customer profile */}
              <Route path="/vendor/profile" element={<VendorProfile />} />             {/* Vendor profile */}
              <Route path="/search" element={<SearchResults />} />                     {/* Search results */}
              
              {/* Information and legal pages */}
              <Route path="/about" element={<About />} />                              {/* About page */}
              <Route path="/contact" element={<Contact />} />                          {/* Contact page */}
              <Route path="/privacy" element={<PrivacyPolicy />} />                    {/* Privacy policy */}
              <Route path="/terms" element={<TermsOfService />} />                     {/* Terms of service */}
              <Route path="/cookies" element={<CookiePolicy />} />                     {/* Cookie policy */}
              <Route path="/help" element={<HelpCenter />} />                          {/* Help center */}
              <Route path="/faqs" element={<FAQs />} />                                {/* FAQ page */}
              <Route path="/shipping" element={<ShippingInfo />} />                    {/* Shipping information */}
              <Route path="/returns" element={<Returns />} />                          {/* Returns policy */}
              
              {/* Authentication routes */}
              <Route path="/customer/login" element={<CustomerLogin />} />             {/* Customer login */}
              <Route path="/customer/signup" element={<CustomerSignup />} />           {/* Customer registration */}
              <Route path="/vendor/login" element={<VendorLogin />} />                 {/* Vendor login */}
              <Route path="/vendor/register" element={<VendorRegister />} />           {/* Vendor registration */}
              <Route path="/admin/login" element={<AdminLogin />} />                   {/* Admin login */}
              <Route path="/auth/callback" element={<AuthCallback />} />               {/* OAuth callback */}
              <Route path="/update-profile" element={<UpdateProfile />} />             {/* Profile update */}
              
              {/* Dashboard routes */}
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />         {/* Vendor dashboard */}
              {/* Admin dashboard with route protection */}
              <Route path="/admin/dashboard" element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              } />
              
              {/* Catch-all route for 404 errors - MUST be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* Cookie consent component for GDPR compliance - rendered on all pages */}
            <CookieConsent />
          </BrowserRouter>
        </TooltipProvider>
          </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </I18nextProvider>
);

// Export the App component as the default export
export default App;
