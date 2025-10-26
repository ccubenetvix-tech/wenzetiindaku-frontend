// Import React hooks for state management
import { useState } from "react";
// Import i18next for internationalization support
import { useTranslation } from "react-i18next";
// Import Lucide React icons for UI elements
import { Search, ShoppingCart, User, Menu, Globe, LogIn, Store, LogOut, Settings } from "lucide-react";
// Import UI components from the design system
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Import custom components
import { LoginModal } from "@/components/LoginModal";
// Import React Router for navigation
import { useNavigate } from "react-router-dom";
// Import cart context for cart functionality
import { useCart } from "@/contexts/CartContext";
// Import auth context for authentication
import { useAuth } from "@/contexts/AuthContext";

// Supported languages for internationalization
// Includes major African languages and international languages
const languages = [
  { code: 'en', name: 'English' },      // English - primary language
  { code: 'fr', name: 'Français' },     // French - widely spoken in Africa
  { code: 'af', name: 'Afrikaans' },    // Afrikaans - South Africa
  { code: 'sw', name: 'Kiswahili' },    // Swahili - East Africa
  { code: 'zu', name: 'isiZulu' },      // Zulu - South Africa
  { code: 'yo', name: 'Yorùbá' }        // Yoruba - West Africa
];

/**
 * Header Component - Main navigation header for the marketplace
 * 
 * Features:
 * - Responsive design with mobile menu
 * - Multi-language support
 * - Search functionality
 * - Shopping cart with item count
 * - User authentication modal
 * - Premium styling with animations
 */
export function Header() {
  // Internationalization hooks
  const { t, i18n } = useTranslation();
  // Navigation hook for programmatic routing
  const navigate = useNavigate();
  // Cart context for cart functionality
  const { getTotalItems } = useCart();
  // Auth context for authentication
  const { user, logout, isAuthenticated } = useAuth();
  // Location context for location management
  
  // Local state management
  const [searchQuery, setSearchQuery] = useState("");           // Search input value
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Login modal visibility

  // Function to change the application language
  const changeLanguage = (lng: string) => {
    console.log('Changing language to:', lng);
    i18n.changeLanguage(lng);
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to search results page with encoded query
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Get current language object for display
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  console.log('Current language:', i18n.language, 'Translation test:', t('freeShippingOnOrders'));

  // Main navigation items - Simplified
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Stores', href: '/stores' },
    { name: 'Products', href: '/search' },
    { name: 'Categories', href: '/categories' },
  ];

  return (
    // Professional e-commerce header with clean design
    <header className="sticky top-0 z-50 bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-navy-800 shadow-sm">
      {/* Top utility bar - Professional */}
      <div className="bg-gray-50 dark:bg-navy-950 border-b border-gray-200 dark:border-navy-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-xs">
            <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400">
              <span className="hidden sm:inline">{t('freeShippingOnOrders')}</span>
              <span className="hidden md:inline text-gray-400">•</span>
              <span className="hidden md:inline">{t('customerSupport')}</span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Language Selector - Compact */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs hover:bg-gray-200 dark:hover:bg-navy-800 transition-colors">
                    <Globe className="h-3 w-3 mr-1" />
                    {currentLanguage.name}
                </Button>
              </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[120px]">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => changeLanguage(language.code)}
                      className={`text-xs ${i18n.language === language.code ? 'bg-accent' : ''}`}
                  >
                    {language.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
              <span className="text-gray-400 hidden sm:inline">|</span>
              <span className="text-gray-600 dark:text-gray-400 hidden sm:inline hover:text-navy-600 dark:hover:text-navy-300 cursor-pointer transition-colors">{t('helpSupport')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo section - Professional and clean */}
          <div className="flex-shrink-0">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/')}
            >
              <img 
                src="/marketplace.jpeg" 
                alt="WENZE TII NDAKU" 
                className="h-10 w-auto"
              />
              <div className="ml-3 hidden lg:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-navy-600 to-orange-500 bg-clip-text text-transparent">
                  WENZE TII NDAKU
                </h1>
              </div>
            </div>
          </div>

          {/* Center section - Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex">
                <Input
                  type="text"
                  placeholder={t('searchForProducts')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 h-10 pl-4 pr-12 border-2 border-gray-300 dark:border-navy-700 focus:border-navy-500 dark:focus:border-navy-400 rounded-l-md rounded-r-none"
                />
            <Button 
                  type="submit"
                  className="h-10 px-6 bg-navy-600 hover:bg-navy-700 text-white rounded-l-none rounded-r-md border-2 border-navy-600 hover:border-navy-700"
                >
                  <Search className="h-4 w-4" />
            </Button>
              </div>
            </form>
          </div>

          {/* Right section - User Account & Cart */}
          <div className="flex items-center space-x-2">
            {/* User Account */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 h-10 px-3 hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.profilePhoto} alt={user.firstName || user.businessName} />
                      <AvatarFallback className="bg-navy-100 text-navy-600 text-xs">
                        {(user.firstName || user.businessName || user.email).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <div className="text-xs text-gray-500">{t('hello')}</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.firstName || user.businessName || 'User'}
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate(user.role === 'customer' ? '/customer/dashboard' : '/vendor/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    {user.role === 'customer' ? t('My Dashboard') : t('Dashboard')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(user.role === 'customer' ? '/customer/profile' : '/vendor/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    {t('myProfile')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                className="flex items-center space-x-1 h-10 px-3 hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors"
                onClick={() => setIsLoginModalOpen(true)}
              >
                <User className="h-4 w-4" />
                <div className="hidden md:block text-left">
                  <div className="text-xs text-gray-500">{t('hello')}</div>
                  <div className="text-sm font-medium">{t('signIn')}</div>
                </div>
              </Button>
            )}

            {/* Cart */}
            <Button 
              variant="ghost" 
              className="relative flex items-center space-x-1 h-10 px-3 hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              <div className="hidden md:block text-left">
                <div className="text-xs text-gray-500">{t('cart')}</div>
                <div className="text-sm font-medium">{getTotalItems()}</div>
              </div>
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder={t('search')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </form>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-2">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.name === 'Home' ? '/' : item.href}
                        className="text-foreground hover:text-navy-600 dark:hover:text-navy-400 transition-colors duration-200 py-3 px-4 rounded-md hover:bg-gray-50 dark:hover:bg-navy-950/20 border-b border-gray-100 dark:border-navy-800"
                      >
                        {item.name}
                      </a>
                    ))}
                  </nav>

                  {/* Mobile Auth Options - Only show if not authenticated */}
                  {!isAuthenticated && (
                    <div className="pt-4 border-t border-gray-200 dark:border-navy-800">
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          onClick={() => navigate('/customer/login')}
                          className="w-full justify-start"
                        >
                          <LogIn className="mr-2 h-4 w-4" />
                          {t('customerLogin')}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => navigate('/vendor/login')}
                          className="w-full justify-start"
                        >
                          <Store className="mr-2 h-4 w-4" />
                          {t('sellerLogin')}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Navigation bar - Professional category navigation */}
      <div className="bg-navy-600 dark:bg-navy-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10">
            {/* Left side - Main navigation centered */}
            <nav className="flex items-center space-x-8 text-sm">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.name === 'Home' ? '/' : item.href}
                  className="text-white hover:text-orange-300 transition-colors duration-200 font-medium"
                >
                  {item.name}
                </a>
              ))}
            </nav>
            
            {/* Right side - Become Seller - Only show if not authenticated or not a vendor */}
            {(!isAuthenticated || (isAuthenticated && user?.role !== 'vendor')) && (
              <div className="flex items-center">
                <a href="/vendor/register" className="text-orange-300 hover:text-orange-200 transition-colors duration-200 font-medium">
                  {t('becomeSeller')}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </header>
  );
}
