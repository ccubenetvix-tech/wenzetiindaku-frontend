import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Filter,
  Grid3X3,
  List,
  Star,
  TrendingUp,
  Search,
  Loader2,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { apiClient } from "@/utils/api";
import { predefinedCategories } from "@/data/categories";

const Category = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // React Router already decodes URL params
  const categoryId = categoryName || '';

  // Get category info with case-insensitive search as fallback
  const category = predefinedCategories.find(cat => 
    cat.id === categoryId
  );

  // Load products for this category
  useEffect(() => {
    const loadProducts = async () => {
      if (!categoryId) return;
      
      try {
        setIsLoading(true);
        
        const response = await apiClient.getAllProducts({
          category: categoryId,
          page: currentPage,
          limit: 12,
          search: searchQuery || undefined,
          sortBy,
          sortOrder
        });
        
        if (response.success) {
          setProducts(response.data.products || []);
          setTotalPages(response.data.pagination?.totalPages || 1);
        } else {
          console.error('Error loading products:', response.error);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [categoryId, currentPage, searchQuery, sortBy, sortOrder]);

  // Create a fallback category if not found
  const displayCategory = category || {
    id: categoryId,
    name: categoryId || 'Unknown Category',
    description: 'Products in this category',
    icon: '📦'
  };

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    
    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);
  
  // If no category found and no products, show error; otherwise show products
  const showNotFound = !category && !isLoading && products.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-navy-950">
      <Header />
      
      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-0">
                {displayCategory.icon ? (
                  <span className="text-3xl mr-2">{displayCategory.icon}</span>
                ) : null}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-0">
                    {displayCategory.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-0">
                    {displayCategory.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-4">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="created_at-desc">Newest First</option>
                  <option value="created_at-asc">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 dark:border-gray-600 rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-4 py-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading products...</span>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className={`grid ${viewMode === 'grid' ? 'gap-4' : 'gap-6'} ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1"
              }`}>
              {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price || 0}
                    originalPrice={product.original_price}
                    rating={product.rating || 0}
                    reviewCount={product.review_count || 0}
                    image={product.images?.[0] || product.image || "/marketplace.jpeg"}
                    vendor={product.vendor?.business_name || "Unknown Vendor"}
                    isNew={product.is_new || false}
                    isFeatured={product.is_featured || false}
                    compact={viewMode === 'grid'}
                  />
              ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Products Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {searchQuery 
                  ? `No products found for "${searchQuery}" in ${displayCategory.name}`
                  : `No products available in ${displayCategory.name} yet.`
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => navigate('/vendor/signup')}>
                  Become a Vendor
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Category;