import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, Filter, Grid, Star, SlidersHorizontal } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filterBySearch, sortBy } from "@/utils";
import { apiClient } from "@/utils/api";
import { useLocation } from "@/contexts/LocationContext";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { selectedLocation } = useLocation();
  const query = searchParams.get("q") || "";

  // Filter state
  const [refineSearch, setRefineSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sortByValue, setSortByValue] = useState("relevance");
  
  // API state
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const locationString = selectedLocation ? `${selectedLocation.city}, ${selectedLocation.state}` : undefined;
        const searchQuery = refineSearch || query;
        
        const response = await apiClient.getAllProducts({
          location: locationString,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          search: searchQuery,
          page: currentPage,
          limit: 20,
          sortBy: sortByValue === "relevance" ? "created_at" : sortByValue,
          sortOrder: sortByValue === "price-low" ? "asc" : "desc"
        });
        
        if (response.success) {
          setProducts(response.data.products);
          setTotalPages(response.data.pagination.totalPages);
        } else {
          setError(response.error?.message || 'Failed to load products');
        }
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [query, refineSearch, selectedCategory, selectedLocation, currentPage, sortByValue]);

  // Apply client-side filters for price and rating (since these are not handled by the API yet)
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by price range
    if (minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(maxPrice));
    }

    // Filter by minimum rating
    if (minRating > 0) {
      filtered = filtered.filter(product => product.rating >= minRating);
    }

    return filtered;
  }, [products, minPrice, maxPrice, minRating]);

  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setRefineSearch("");
    setSelectedCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setSortByValue("relevance");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Search className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">
                {t('searchResults')} "{query}"
              </h1>
            </div>
            <p className="text-muted-foreground">
              Found {filteredProducts.length} results for "{query}"
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-1/4">
              <div className="bg-card p-6 rounded-lg shadow-sm mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Filters</h3>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
                
                {/* Search within results */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Refine Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search in results..."
                      className="pl-10"
                      value={refineSearch}
                      onChange={(e) => setRefineSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="cosmetics">Cosmetics</SelectItem>
                      <SelectItem value="tech">Tech Products</SelectItem>
                      <SelectItem value="clothes">Clothes</SelectItem>
                      <SelectItem value="toys">Toys</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="beverages">Beverages</SelectItem>
                      <SelectItem value="para-pharmacy">Para-Pharmacy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input 
                        type="number" 
                        placeholder="Min" 
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                      <Input 
                        type="number" 
                        placeholder="Max" 
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Minimum Rating
                  </label>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input 
                          type="radio" 
                          name="rating" 
                          className="mr-2" 
                          checked={minRating === rating}
                          onChange={() => setMinRating(rating)}
                        />
                        <div className="flex items-center">
                          {[...Array(rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="ml-1 text-sm">& up</span>
                        </div>
                      </label>
                    ))}
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="rating" 
                        className="mr-2" 
                        checked={minRating === 0}
                        onChange={() => setMinRating(0)}
                      />
                      <span className="text-sm">Any rating</span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>

            {/* Search Results */}
            <div className="lg:w-3/4">
              {/* Sort and View Options */}
              <div className="bg-card p-4 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {filteredProducts.length} results
                    </span>
                    <Badge variant="secondary">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Sort by:</span>
                    </div>
                    <Select value={sortByValue} onValueChange={setSortByValue}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Relevance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="alpha">Alphabetical</SelectItem>
                        <SelectItem value="alpha-reverse">Reverse Alphabetical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Promoted Results */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Star className="h-5 w-5 text-secondary mr-2" />
                  Promoted Results
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.filter(p => p.isFeatured).map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </div>

              {/* All Results */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Grid className="h-5 w-5 text-primary mr-2" />
                  All Results
                  {selectedLocation && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      in {selectedLocation.name}
                    </span>
                  )}
                </h2>
                
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 w-full mb-3"></div>
                        <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-3/4 mb-2"></div>
                        <div className="bg-gray-200 dark:bg-gray-700 rounded h-3 w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="text-red-500 mb-4">
                      <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">Error loading products</h3>
                      <p className="text-sm">{error}</p>
                    </div>
                    <Button onClick={() => window.location.reload()}>
                      Try Again
                    </Button>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.map((product) => (
                        <ProductCard key={product.id} {...product} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-8">
                        <Button 
                          variant="outline" 
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <span className="px-4 py-2 text-sm">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button 
                          variant="outline" 
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-500 dark:text-gray-400 mb-4">
                      <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">No products found</h3>
                      <p className="text-sm">
                        {query 
                          ? `No products found for "${query}"${selectedLocation ? ` in ${selectedLocation.name}` : ''}.`
                          : `No products available${selectedLocation ? ` in ${selectedLocation.name}` : ''} at the moment.`
                        }
                      </p>
                    </div>
                    <Button onClick={() => window.location.href = '/'}>
                      Browse All Products
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;