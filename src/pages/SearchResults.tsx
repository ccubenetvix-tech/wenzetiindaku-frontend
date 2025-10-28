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
import { Loader2 } from "lucide-react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";

  // Products state
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [refineSearch, setRefineSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sortByValue, setSortByValue] = useState("relevance");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const response: any = await apiClient.getAllProducts({
          search: query,
          category: categoryParam || undefined,
          limit: 100
        });
        
        if (response.success && response.data) {
          setAllProducts(response.data.products || []);
        } else {
          setAllProducts([]);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [query, categoryParam]);

  // Apply client-side filters
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by search query
    const searchQuery = refineSearch || query;
    if (searchQuery) {
      filtered = filterBySearch(filtered, searchQuery, ['name', 'description', 'category', 'vendor']);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
                    filtered = filtered.filter((product: any) => product.category === selectedCategory);
    }

    // Filter by price range
    if (minPrice) {
      filtered = filtered.filter((product: any) => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((product: any) => product.price <= parseFloat(maxPrice));
    }

    // Filter by minimum rating
    if (minRating > 0) {
      filtered = filtered.filter((product: any) => (product.rating || 0) >= minRating);
    }

    // Sort products
    filtered = sortBy(filtered, sortByValue);

    return filtered;
  }, [allProducts, query, refineSearch, selectedCategory, minPrice, maxPrice, minRating, sortByValue]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
                {categoryParam ? `Products in ${categoryParam}` : (query ? `${t('searchResults')} "${query}"` : "All Products")}
              </h1>
            </div>
            <p className="text-muted-foreground">
              Found {filteredProducts.length} {query ? `results for "${query}"` : "products"}
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
                      <SelectItem value="Technology & Electronics">Electronics</SelectItem>
                      <SelectItem value="Clothing & Fashion">Fashion & Clothing</SelectItem>
                      <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                      <SelectItem value="Cosmetics & Beauty">Cosmetics & Beauty</SelectItem>
                      <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                      <SelectItem value="Sports & Outdoors">Sports & Outdoors</SelectItem>
                      <SelectItem value="Food & Beverages">Food & Beverages</SelectItem>
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
                {filteredProducts.filter(p => p.isFeatured || p.is_featured).length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      <Star className="h-5 w-5 text-secondary mr-2" />
                      Promoted Results
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                      {filteredProducts.filter(p => p.isFeatured || p.is_featured).map((product) => (
                        <ProductCard 
                          key={product.id}
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          originalPrice={product.original_price}
                          rating={product.rating || 0}
                          reviewCount={product.review_count || 0}
                          image={product.images?.[0] || product.image || "/marketplace.jpeg"}
                          vendor={product.vendor?.business_name || product.vendor || "Unknown Vendor"}
                          isNew={product.is_new || product.isNew || false}
                          isFeatured={product.is_featured || product.isFeatured || false}
                        />
                      ))}
                    </div>
                  </div>
                )}

              {/* All Results */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Grid className="h-5 w-5 text-primary mr-2" />
                  All Results
                </h2>
                
                {paginatedProducts.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                      {paginatedProducts.map((product: any) => (
                        <ProductCard 
                          key={product.id}
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          originalPrice={product.original_price}
                          rating={product.rating || 0}
                          reviewCount={product.review_count || 0}
                          image={product.images?.[0] || product.image || "/marketplace.jpeg"}
                          vendor={product.vendor?.business_name || product.vendor || "Unknown Vendor"}
                          isNew={product.is_new || product.isNew || false}
                          isFeatured={product.is_featured || product.isFeatured || false}
                        />
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
                          ? `No products found for "${query}".`
                          : `No products available at the moment.`
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