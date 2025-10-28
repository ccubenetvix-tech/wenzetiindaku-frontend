import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/utils/api";
import { Loader2 } from "lucide-react";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
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
  const [reviewImages, setReviewImages] = useState([]);
  
  // Dynamic product data
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);
  
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      
      try {
        setIsLoading(true);
        console.log('Loading product:', productId);
        const response: any = await apiClient.getProductById(productId);
        console.log('Product response:', response);
        
        if (response.success && response.data) {
          setProduct(response.data.product || response.data);
        } else {
          console.error('Error loading product:', response.error);
          toast({
            title: "Error",
            description: "Product not found",
            variant: "destructive",
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast({
          title: "Error",
          description: "Failed to load product",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
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

  const handleAddToCart = () => {
    if (!product) return;
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    // Check if user is a vendor (vendors cannot add to cart)
    if (user?.role === 'vendor') {
      toast({
        title: "Not Available",
        description: "Vendors cannot add products to cart.",
        variant: "destructive"
      });
      return;
    }
    
    // Only customers can add to cart
    if (user?.role !== 'customer') {
      toast({
        title: "Access Denied",
        description: "Only customers can add products to cart.",
        variant: "destructive"
      });
      return;
    }
    
    // Add the product to cart with the selected quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[selectedImage] || product.image || "/marketplace.jpeg",
        vendor: product.vendor?.business_name || "Unknown Vendor"
      });
    }
    
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
  };

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

  // Handle review submission
  const handleReviewSubmit = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to submit a review.",
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

    // Here you would typically save the review to your backend
    const newReview = {
      id: reviews.length + 1,
      author: user.firstName || user.email,
      rating: reviewRating,
      comment: reviewComment,
      date: "Just now",
      verified: true,
      helpful: 0,
      images: reviewImages
    };

    reviews.unshift(newReview); // Add to beginning of reviews array
    
    toast({
      title: "Review submitted",
      description: "Thank you for your review!",
    });

    // Reset form
    setReviewRating(0);
    setReviewComment("");
    setReviewImages([]);
    setShowReviewForm(false);
  };

  // Review stats for display
  const reviewStats = {
    average: product?.rating || 0,
    total: product?.review_count || 0,
    distribution: {
      5: Math.floor((product?.review_count || 0) * 0.7),
      4: Math.floor((product?.review_count || 0) * 0.2),
      3: Math.floor((product?.review_count || 0) * 0.06),
      2: Math.floor((product?.review_count || 0) * 0.02),
      1: Math.floor((product?.review_count || 0) * 0.02)
    }
  };

  // Sample reviews (you can replace this with dynamic data later)
  const reviews = [
    {
      id: 1,
      author: "Sarah M.",
      rating: 5,
      comment: "Amazing product! My skin feels so smooth and hydrated.",
      date: "2 days ago",
      verified: true,
      helpful: 12,
      images: []
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/')}>Go Home</Button>
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
              <span className="hover:text-foreground cursor-pointer" onClick={() => navigate('/categories')}>{product.category}</span>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative group">
                <img
                  src={product?.images?.[selectedImage] || product?.image || "/marketplace.jpeg"}
                  alt={product?.name || "Product"}
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
                {product?.original_price && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white">
                      -{Math.round(((product?.original_price - product?.price) / product?.original_price) * 100)}% OFF
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {(product?.images || [product?.image || "/marketplace.jpeg"]).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product?.name || "Product"} ${index + 1}`}
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
                  {product.isNew && (
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                      New
                    </Badge>
                  )}
                  {product.isFeatured && (
                    <Badge variant="outline" className="border-primary text-primary">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {product?.name || "Product Name"}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product?.rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {product?.rating || 0} ({product?.review_count || 0} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-3xl font-bold text-primary">Price</span>
                  <span className="text-3xl font-bold text-primary">
                    ${product?.price || 0}
                  </span>
                  {product?.original_price && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.original_price}
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
                      <span className="font-medium">{product.vendor?.business_name || product.vendor?.name || "Unknown Vendor"}</span>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>4.5</span>
                        <span className="ml-1">• Products available</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/store/${product.vendor_id || product.vendor?.id}`)}>
                    Visit Store
                  </Button>
                </div>
              </div>

              {/* Size Selection */}
              {(product.sizes && product.sizes.length > 0) && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Size:</span>
                    <span className="text-sm text-muted-foreground">{selectedSize || 'Select size'}</span>
                  </div>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
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
              {(product.colors && product.colors.length > 0) && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Color:</span>
                    <span className="text-sm text-muted-foreground">{selectedColor || 'Select color'}</span>
                  </div>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
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
                <span className={`font-medium ${(product.stock || 0) > 10 ? 'text-green-600' : (product.stock || 0) > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                  {(product.stock || 0) > 0 ? `${product.stock || 0} in stock` : 'Out of stock'}
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
                      onClick={() => setQuantity(Math.min((product.stock || 0), quantity + 1))}
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
                    disabled={(product.stock || 0) === 0 || (!selectedSize && product.sizes?.length > 0) || user?.role === 'vendor'}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {!isAuthenticated 
                      ? 'Login to Add to Cart' 
                      : user?.role === 'vendor'
                      ? 'Not for Vendors'
                      : t('addToCart')
                    }
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={isWishlisted ? "text-red-500 border-red-500" : ""}
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500" : ""}`} />
                  </Button>
                </div>
                
                {/* Buy Now Button */}
                <Button 
                  className={`w-full ${
                    !isAuthenticated 
                      ? 'bg-gray-400 hover:bg-gray-500 text-white' 
                      : user?.role === 'vendor'
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-primary hover:bg-primary/90 text-white'
                  }`}
                  size="lg"
                  disabled={(product.stock || 0) === 0 || (!selectedSize && product.sizes?.length > 0) || user?.role === 'vendor'}
                  onClick={() => {
                    handleAddToCart();
                    if (isAuthenticated && user?.role === 'customer') {
                      navigate('/checkout');
                    }
                  }}
                >
                  {!isAuthenticated 
                    ? 'Login to Buy' 
                    : user?.role === 'vendor'
                    ? 'Not Available for Vendors'
                    : 'Buy Now'
                  }
                </Button>
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
                      <div>• Estimated delivery: {product.shipping?.estimatedDays || "3-5 days"}</div>
                      <div>• {(product.shipping?.returnPolicy || 30)} day return policy</div>
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({product.review_count || product.reviewCount || 0})</TabsTrigger>
                <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
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
                        <p>{editedDescription || product.description}</p>
                        {showFullDescription && (
                          <p>{product.longDescription}</p>
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
                  {(product.features || []).map((feature: string, index: number) => (
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
                        {Object.entries(editedSpecifications && Object.keys(editedSpecifications).length > 0 ? editedSpecifications : (product.specifications || {})).map(([key, value]) => (
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
                  {isCustomer && (
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
                            <Button onClick={handleReviewSubmit}>
                              Submit Review
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
                            {reviewStats.average}
                          </div>
                          <div className="flex justify-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < Math.floor(reviewStats.average)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Based on {reviewStats.total} reviews
            </div>
          </div>

                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-2">
                              <span className="text-sm w-8">{rating}★</span>
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-yellow-400 h-2 rounded-full"
                                  style={{ width: `${(reviewStats.distribution[rating] / reviewStats.total) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-muted-foreground w-8">
                                {reviewStats.distribution[rating]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Individual Reviews */}
                  <div className="space-y-4">
              {reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {review.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{review.author}</span>
                                  {review.verified && (
                                    <Badge variant="secondary" className="text-xs">
                                      Verified Purchase
                                    </Badge>
                                  )}
                                </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                          <p className="text-muted-foreground mb-4">{review.comment}</p>
                          {review.images && (
                            <div className="flex gap-2 mb-4">
                              {review.images.map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt="Review image"
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <button className="flex items-center gap-1 hover:text-foreground">
                              <ThumbsUp className="h-4 w-4" />
                              Helpful ({review.helpful})
                            </button>
                            <button className="flex items-center gap-1 hover:text-foreground">
                              <MessageCircle className="h-4 w-4" />
                              Reply
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
                                value={editedShipping.estimatedDays || product.shipping?.estimatedDays || ""}
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
                                value={editedShipping.freeShippingThreshold || product.shipping?.freeShippingThreshold || "$25"}
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
                                value={editedShipping.returnPolicy || product.shipping?.returnPolicy || "30"}
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
                                value={editedShipping.returnConditions || product.shipping?.returnConditions || "Items must be in original condition"}
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
                            <span>Free shipping on orders over {(editedShipping.freeShippingThreshold || product.shipping?.freeShippingThreshold) || "$25"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span>Estimated delivery: {(editedShipping.estimatedDays || product.shipping?.estimatedDays || "3-5 days")}</span>
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
                            <span>{(editedShipping.returnPolicy || product.shipping?.returnPolicy || 30)} day return policy</span>
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
              <Button variant="outline" onClick={() => navigate(`/search?category=${encodeURIComponent(product.category)}`)}>
                View All in {product.category}
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
  );
};

export default ProductDetail;