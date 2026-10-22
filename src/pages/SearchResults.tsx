import { useState, useMemo, useEffect } from "react";
import { categoryLabel } from "@/lib/format";
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
import { apiClient } from "@/utils/api";
import { PageLoader } from "@/components/PageLoader";
import { useLoaderTransition } from "@/hooks/useLoaderTransition";
import { cn } from "@/lib/utils";
import { predefinedCategories } from "@/data/categories";
import { trackSearch } from "@/lib/analytics";
import { matchesSearch } from "@/lib/productSearch";

// New products get a default rating in the database; only count ratings backed by reviews.
const realRating = (p: any) => (Number(p.review_count) > 0 ? Number(p.rating) || 0 : 0);

// Sort options shown in the "Sort by" menu. "relevance" keeps the order returned by the API.
const sortProducts = (products: any[], sortOption: string) => {
  const byName = (a: any, b: any) => String(a.name || "").localeCompare(String(b.name || ""), undefined, { sensitivity: "base" });
  const price = (p: any) => Number(p.price) || 0;
  const rating = (p: any) => realRating(p);
  const sorted = [...products];
  switch (sortOption) {
    case "price-low":
      return sorted.sort((a, b) => price(a) - price(b));
    case "price-high":
      return sorted.sort((a, b) => price(b) - price(a));
    case "rating":
      return sorted.sort((a, b) => rating(b) - rating(a) || (Number(b.review_count) || 0) - (Number(a.review_count) || 0));
    case "alpha":
      return sorted.sort(byName);
    case "alpha-reverse":
      return sorted.sort((a, b) => byName(b, a));
    default:
      return sorted;
  }
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";

  // Products state
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isMounted: showLoader, isFadingOut } = useLoaderTransition(isLoading, {
    minimumVisibleMs: 1600,
    fadeDurationMs: 400,
  });
  const contentVisibilityClass =
    showLoader && !isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100";

  // Filter state
  const [refineSearch, setRefineSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sortByValue, setSortByValue] = useState("relevance");
  // On phones the filters are hidden behind a button so products show first.
  const [showFiltersOnMobile, setShowFiltersOnMobile] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Follow the category in the URL when the user navigates between categories.
  useEffect(() => {
    setSelectedCategory(categoryParam || "all");
  }, [categoryParam]);

  // Any change to the filters or sort order starts again from the first page,
  // otherwise a narrower result set can leave the user on an empty page.
  useEffect(() => {
    setCurrentPage(1);
  }, [query, refineSearch, selectedCategory, minPrice, maxPrice, minRating, sortByValue]);

  // Fetch products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        // Load the whole catalogue (page by page) and search it here: the API only
        // matches the exact phrase, which misses multi-word searches and typos.
        const pageSize = 200;
        const loaded: any[] = [];
        for (let page = 1; ; page++) {
          const response: any = await apiClient.getAllProducts({
            category: categoryParam || undefined,
            limit: pageSize,
            page,
          });
          if (!response.success || !response.data) break;
          const batch = response.data.products || [];
          loaded.push(...batch);
          const totalPages = response.data.pagination?.totalPages ?? 1;
          if (page >= totalPages || batch.length === 0) break;
        }
        setAllProducts(loaded);
      } catch (error) {
        console.error('Error loading products:', error);
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [categoryParam]);

  useEffect(() => {
    trackSearch(query);
  }, [query]);

  // Apply client-side filters
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by the search query and the "refine search" box (both must match)
    const searchText = `${query} ${refineSearch}`.trim();
    if (searchText) {
      filtered = filtered.filter((product: any) =>
        matchesSearch(searchText, [
          product.name,
          product.description,
          product.category,
          categoryLabel(product.category),
          product.vendor?.business_name ?? product.vendor,
        ]),
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product: any) => product.category === selectedCategory);
    }

    // Filter by price range
    if (minPrice) {
      filtered = filtered.filter((product: any) => Number(product.price) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((product: any) => Number(product.price) <= parseFloat(maxPrice));
    }

    // Filter by minimum rating
    if (minRating > 0) {
      filtered = filtered.filter((product: any) => realRating(product) >= minRating);
    }

    // Sort products
    filtered = sortProducts(filtered, sortByValue);

    return filtered;
  }, [allProducts, query, refineSearch, selectedCategory, minPrice, maxPrice, minRating, sortByValue]);

  // Show the top of the results when moving to another page.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const clearFilters = () => {
    setRefineSearch("");
    setSelectedCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setSortByValue("relevance");
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="relative flex-1">
        {showLoader && (
          <PageLoader
            variant="product"
            title={t('loadingProducts')}
            subtitle={t('loadingProductsSubtitle')}
            fadingOut={isFadingOut}
          />
        )}

        <div
          className={cn(
            "min-h-full flex flex-col transition-opacity duration-500",
            contentVisibilityClass
          )}
        >
          <div className="container mx-auto px-4 pt-4 pb-8 flex-1">
            {/* Header Section - aligned with controls */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <Search className="h-6 w-6 text-primary" />
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {categoryParam ? `${t('productsIn')} ${categoryLabel(categoryParam)}` : (query ? `${t('searchResults')} "${query}"` : t('allProducts'))}
                  </h1>
                </div>

                {/* Sort and View Options - aligned on same line */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{t('sortBy')}:</span>
                  </div>
                  <Select value={sortByValue} onValueChange={setSortByValue}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder={t('relevance')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">{t('relevance')}</SelectItem>
                      <SelectItem value="price-low">{t('priceLowToHigh')}</SelectItem>
                      <SelectItem value="price-high">{t('priceHighToLow')}</SelectItem>
                      <SelectItem value="rating">{t('highestRated')}</SelectItem>
                      <SelectItem value="alpha">{t('alphabetical')}</SelectItem>
                      <SelectItem value="alpha-reverse">{t('reverseAlphabetical')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results count and Featured */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} {t('results')}
                </span>
                <Badge variant="secondary">
                  <Star className="h-3 w-3 mr-1" />
                  {t('featuredBadge')}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside className="lg:w-1/4">
                <Button
                  variant="outline"
                  className="w-full mb-4 lg:hidden"
                  onClick={() => setShowFiltersOnMobile((open) => !open)}
                  aria-expanded={showFiltersOnMobile}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFiltersOnMobile ? t('hideFilters') : t('filters')}
                </Button>
                <div className={cn("bg-card p-6 rounded-lg shadow-sm mb-6", !showFiltersOnMobile && "hidden lg:block")}>
                  {/* Search within results */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      {t('refineSearch')}
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        type="text"
                        placeholder={t('searchInResults')}
                        className="pl-10"
                        value={refineSearch}
                        onChange={(e) => setRefineSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      {t('categories')}
                    </label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('allCategories')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('allCategories')}</SelectItem>
                        {predefinedCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {t(cat.name)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>


                  {/* Price Range */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      {t('priceRange')}
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder={t('min')}
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder={t('max')}
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      {t('minimumRating')}
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
                            <span className="ml-1 text-sm">{t('andUp')}</span>
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
                        <span className="text-sm">{t('anyRating')}</span>
                      </label>
                    </div>
                  </div>

                  {/* Clear All Button */}
                  <div className="mt-6 pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
                      {t('clearAll')}
                    </Button>
                  </div>
                </div>
              </aside>

              {/* Search Results */}
              <div className="lg:w-3/4">
                {/* Promoted Results */}
                {filteredProducts.filter(p => p.isFeatured || p.is_featured).length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      <Star className="h-5 w-5 text-secondary mr-2" />
                      {t('promotedResults')}
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
                          vendor={product.vendor?.business_name || product.vendor || t('unknownVendor')}
                          isNew={product.is_new || product.isNew || false}
                          isFeatured={product.is_featured || product.isFeatured || false}

                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* All Results */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Grid className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold">{t('allResults')}</h2>
                  </div>

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
                            vendor={product.vendor?.business_name || product.vendor || t('unknownVendor')}
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
                            {t('previous')}
                          </Button>
                          <span className="px-4 py-2 text-sm">
                            {t('pageInfo', { current: currentPage, total: totalPages })}
                          </span>
                          <Button
                            variant="outline"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                          >
                            {t('next')}
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-500 dark:text-gray-400 mb-4">
                        <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">{t('noProductsFound')}</h3>
                        <p className="text-sm">
                          {query
                            ? `${t('noProductsFoundFor')} "${query}".`
                            : t('noProductsAvailableYet')
                          }
                        </p>
                      </div>
                      <Button onClick={() => window.location.href = '/'}>
                        {t('browseAllProducts')}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {!isLoading && <Footer />}
    </div>
  );
};

export default SearchResults;