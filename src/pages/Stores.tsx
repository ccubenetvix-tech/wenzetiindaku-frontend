/**
 * Stores.tsx - Stores Listing Page Component
 * 
 * This page displays a comprehensive list of all stores/vendors in the marketplace.
 * It includes search functionality, filters, and detailed store information cards.
 * 
 * Features:
 * - Page header with navigation back to home
 * - Search and filter functionality
 * - Grid layout of store cards
 * - Store information including ratings, location, categories
 * - Store policies display
 * - Action buttons for visiting store and messaging
 * 
 * @author WENZE TII NDAKU Team
 * @version 1.0.0
 */

// Import React hooks and utilities
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next"; // For internationalization support
import { useNavigate } from "react-router-dom"; // For programmatic navigation

// Import Lucide React icons for UI elements
import { 
  Store,           // Store icon for store avatars
  Star,            // Star icon for ratings
  MapPin,          // Map pin icon for location
  MessageCircle,   // Message icon for messaging functionality
  ArrowLeft,       // Back arrow for navigation
  Search,          // Search icon for search input
  Filter,          // Filter icon for filter button
  Grid3X3,         // Grid icon for grid view
  List             // List icon for list view
} from "lucide-react";

// Import UI components
import { Button } from "@/components/ui/button"; // Reusable button component
import { Input } from "@/components/ui/input";   // Input field component
import { Header } from "@/components/Header";    // Site header with navigation
import { Footer } from "@/components/Footer";    // Site footer

// Import data sources
import { stores } from "@/data/stores"; // Static stores data

/**
 * Stores Component - Stores Listing Page
 * 
 * Renders a comprehensive stores listing page with:
 * - Page header with back navigation
 * - Search and filter controls
 * - Grid of store cards with detailed information
 * - Store policies and action buttons
 * 
 * @returns {JSX.Element} Complete stores listing page layout
 */
export default function Stores() {
  // Initialize translation hook for internationalization
  const { t } = useTranslation();
  
  // Initialize navigation hook for programmatic routing
  const navigate = useNavigate();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Filter stores based on search query
  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) {
      return stores;
    }
    
    const query = searchQuery.toLowerCase();
    return stores.filter(store => 
      store.name.toLowerCase().includes(query) ||
      store.description.toLowerCase().includes(query) ||
      store.location.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    // Main page container with full height and flex layout
    <div className="min-h-screen flex flex-col bg-background">
      {/* Site header with navigation menu */}
      <Header />
      
      {/* Main content area that takes remaining space */}
      <main className="flex-1">
        {/* Page Header Section - Hero area with title and navigation */}
        <section className="bg-gradient-to-r from-navy-50 to-orange-50 dark:from-navy-950/10 dark:to-orange-950/10 py-12">
          <div className="container mx-auto px-4">
            {/* Back navigation button */}
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/')} // Navigate back to home page
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
            
            {/* Page title and description */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Our Stores
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover amazing vendors and stores from across Africa and beyond
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filters Section */}
        <section className="py-6 border-b border-muted">
          <div className="container mx-auto px-4">
            {/* Controls container with responsive layout */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Left side controls - Filters and view options */}
              <div className="flex items-center gap-4">
                {/* Filter button */}
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                
                {/* View toggle buttons */}
                <div className="flex items-center gap-2">
                  {/* Grid view button */}
                  <Button variant="outline" size="sm">
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  
                  {/* List view button */}
                  <Button variant="outline" size="sm">
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Right side - Search input */}
              <div className="relative w-full sm:w-80">
                <Input
                  type="text"
                  placeholder="Search stores..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {/* Search icon positioned inside input */}
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </section>

        {/* Stores Grid Section - Main content area */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Stores grid with responsive columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Map through stores array and render store card for each */}
              {filteredStores.map((store) => (
                <div key={store.id} className="card card-hover p-6">
                  {/* Store Header - Avatar, name, and basic info */}
                  <div className="flex items-start gap-4 mb-6">
                    {/* Store avatar with gradient background */}
                    <div className="w-20 h-20 bg-gradient-to-br from-navy-100 to-orange-100 dark:from-navy-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Store className="h-10 w-10 text-navy-600 dark:text-navy-400" />
                    </div>
                    
                    {/* Store information container */}
                    <div className="flex-1 min-w-0">
                      {/* Store name with verification and featured badges */}
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-foreground truncate">
                          {store.name}
                        </h3>
                        
                        {/* Verified badge - shown if store is verified */}
                        {store.verified && (
                          <div className="w-5 h-5 status-verified rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                        
                        {/* Featured badge - shown if store is featured */}
                        {store.featured && (
                          <span className="status-featured text-xs px-2 py-1 rounded-full whitespace-nowrap">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      {/* Store description with line clamp for consistent height */}
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {store.description}
                      </p>
                      
                      {/* Store stats - rating, products, followers */}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        {/* Rating display */}
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 star-filled" />
                          <span>{store.rating}</span>
                          <span>({store.reviewCount})</span>
                        </div>
                        
                        {/* Separator - hidden on small screens */}
                        <span className="hidden sm:inline">•</span>
                        
                        {/* Product count */}
                        <span>{store.productCount} products</span>
                        
                        {/* Separator - hidden on small screens */}
                        <span className="hidden sm:inline">•</span>
                        
                        {/* Follower count with locale formatting */}
                        <span>{store.followers.toLocaleString()} followers</span>
                      </div>
                    </div>
                  </div>

                  {/* Store Details - Location information */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm mb-4">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{store.location}</span>
                    </div>
                  </div>

                  {/* Categories and Specialties Section */}
                  <div className="mb-6">
                    {/* Categories subsection */}
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-foreground mb-2">Categories</h4>
                      {/* Categories tags with responsive wrapping */}
                      <div className="flex flex-wrap gap-2">
                        {store.categories.map((category, index) => (
                          <span
                            key={index}
                            className="bg-navy-100 dark:bg-navy-900/20 text-navy-800 dark:text-navy-300 text-xs px-2 py-1 rounded-full whitespace-nowrap border border-navy-200 dark:border-navy-800"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Specialties subsection */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Specialties</h4>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        {store.specialties.join(", ")}
                      </div>
                    </div>
                  </div>

                  {/* Store Policies Section */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-foreground mb-3">Store Policies</h4>
                    {/* Policies grid with responsive columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      {/* Shipping policy */}
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="font-medium text-foreground mb-1">Shipping</div>
                        <div className="text-muted-foreground leading-relaxed">{store.shipping}</div>
                      </div>
                      
                      {/* Return policy */}
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="font-medium text-foreground mb-1">Returns</div>
                        <div className="text-muted-foreground leading-relaxed">{store.returnPolicy}</div>
                      </div>
                      
                      {/* Response time policy */}
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="font-medium text-foreground mb-1">Response</div>
                        <div className="text-muted-foreground leading-relaxed">Quick response</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Section */}
                  <div className="flex gap-3">
                    {/* Visit Store button - primary action */}
                    <Button 
                      onClick={() => navigate(`/store/${store.id}`)} // Navigate to individual store page
                      className="flex-1 bg-gradient-to-r from-navy-600 to-navy-700 hover:from-navy-700 hover:to-navy-800 text-white shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      Visit Store
                    </Button>
                    
                    {/* Message Store button - secondary action */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-200 hover:shadow-sm"
                      onClick={() => {
                        // TODO: Implement message store functionality
                        console.log(`Message store: ${store.name}`);
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message Store
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredStores.length === 0 && searchQuery && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No stores found for "{searchQuery}"
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Site footer */}
      <Footer />
    </div>
  );
}