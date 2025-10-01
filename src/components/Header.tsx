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

  // Main navigation items with internationalized labels
  const navigation = [
    { name: t('home'), href: '/' },           // Homepage
    { name: t('categories'), href: '/categories' }, // Categories page
    { name: t('stores'), href: '/stores' },   // Stores page
  ];

  return (
    // Sticky header with premium styling and backdrop blur
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-navy-900/95 backdrop-blur-md border-b border-navy-100 dark:border-navy-800 shadow-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-20">
          {/* Premium Logo section with enhanced styling */}
          <div className="flex-shrink-0 mr-8">
            <div 
              className="flex items-center cursor-pointer group"
              onClick={() => navigate('/')}  // Navigate to homepage on logo click
            >
              {/* Marketplace logo image */}
              <img 
                src="/marketplace.jpeg" 
                alt="WENZE TII NDAKU" 
                className="h-16 w-auto transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-2xl"
              />
              {/* Logo text - hidden on smaller screens */}
              <div className="ml-3 hidden lg:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-navy-500 to-orange-500 bg-clip-text text-transparent">
                  WENZE TII NDAKU
                </h1>
                <p className="text-xs text-muted-foreground font-medium">Premium Marketplace</p>
              </div>
            </div>
          </div>

          {/* Premium Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 mr-auto">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.name === 'home' ? '/' : item.href}
                className="text-navy-600 dark:text-navy-300 hover:text-orange-500 dark:hover:text-orange-400 transition-all duration-300 font-semibold relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-navy-500 to-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Premium Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-navy-400 h-5 w-5" />
              <Input
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 w-full rounded-xl border-2 border-navy-100 dark:border-navy-800 focus:border-navy-500 dark:focus:border-navy-400 bg-white/80 dark:bg-navy-800/80 backdrop-blur-sm shadow-lg focus:shadow-xl transition-all duration-300"
              />
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Premium Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-navy-50 dark:hover:bg-navy-800/50 transition-all duration-300">
                  <Globe className="h-4 w-4 text-navy-500" />
                  <span className="hidden sm:inline text-navy-600 dark:text-navy-300 font-medium">{currentLanguage.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover z-50">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => changeLanguage(language.code)}
                    className={`cursor-pointer ${
                      i18n.language === language.code ? 'bg-accent' : ''
                    }`}
                  >
                    {language.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>


            {/* Premium Cart with enhanced styling */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-navy-50 dark:hover:bg-navy-800/50 transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-6 w-6 text-navy-500" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center shadow-xl font-bold animate-pulse">
                {getTotalItems()}
              </span>
            </Button>

            {/* Premium User Menu */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-navy-50 dark:hover:bg-navy-800/50 transition-all duration-300"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profilePhoto} alt={user.firstName || user.businessName} />
                      <AvatarFallback className="bg-gradient-to-r from-navy-500 to-orange-500 text-white text-sm font-semibold">
                        {(user.firstName || user.businessName || user.email).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-foreground">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user.businessName || user.email
                      }
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(user.role === 'customer' ? '/customer/profile' : '/vendor/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {user.role === 'vendor' && (
                    <DropdownMenuItem onClick={() => navigate('/vendor/dashboard')}>
                      <Store className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-navy-50 dark:hover:bg-navy-800/50 transition-all duration-300"
                onClick={() => setIsLoginModalOpen(true)}
              >
                <User className="h-6 w-6 text-navy-500" />
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
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
                        href={item.name === 'home' ? '/' : item.href}
                        className="text-foreground hover:text-navy-600 dark:hover:text-navy-400 transition-colors duration-200 py-2 px-4 rounded-md hover:bg-navy-50 dark:hover:bg-navy-950/20"
                      >
                        {item.name}
                      </a>
                    ))}
                  </nav>

                  {/* Mobile Login Options */}
                  <div className="pt-4 border-t border-muted-foreground/20">
                    <p className="text-sm font-medium text-foreground mb-3">Login Options</p>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        onClick={() => navigate('/customer/login')}
                        className="w-full justify-start"
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Customer Login
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate('/vendor/login')}
                        className="w-full justify-start"
                      >
                        <Store className="mr-2 h-4 w-4" />
                        Vendor Login
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
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