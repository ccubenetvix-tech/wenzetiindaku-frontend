import { useState } from "react";
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
  const [editedSpecifications, setEditedSpecifications] = useState({});
  const [editedShipping, setEditedShipping] = useState({});
  
  // Review states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImages, setReviewImages] = useState([]);
  
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    // Add the product to cart with the selected quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        vendor: product.vendor,
      });
    }
    
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
  };

  // Check if current user is the vendor of this product
  const isVendor = user && user.role === 'vendor' && user.businessName === product.vendor.name;
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

  // Enhanced product data
  const product = {
    id: productId || "1",
    name: "Premium African Shea Butter Face Cream",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.8,
    reviewCount: 127,
    description: "This premium face cream is made with 100% organic African shea butter, sourced directly from women's cooperatives in Ghana. Rich in vitamins A and E, it provides deep moisturization and anti-aging benefits for all skin types. The cream is carefully formulated with natural ingredients to provide maximum hydration while being gentle on sensitive skin.",
    longDescription: "Transform your skincare routine with our Premium African Shea Butter Face Cream. This luxurious cream is crafted using traditional methods passed down through generations of Ghanaian women. Each jar contains the finest shea butter, cold-pressed to preserve its natural nutrients and healing properties. Perfect for daily use, this cream provides intense hydration, reduces fine lines, and leaves your skin feeling soft and supple. The natural antioxidants help protect your skin from environmental damage while the rich emollients provide long-lasting moisture. Suitable for all skin types including sensitive skin, this cream is free from harsh chemicals, parabens, and artificial fragrances.",
    features: [
      "100% Organic African Shea Butter",
      "Rich in Vitamins A & E",
      "Suitable for all skin types",
      "Anti-aging properties",
      "Cruelty-free and sustainable",
      "Paraben-free formula",
      "Dermatologist tested",
      "Made in Ghana"
    ],
    specifications: {
      "Brand": "AfriBeauty",
      "Item Weight": "50ml",
      "Skin Type": "All Skin Types",
      "Form": "Cream",
      "Country of Origin": "Ghana",
      "Certification": "Organic Certified",
      "Shelf Life": "24 months",
      "Packaging": "Glass Jar"
    },
    sizes: ["30ml", "50ml", "100ml"],
    colors: ["Natural", "Vanilla", "Lavender"],
    images: [
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&crop=center", 
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&h=600&fit=crop&crop=center"
    ],
    vendor: {
      name: "AfriBeauty Store",
      id: "afribeauty",
      rating: 4.9,
      totalProducts: 89,
      joinedDate: "2020",
      location: "Accra, Ghana",
      verified: true
    },
    stock: 15,
    category: "Cosmetics",
    weight: "50ml",
    isNew: true,
    isFeatured: true,
    shipping: {
      free: true,
      estimatedDays: "2-3 days",
      returnPolicy: "30 days"
    },
    discounts: [
      { type: "Buy 2 Get 1 Free", description: "Add 3 items to cart" },
      { type: "Free Shipping", description: "On orders over $25" }
    ]
  };

  // Sample related products
  const relatedProducts = [
    {
      id: "2",
      name: "Organic Face Moisturizer",
      price: 19.99,
      rating: 4.6,
      reviewCount: 89,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center",
      vendor: "AfriBeauty Store",
    },
    {
      id: "3",
      name: "Natural Body Butter",
      price: 22.50,
      rating: 4.7,
      reviewCount: 156,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center",
      vendor: "AfriBeauty Store",
    },
  ];

  const reviews = [
    {
      id: 1,
      author: "Sarah M.",
      rating: 5,
      comment: "Amazing product! My skin feels so smooth and hydrated. I've been using this for a month now and I can see a significant improvement in my skin texture. The shea butter is so rich and luxurious.",
      date: "2 days ago",
      verified: true,
      helpful: 12,
      images: ["https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center"]
    },
    {
      id: 2,
      author: "John D.",
      rating: 4,
      comment: "Great quality cream, fast delivery. Highly recommended! The packaging was excellent and the product arrived in perfect condition. My wife loves it!",
      date: "1 week ago",
      verified: true,
      helpful: 8
    },
    {
      id: 3,
      author: "Maria L.",
      rating: 5,
      comment: "This is the best face cream I've ever used. It's perfect for my sensitive skin and doesn't cause any irritation. The natural ingredients make me feel good about what I'm putting on my skin.",
      date: "2 weeks ago",
      verified: true,
      helpful: 15
    },
    {
      id: 4,
      author: "David K.",
      rating: 4,
      comment: "Good product overall. The cream is thick and moisturizing. Takes a bit of time to absorb but leaves skin feeling soft. Would recommend for dry skin types.",
      date: "3 weeks ago",
      verified: false,
      helpful: 5
    }
  ];

  const reviewStats = {
    average: 4.8,
    total: 127,
    distribution: {
      5: 89,
      4: 25,
      3: 8,
      2: 3,
      1: 2
    }
  };

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative group">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full aspect-square object-cover rounded-lg cursor-zoom-in"
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
                {product.originalPrice && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
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
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-primary">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Vendor Info */}
              <div className="bg-card p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <StoreIcon className="h-5 w-5 text-primary mr-2" />
                    <div>
                      <span className="font-medium">{product.vendor.name}</span>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{product.vendor.rating}</span>
                        <span className="ml-1">• {product.vendor.totalProducts} products</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Visit Store
                  </Button>
                </div>
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
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
              {product.colors && product.colors.length > 0 && (
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
                <span className={`font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
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
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    className="flex-1" 
                    size="lg"
                    disabled={product.stock === 0 || (!selectedSize && product.sizes?.length > 0)}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {t('addToCart')}
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
                  className="w-full" 
                  size="lg"
                  variant="outline"
                  disabled={product.stock === 0 || (!selectedSize && product.sizes?.length > 0)}
                  onClick={() => {
                    handleAddToCart();
                    navigate('/checkout');
                  }}
                >
                  Buy Now
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
                      <div>• Estimated delivery: {product.shipping.estimatedDays}</div>
                      <div>• {product.shipping.returnPolicy} day return policy</div>
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
                <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
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
                  {product.features.map((feature, index) => (
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
                                value={value}
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
                        {Object.entries(editedSpecifications && Object.keys(editedSpecifications).length > 0 ? editedSpecifications : product.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                            <span className="font-medium text-gray-600 dark:text-gray-400">{key}:</span>
                            <span className="text-gray-900 dark:text-gray-100">{value}</span>
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
                                value={editedShipping.estimatedDays || product.shipping.estimatedDays}
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
                                value={editedShipping.freeShippingThreshold || "$25"}
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
                                value={editedShipping.returnPolicy || product.shipping.returnPolicy}
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
                                value={editedShipping.returnConditions || "Items must be in original condition"}
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
                            <span>Free shipping on orders over {(editedShipping.freeShippingThreshold || product.shipping.freeShippingThreshold) || "$25"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span>Estimated delivery: {(editedShipping.estimatedDays || product.shipping.estimatedDays)}</span>
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
                            <span>{(editedShipping.returnPolicy || product.shipping.returnPolicy)} day return policy</span>
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
              <Button variant="outline" onClick={() => navigate('/search?category=' + product.category)}>
                View All in {product.category}
              </Button>
                </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} {...relatedProduct} />
              ))}
            </div>
          </div>

          {/* Recently Viewed */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Recently Viewed</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((product) => (
                <ProductCard key={`recent-${product.id}`} {...product} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;