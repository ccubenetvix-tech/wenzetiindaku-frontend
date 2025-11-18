import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Heart, 
  Star, 
  ShoppingCart, 
  Truck, 
  Shield, 
  ZoomIn,
  Store as StoreIcon,
  Package,
  CheckCircle,
  ArrowLeft,
  Share2,
  MessageCircle,
  Award,
  Clock,
  MapPin,
  CreditCard,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Filter,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/utils/api";
import { Loader2 } from "lucide-react";
import { PageLoader } from "@/components/PageLoader";
import { useLoaderTransition } from "@/hooks/useLoaderTransition";

const ProductDetail = () => {
  const MIN_LOADING_DURATION = 400;
  const { productId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  
  // Editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedSpecifications, setEditedSpecifications] = useState<any>({});
  const [editedShipping, setEditedShipping] = useState<any>({});
  
  // Review states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [reviewSort, setReviewSort] = useState('newest');
  const [reviewPage, setReviewPage] = useState(1);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  // Dynamic product data
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isAddToCartLoading, setIsAddToCartLoading] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const loadStartedAt = useRef<number>(0);
  const loadingTimeoutRef = useRef<number | null>(null);
  const { isMounted: showLoader, isFadingOut } = useLoaderTransition(isLoading, {
    minimumVisibleMs: 900,
    fadeDurationMs: 400,
  });
  const contentVisibilityClass =
    showLoader && !isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100";
  
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { toggleWishlist, isWishlisted: isProductWishlisted, isProcessing: isWishlistProcessing } = useWishlist();

  const productWishlisted = useMemo(() => {
    if (!product?.id) {
      return false;
    }
    return isProductWishlisted(product.id);
  }, [isProductWishlisted, product?.id]);
  const handleWishlistToggle = useCallback(async () => {
    if (!product) {
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to manage your wishlist.",
        variant: "destructive"
      });
      navigate('/customer/login');
      return;
    }

    if (user?.role !== 'customer') {
      toast({
        title: "Action not allowed",
        description: "Only customers can manage wishlists.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsWishlistLoading(true);
      const added = await toggleWishlist({
        productId: product.id,
        name: product.name,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price ?? 0,
        image: product.images?.[0] || product.image || "/marketplace.jpeg",
        vendor: product.vendor?.business_name || product.vendor_name || "Unknown Vendor",
        originalPrice: typeof product.original_price === 'string' ? parseFloat(product.original_price) : product.original_price,
        rating: typeof product.rating === 'string' ? parseFloat(product.rating) : product.rating,
        reviewCount: product.review_count,
        isNew: product.is_new,
        isFeatured: product.is_featured,
      });

      toast({
        title: added ? "Added to Wishlist" : "Removed from Wishlist",
        description: added
          ? `${product.name ?? 'Product'} has been added to your wishlist.`
          : `${product.name ?? 'Product'} has been removed from your wishlist.`,
      });
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      toast({
        title: "Error",
        description: "Unable to update wishlist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsWishlistLoading(false);
    }
  }, [isAuthenticated, navigate, product, toast, toggleWishlist, user?.role]);

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      
      try {
        if (loadingTimeoutRef.current !== null) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        loadStartedAt.current = performance.now();
        setIsLoading(true);
        setLoadError(null);
        setProduct(null);
        setRelatedProducts([]);
        console.log('Loading product:', productId);
        const response: any = await apiClient.getProductById(productId);
        console.log('Product response:', response);
        
        if (response.success && response.data) {
          setProduct(response.data.product || response.data);
        } else {
          console.error('Error loading product:', response.error);
          setLoadError("Product not found");
          toast({
            title: "Error",
            description: "Product not found",
            variant: "destructive",
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        setLoadError("Failed to load product");
        toast({
          title: "Error",
          description: "Failed to load product",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        const finalizeLoading = () => {
          setIsLoading(false);
          loadingTimeoutRef.current = null;
        };

        const elapsed = performance.now() - loadStartedAt.current;
        if (elapsed < MIN_LOADING_DURATION) {
          loadingTimeoutRef.current = window.setTimeout(finalizeLoading, MIN_LOADING_DURATION - elapsed);
        } else {
          finalizeLoading();
        }
      }
    };

    loadProduct();

    return () => {
      if (loadingTimeoutRef.current !== null) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [productId, navigate, toast]);

  // Load related products
  useEffect(() => {
    const loadRelatedProducts = async () => {
      if (!product) return;
      
      try {
        setIsLoadingRelated(true);
        const response: any = await apiClient.getAllProducts({
          category: product.category,
          limit: 4
        });
        
        if (response.success) {
          // Filter out the current product
          const related = (response.data.products || []).filter((p: any) => p.id !== product.id);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error loading related products:', error);
        setRelatedProducts([]);
      } finally {
        setIsLoadingRelated(false);
      }
    };

    loadRelatedProducts();
  }, [product]);

  const handleAddToCart = useCallback(async (): Promise<boolean> => {
    if (!product) return false;

    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive"
      });
      navigate('/login');
      return false;
    }

    if (user?.role === 'vendor') {
      toast({
        title: "Not Available",
        description: "Vendors cannot add products to cart.",
        variant: "destructive"
      });
      return false;
    }

    if (user?.role !== 'customer') {
      toast({
        title: "Access Denied",
        description: "Only customers can add products to cart.",
        variant: "destructive"
      });
      return false;
    }

    const itemImage = product.images?.[selectedImage] || product.image || "/marketplace.jpeg";
    const itemPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    const itemName = product.name ?? 'Product';
    const itemVendor = product.vendor?.business_name || "Unknown Vendor";

    try {
      setIsAddToCartLoading(true);
      for (let i = 0; i < quantity; i++) {
        await addToCart({
          productId: product.id,
          name: itemName,
          price: itemPrice,
          image: itemImage,
          vendor: itemVendor
        });
      }

      toast({
        title: "Added to cart",
        description: `${quantity} x ${itemName} has been added to your cart.`,
      });
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsAddToCartLoading(false);
    }
  }, [addToCart, isAuthenticated, navigate, product, quantity, selectedImage, toast, user?.role]);

  // Check if current user is the vendor of this product
  const isVendor = product && user && user.role === 'vendor' && (user.businessName === product.vendor?.business_name || user.businessName === product.vendor?.name);
  const isCustomer = user && user.role === 'customer';

  // Handle editing functions
  const handleEditStart = (mode: string) => {
    setEditMode(mode);
    setIsEditing(true);
    
    switch (mode) {
      case 'description':
        setEditedDescription(product.description);
        break;
      case 'specifications':
        setEditedSpecifications(product.specifications);
        break;
      case 'shipping':
        setEditedShipping(product.shipping);
        break;
    }
  };

  const handleEditSave = () => {
    // Here you would typically save to your backend
    toast({
      title: "Changes saved",
      description: "Product information has been updated successfully.",
    });
    setIsEditing(false);
    setEditMode("");
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditMode("");
  };

  // Load reviews for product
  const loadReviews = useCallback(async () => {
    if (!productId) return;

    setReviewsLoading(true);
    try {
      const response = (await apiClient.getProductReviews(productId, reviewPage, 20, reviewSort)) as {
        success?: boolean;
        data?: {
          reviews?: any[];
          averageRating?: number;
          totalReviews?: number;
        };
        error?: { message?: string };
      };

      if (response?.success && response.data) {
        setReviews(response.data.reviews || []);
        setReviewStats({
          averageRating: response.data.averageRating || 0,
          totalReviews: response.data.totalReviews || 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }, // Will calculate from reviews
        });

        // Calculate distribution
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        (response.data.reviews || []).forEach((review) => {
          const rating = review.rating || 0;
          if (rating >= 1 && rating <= 5) {
            distribution[rating as keyof typeof distribution]++;
          }
        });
        setReviewStats((prev) => ({ ...prev, distribution }));
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  }, [productId, reviewPage, reviewSort]);

  // Check if customer can review
  const checkCanReview = useCallback(async () => {
    if (!productId || !isAuthenticated || user?.role !== 'customer') {
      setCanReview(false);
      return;
    }

    try {
      const response = (await apiClient.canReviewProduct(productId)) as {
        success?: boolean;
        data?: {
          canReview?: boolean;
          hasOrdered?: boolean;
          hasReviewed?: boolean;
        };
        error?: { message?: string };
      };

      if (response?.success && response.data) {
        setCanReview(response.data.canReview || false);
        setHasReviewed(response.data.hasReviewed || false);
        
        // Log for debugging
        if (!response.data.canReview) {
          console.log('Cannot review:', {
            hasOrdered: response.data.hasOrdered,
            hasReviewed: response.data.hasReviewed,
          });
        }
      } else if (response?.error) {
        console.error('Error checking can review:', response.error.message);
      }
    } catch (error: any) {
      console.error('Error checking can review:', error);
      // Don't show error toast here, just log it
    }
  }, [productId, isAuthenticated, user?.role]);

  // Load reviews when product loads
  useEffect(() => {
    if (productId && !isLoading) {
      loadReviews();
      checkCanReview();
    }
  }, [productId, isLoading, loadReviews, checkCanReview]);

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to submit a review.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (user?.role !== 'customer') {
      toast({
        title: "Action not allowed",
        description: "Only customers can submit reviews.",
        variant: "destructive"
      });
      return;
    }

    if (reviewRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating for your review.",
        variant: "destructive"
      });
      return;
    }

    if (!reviewComment.trim()) {
      toast({
        title: "Comment required",
        description: "Please write a comment for your review.",
        variant: "destructive"
      });
      return;
    }

    if (!productId) {
      return;
    }

    setIsSubmittingReview(true);
    try {
      const response = (await apiClient.createReview(productId, reviewRating, reviewComment.trim())) as {
        success?: boolean;
        message?: string;
        error?: { message?: string };
      };

      if (response?.success) {
        toast({
          title: "Review submitted",
          description: "Thank you for your review!",
        });

        // Reset form
        setReviewRating(0);
        setReviewComment("");
        setShowReviewForm(false);
        setHasReviewed(true);
        setCanReview(false);

        // Reload reviews
        await loadReviews();
      } else {
        throw new Error(response?.error?.message || "Failed to submit review");
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      let errorMessage = "Failed to submit review. Please try again.";
      
      // Try to extract error message from response
      if (error?.message) {
        try {
          const parsed = typeof error.message === 'string' ? JSON.parse(error.message) : error.message;
          if (parsed.error?.message) {
            errorMessage = parsed.error.message;
          } else if (parsed.error?.details) {
            errorMessage = `${parsed.error.message || 'Failed to submit review'}: ${parsed.error.details}`;
          }
        } catch {
          // If not JSON, use the message directly
          if (typeof error.message === 'string') {
            errorMessage = error.message;
          }
        }
      } else if (error?.error?.message) {
        errorMessage = error.error.message;
        if (error.error.details) {
          errorMessage += `: ${error.error.details}`;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!isLoading && (loadError || !product)) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {loadError || "Product Not Found"}
            </h1>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const productData = product ?? {};
  const productCategory = productData.category || t("productDetail.allProducts", "Products");
  const productName = productData.name || t("productDetail.productName", "Product");
  const productImages = Array.isArray(productData.images) && productData.images.length > 0
    ? productData.images
    : [productData.image || "/marketplace.jpeg"];
  const productVendorName =
    productData.vendor?.business_name ||
    productData.vendor?.name ||
    productData.vendor_name ||
    "Unknown Vendor";
  const isProductNew = Boolean(productData.isNew ?? productData.is_new);
  const isProductFeatured = Boolean(productData.isFeatured ?? productData.is_featured);
  const productRating = Number(
    typeof productData.rating === "string" ? parseFloat(productData.rating) : productData.rating || 0,
  );
  const productReviewCount =
    productData.review_count ??
    productData.reviewCount ??
    0;
  const productStock = Number.isFinite(productData.stock)
    ? productData.stock
    : Number.parseInt(productData.stock, 10) || 0;
  const productOriginalPrice =
    typeof productData.original_price === "string"
      ? parseFloat(productData.original_price)
      : productData.original_price;
  const productPrice =
    typeof productData.price === "string"
      ? parseFloat(productData.price)
      : productData.price || 0;
  const productShipping = productData.shipping || {};
  const productSizes = Array.isArray(productData.sizes) ? productData.sizes : [];
  const productColors = Array.isArray(productData.colors) ? productData.colors : [];
  const productFeatures = Array.isArray(productData.features) ? productData.features : [];
  const productSpecifications =
    productData.specifications && typeof productData.specifications === "object"
      ? productData.specifications
      : {};
  const showSizeSelector = productSizes.length > 0;
  const showColorSelector = productColors.length > 0;
  const canNavigateToCategory = Boolean(productData.category);

  return (
    <div className="relative min-h-screen bg-background">
      {showLoader && (
        <PageLoader
          variant="product"
          title="Gathering product details"
          subtitle="We are pulling the latest information for you"
          fadingOut={isFadingOut}
        />
      )}

      <div
        className={`min-h-screen flex flex-col transition-opacity duration-500 ${contentVisibilityClass}`}
      >
        <Header />

        <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button & Breadcrumb */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hover:text-foreground cursor-pointer" onClick={() => navigate('/')}>Home</span>
            <span>/</span>
              <span className="hover:text-foreground cursor-pointer" onClick={() => navigate('/categories')}>{productCategory}</span>
            <span>/</span>
            <span className="text-foreground">{productName}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative group">
                <img
                  src={productImages[selectedImage] || "/marketplace.jpeg"}
                  alt={productName}
                  className="w-full mx-auto max-h-72 md:max-h-96 lg:max-h-[360px] object-contain bg-gray-50 rounded-lg cursor-zoom-in"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/80 hover:bg-white shadow-sm"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                <Button
                  variant="ghost"
                  size="icon"
                    className="bg-white/80 hover:bg-white shadow-sm"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                </div>
                {/* Discount Badge */}
                {productOriginalPrice && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white">
                      -{Math.round(((productOriginalPrice - productPrice) / productOriginalPrice) * 100)}% OFF
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${productName} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {isProductNew && (
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                      New
                    </Badge>
                  )}
                  {isProductFeatured && (
                    <Badge variant="outline" className="border-primary text-primary">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {productName}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(reviewStats.averageRating || productRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {reviewStats.averageRating > 0 ? reviewStats.averageRating.toFixed(1) : productRating} ({reviewStats.totalReviews > 0 ? reviewStats.totalReviews : productReviewCount} {reviewStats.totalReviews === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-3xl font-bold text-primary">Price</span>
                  <span className="text-3xl font-bold text-primary">
                    ${productPrice}
                  </span>
                  {productOriginalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${productOriginalPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Vendor Info */}
              <div className="bg-primary/5 p-4 rounded-lg border-2 border-primary/30 dark:border-primary/30 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <StoreIcon className="h-5 w-5 text-primary mr-2" />
                    <div>
                      <span className="font-medium">{productVendorName}</span>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>4.5</span>
                        <span className="ml-1">• Products available</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/store/${productData.vendor_id || productData.vendor?.id}`)}
                  >
                    Visit Store
                  </Button>
                </div>
              </div>

              {/* Size Selection */}
              {showSizeSelector && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Size:</span>
                    <span className="text-sm text-muted-foreground">{selectedSize || 'Select size'}</span>
                  </div>
                  <div className="flex gap-2">
                    {productSizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSize(size)}
                        className="min-w-[60px]"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {showColorSelector && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Color:</span>
                    <span className="text-sm text-muted-foreground">{selectedColor || 'Select color'}</span>
                  </div>
                  <div className="flex gap-2">
                    {productColors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedColor(color)}
                        className="min-w-[80px]"
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span className={`font-medium ${productStock > 10 ? 'text-green-600' : productStock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                  {productStock > 0 ? `${productStock} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Quantity:</label>
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-muted"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x">{quantity}</span>
                    <button
                      onClick={() => {
                        const maxQuantity = productStock > 0 ? productStock : 1;
                        setQuantity(Math.min(maxQuantity, quantity + 1));
                      }}
                      className="px-3 py-2 hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    className={`flex-1 ${
                      !isAuthenticated 
                        ? 'bg-gray-400 hover:bg-gray-500' 
                        : user?.role === 'vendor'
                        ? 'bg-orange-500 hover:bg-orange-600'
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                    size="lg"
                    disabled={productStock === 0 || (!selectedSize && showSizeSelector) || user?.role === 'vendor' || isAddToCartLoading}
                    onClick={handleAddToCart}
                  >
                    {isAddToCartLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {t('addingToCart', 'Adding...')}
                      </span>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        {!isAuthenticated 
                          ? 'Login to Add to Cart' 
                          : user?.role === 'vendor'
                          ? 'Not for Vendors'
                          : t('addToCart')
                        }
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleWishlistToggle}
                    className={productWishlisted ? "text-red-500 border-red-500" : ""}
                    disabled={isWishlistProcessing || isWishlistLoading}
                  >
                    {isWishlistProcessing || isWishlistLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Heart className={`h-5 w-5 ${productWishlisted ? "fill-red-500" : ""}`} />
                    )}
                  </Button>
                </div>
              </div>

              {/* Shipping Information */}
              <Card className="bg-gray-50 dark:bg-gray-900">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Shipping Information</span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• Free shipping on orders over $25</div>
                      <div>• Estimated delivery: {productShipping.estimatedDays || "3-5 days"}</div>
                      <div>• {(productShipping.returnPolicy || 30)} day return policy</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-green-800 dark:text-green-200">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800 dark:text-blue-200">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  <span className="text-purple-800 dark:text-purple-200">Quality Guaranteed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mb-12">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="tabs-scroll no-scrollbar sm:grid-cols-4">
                <TabsTrigger value="description" className="min-w-[140px] sm:min-w-0">Description</TabsTrigger>
                <TabsTrigger value="specifications" className="min-w-[140px] sm:min-w-0">Specifications</TabsTrigger>
                <TabsTrigger value="reviews" className="min-w-[140px] sm:min-w-0">Reviews ({productReviewCount})</TabsTrigger>
                <TabsTrigger value="shipping" className="min-w-[140px] sm:min-w-0">Shipping & Returns</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Product Description</h3>
                      {isVendor && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditStart('description')}
                          disabled={isEditing}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Edit Description
                        </Button>
                      )}
                    </div>
                    
                    {isEditing && editMode === 'description' ? (
                      <div className="space-y-4">
                        <Textarea
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          placeholder="Enter product description..."
                          className="min-h-[200px]"
                        />
                        <div className="flex gap-2">
                          <Button onClick={handleEditSave} size="sm">
                            Save Changes
                          </Button>
                          <Button onClick={handleEditCancel} variant="outline" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground leading-relaxed space-y-4">
                        <p>{editedDescription || productData.description}</p>
                        {showFullDescription && (
                          <p>{productData.longDescription}</p>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="p-0 h-auto"
                        >
                          {showFullDescription ? 'Show Less' : 'Show More'}
                          {showFullDescription ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                        </Button>
                      </div>
                    )}
                  </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                    <ul className="space-y-3">
                  {productFeatures.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Product Specifications</CardTitle>
                      {isVendor && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditStart('specifications')}
                          disabled={isEditing}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Edit Specifications
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing && editMode === 'specifications' ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(editedSpecifications).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                              <Label htmlFor={key}>{key}</Label>
                              <Input
                                id={key}
                                value={value as string}
                                onChange={(e) => setEditedSpecifications({
                                  ...editedSpecifications,
                                  [key]: e.target.value
                                })}
                                placeholder={`Enter ${key.toLowerCase()}...`}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleEditSave} size="sm">
                            Save Changes
                          </Button>
                          <Button onClick={handleEditCancel} variant="outline" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(editedSpecifications && Object.keys(editedSpecifications).length > 0 ? editedSpecifications : productSpecifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                            <span className="font-medium text-gray-600 dark:text-gray-400">{key}:</span>
                            <span className="text-gray-900 dark:text-gray-100">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  {/* Write a Review Section */}
                  {isCustomer && canReview && !hasReviewed && (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Write a Review</CardTitle>
                          <Button
                            variant="outline"
                            onClick={() => setShowReviewForm(!showReviewForm)}
                          >
                            {showReviewForm ? 'Cancel' : 'Write Review'}
                          </Button>
                        </div>
                      </CardHeader>
                      {showReviewForm && (
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="rating">Rating *</Label>
                            <div className="flex gap-1 mt-2">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                  key={rating}
                                  onClick={() => setReviewRating(rating)}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`h-6 w-6 ${
                                      rating <= reviewRating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300 hover:text-yellow-400'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="comment">Your Review *</Label>
                            <Textarea
                              id="comment"
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              placeholder="Share your experience with this product..."
                              className="mt-2 min-h-[100px]"
                            />
                          </div>
                          
                          <div className="flex gap-2">
                            <Button onClick={handleReviewSubmit} disabled={isSubmittingReview}>
                              {isSubmittingReview ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                'Submit Review'
                              )}
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setShowReviewForm(false);
                                setReviewRating(0);
                                setReviewComment("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )}

                  {/* Review Summary */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            {reviewStats.averageRating > 0 ? reviewStats.averageRating.toFixed(1) : '0.0'}
                          </div>
                          <div className="flex justify-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < Math.floor(reviewStats.averageRating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Based on {reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'review' : 'reviews'}
                          </div>
                        </div>

                        {reviewStats.totalReviews > 0 && (
                          <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => {
                              const count = reviewStats.distribution[rating as keyof typeof reviewStats.distribution] || 0;
                              const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
                              return (
                                <div key={rating} className="flex items-center gap-2">
                                  <span className="text-sm w-8">{rating}★</span>
                                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-yellow-400 h-2 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-muted-foreground w-8">
                                    {count}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Individual Reviews */}
                  {reviewsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : reviews.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center text-muted-foreground">
                        No reviews yet. Buy the product and Be the first to review this product!
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => {
                        const customer = review.customer || {};
                        const customerName = customer.first_name && customer.last_name
                          ? `${customer.first_name} ${customer.last_name}`
                          : customer.first_name || customer.email || 'Anonymous';
                        const initials = customerName.charAt(0).toUpperCase();
                        const reviewDate = review.created_at
                          ? new Date(review.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Recently';

                        return (
                          <Card key={review.id}>
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    {customer.profile_photo ? (
                                      <img
                                        src={customer.profile_photo}
                                        alt={customerName}
                                        className="w-10 h-10 rounded-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-sm font-medium text-primary">
                                        {initials}
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{customerName}</span>
                                      <Badge variant="secondary" className="text-xs">
                                        Verified Purchase
                                      </Badge>
                                    </div>
                                    <div className="flex items-center">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-3 w-3 ${
                                            i < (review.rating || 0)
                                              ? 'fill-yellow-400 text-yellow-400'
                                              : 'text-gray-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <span className="text-sm text-muted-foreground">{reviewDate}</span>
                              </div>
                              {review.comment && (
                                <p className="text-muted-foreground mb-4">{review.comment}</p>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="shipping" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Shipping & Returns Information</h3>
                    {isVendor && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditStart('shipping')}
                        disabled={isEditing}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Edit Shipping Info
                      </Button>
                    )}
                  </div>
                  
                  {isEditing && editMode === 'shipping' ? (
                    <Card>
                      <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="font-semibold">Shipping Information</h4>
                            <div>
                              <Label htmlFor="estimatedDays">Estimated Delivery</Label>
                              <Input
                                id="estimatedDays"
                                value={editedShipping.estimatedDays || productShipping.estimatedDays || ""}
                                onChange={(e) => setEditedShipping({
                                  ...editedShipping,
                                  estimatedDays: e.target.value
                                })}
                                placeholder="e.g., 2-3 days"
                              />
                            </div>
                            <div>
                              <Label htmlFor="freeShippingThreshold">Free Shipping Threshold</Label>
                              <Input
                                id="freeShippingThreshold"
                                value={editedShipping.freeShippingThreshold || productShipping.freeShippingThreshold || "$25"}
                                onChange={(e) => setEditedShipping({
                                  ...editedShipping,
                                  freeShippingThreshold: e.target.value
                                })}
                                placeholder="e.g., $25"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h4 className="font-semibold">Returns & Exchanges</h4>
                            <div>
                              <Label htmlFor="returnPolicy">Return Policy (days)</Label>
                              <Input
                                id="returnPolicy"
                                value={editedShipping.returnPolicy || productShipping.returnPolicy || "30"}
                                onChange={(e) => setEditedShipping({
                                  ...editedShipping,
                                  returnPolicy: e.target.value
                                })}
                                placeholder="e.g., 30"
                              />
                            </div>
                            <div>
                              <Label htmlFor="returnConditions">Return Conditions</Label>
                              <Textarea
                                id="returnConditions"
                                value={editedShipping.returnConditions || productShipping.returnConditions || "Items must be in original condition"}
                                onChange={(e) => setEditedShipping({
                                  ...editedShipping,
                                  returnConditions: e.target.value
                                })}
                                placeholder="Describe return conditions..."
                                className="min-h-[80px]"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button onClick={handleEditSave} size="sm">
                            Save Changes
                          </Button>
                          <Button onClick={handleEditCancel} variant="outline" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            Shipping Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Free shipping on orders over {(editedShipping.freeShippingThreshold || productShipping.freeShippingThreshold) || "$25"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span>Estimated delivery: {(editedShipping.estimatedDays || productShipping.estimatedDays || "3-5 days")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-purple-600" />
                            <span>Available for international shipping</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <RefreshCw className="h-5 w-5" />
                            Returns & Exchanges
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>{(editedShipping.returnPolicy || productShipping.returnPolicy || 30)} day return policy</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <span>Money-back guarantee</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-purple-600" />
                            <span>Quality satisfaction guarantee</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Related Products</h3>
              <Button
                variant="outline"
                onClick={() => canNavigateToCategory && navigate(`/search?category=${encodeURIComponent(String(productCategory))}`)}
                disabled={!canNavigateToCategory}
              >
                View All in {productCategory}
              </Button>
                </div>
            {isLoadingRelated ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading related products...</span>
              </div>
            ) : relatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard 
                    key={relatedProduct.id}
                    id={relatedProduct.id}
                    name={relatedProduct.name}
                    price={relatedProduct.price}
                    originalPrice={relatedProduct.original_price}
                    rating={relatedProduct.rating || 0}
                    reviewCount={relatedProduct.review_count || 0}
                    image={relatedProduct.images?.[0] || relatedProduct.image || "/marketplace.jpeg"}
                    vendor={relatedProduct.vendor?.business_name || "Unknown Vendor"}
                    isNew={relatedProduct.is_new || false}
                    isFeatured={relatedProduct.is_featured || false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No related products found
              </div>
            )}
          </div>

          {/* Recently Viewed */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Recently Viewed</h3>
            {relatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.slice(0, 4).map((recentProduct: any) => (
                  <ProductCard 
                    key={`recent-${recentProduct.id}`}
                    id={recentProduct.id}
                    name={recentProduct.name}
                    price={recentProduct.price}
                    originalPrice={recentProduct.original_price}
                    rating={recentProduct.rating || 0}
                    reviewCount={recentProduct.review_count || 0}
                    image={recentProduct.images?.[0] || recentProduct.image || "/marketplace.jpeg"}
                    vendor={recentProduct.vendor?.business_name || "Unknown Vendor"}
                    isNew={recentProduct.is_new || false}
                    isFeatured={recentProduct.is_featured || false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recently viewed products
              </div>
            )}
          </div>
        </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ProductDetail;