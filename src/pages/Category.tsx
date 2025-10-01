import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Sparkles, 
  Smartphone, 
  Shirt, 
  Baby, 
  UtensilsCrossed, 
  Coffee,
  Heart,
  Home,
  ArrowLeft,
  Filter,
  Grid3X3,
  List,
  Star,
  TrendingUp,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";

// Synthetic data for all categories
const categoryData = {
  cosmetics: {
    name: "Cosmetics",
    icon: Sparkles,
    description: "Beauty and personal care products",
    productCount: 1247,
    products: [
      {
        id: "cosm1",
        name: "Premium African Shea Butter Face Cream",
        price: 24.99,
        originalPrice: 34.99,
        rating: 4.8,
        reviewCount: 127,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&crop=center",
        vendor: "AfriBeauty Store",
        isNew: true,
        isFeatured: true,
      },
      {
        id: "cosm2",
        name: "Natural Coconut Oil Hair Treatment",
        price: 18.50,
        rating: 4.6,
        reviewCount: 89,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&crop=center",
        vendor: "Natural Beauty Co",
        isFeatured: true,
      },
      {
        id: "cosm3",
        name: "Organic Aloe Vera Gel",
        price: 15.99,
        originalPrice: 22.99,
        rating: 4.9,
        reviewCount: 203,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&crop=center",
        vendor: "Green Beauty",
        isNew: true,
      },
      {
        id: "cosm4",
        name: "Luxury Rose Water Toner",
        price: 28.00,
        rating: 4.7,
        reviewCount: 156,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&crop=center",
        vendor: "Luxury Skincare",
        isFeatured: true,
      },
      {
        id: "cosm5",
        name: "Vitamin C Brightening Serum",
        price: 32.99,
        originalPrice: 45.00,
        rating: 4.8,
        reviewCount: 234,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&crop=center",
        vendor: "Glow Beauty",
        isNew: true,
      },
      {
        id: "cosm6",
        name: "Natural Lip Balm Set",
        price: 12.50,
        rating: 4.5,
        reviewCount: 98,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&crop=center",
        vendor: "Organic Care",
        isFeatured: true,
      },
    ]
  },
  tech: {
    name: "Technology",
    icon: Smartphone,
    description: "Electronics and technology gadgets",
    productCount: 2156,
    products: [
      {
        id: "tech1",
        name: "Samsung Galaxy Smartphone Case",
        price: 19.99,
        rating: 4.6,
        reviewCount: 89,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center",
        vendor: "TechHub Africa",
        isFeatured: true,
      },
      {
        id: "tech2",
        name: "Wireless Bluetooth Headphones",
        price: 45.00,
        originalPrice: 65.00,
        rating: 4.8,
        reviewCount: 234,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center",
        vendor: "AudioTech Pro",
        isNew: true,
      },
      {
        id: "tech3",
        name: "Portable Power Bank 20000mAh",
        price: 32.50,
        rating: 4.5,
        reviewCount: 167,
        image: "https://images.unsplash.com/photo-1609592806598-ef3a5d5c0b0c?w=400&h=400&fit=crop&crop=center",
        vendor: "Power Solutions",
        isFeatured: true,
      },
      {
        id: "tech4",
        name: "Smart LED Desk Lamp",
        price: 38.99,
        originalPrice: 55.00,
        rating: 4.7,
        reviewCount: 98,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop&crop=center",
        vendor: "Smart Home Tech",
        isNew: true,
      },
      {
        id: "tech5",
        name: "USB-C Fast Charging Cable",
        price: 8.99,
        rating: 4.4,
        reviewCount: 345,
        image: "https://images.unsplash.com/photo-1609592806598-ef3a5d5c0b0c?w=400&h=400&fit=crop&crop=center",
        vendor: "Cable Masters",
        isFeatured: true,
      },
      {
        id: "tech6",
        name: "Wireless Mouse with RGB",
        price: 25.50,
        originalPrice: 35.00,
        rating: 4.6,
        reviewCount: 123,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop&crop=center",
        vendor: "Gaming Gear",
        isNew: true,
      },
    ]
  },
  clothes: {
    name: "Clothing",
    icon: Shirt,
    description: "Fashion and clothing items",
    productCount: 3421,
    products: [
      {
        id: "cloth1",
        name: "Traditional African Print Dress",
        price: 45.00,
        originalPrice: 60.00,
        rating: 4.9,
        reviewCount: 156,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop&crop=center",
        vendor: "Heritage Fashion",
        isNew: true,
      },
      {
        id: "cloth2",
        name: "Premium Cotton T-Shirt",
        price: 22.99,
        rating: 4.4,
        reviewCount: 89,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
        vendor: "Urban Style",
        isFeatured: true,
      },
      {
        id: "cloth3",
        name: "Designer Jeans Collection",
        price: 78.50,
        originalPrice: 95.00,
        rating: 4.6,
        reviewCount: 203,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center",
        vendor: "Denim Masters",
        isNew: true,
      },
      {
        id: "cloth4",
        name: "Elegant Evening Gown",
        price: 120.00,
        rating: 4.8,
        reviewCount: 67,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop&crop=center",
        vendor: "Luxury Fashion",
        isFeatured: true,
      },
      {
        id: "cloth5",
        name: "Casual Hoodie Sweatshirt",
        price: 35.99,
        originalPrice: 45.00,
        rating: 4.5,
        reviewCount: 234,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center",
        vendor: "Comfort Wear",
        isNew: true,
      },
      {
        id: "cloth6",
        name: "Formal Business Suit",
        price: 180.00,
        rating: 4.7,
        reviewCount: 89,
        image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&h=400&fit=crop&crop=center",
        vendor: "Professional Attire",
        isFeatured: true,
      },
    ]
  },
  toys: {
    name: "Toys",
    icon: Baby,
    description: "Toys and children entertainment",
    productCount: 987,
    products: [
      {
        id: "toy1",
        name: "Educational Wooden Building Blocks",
        price: 35.99,
        originalPrice: 45.00,
        rating: 4.8,
        reviewCount: 234,
        image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop&crop=center",
        vendor: "Educational Toys Co",
        isNew: true,
      },
      {
        id: "toy2",
        name: "Remote Control Car",
        price: 28.50,
        rating: 4.5,
        reviewCount: 156,
        image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop&crop=center",
        vendor: "Toy World",
        isFeatured: true,
      },
      {
        id: "toy3",
        name: "Plush Teddy Bear",
        price: 18.99,
        rating: 4.7,
        reviewCount: 89,
        image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop&crop=center",
        vendor: "Soft Toys Plus",
        isNew: true,
      },
      {
        id: "toy4",
        name: "Art and Craft Kit",
        price: 42.00,
        originalPrice: 55.00,
        rating: 4.6,
        reviewCount: 123,
        image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop&crop=center",
        vendor: "Creative Kids",
        isFeatured: true,
      },
      {
        id: "toy5",
        name: "Puzzle Set 1000 Pieces",
        price: 15.99,
        rating: 4.4,
        reviewCount: 178,
        image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop&crop=center",
        vendor: "Brain Games",
        isNew: true,
      },
      {
        id: "toy6",
        name: "Science Experiment Kit",
        price: 55.00,
        originalPrice: 70.00,
        rating: 4.8,
        reviewCount: 95,
        image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop&crop=center",
        vendor: "Young Scientists",
        isFeatured: true,
      },
    ]
  },
  food: {
    name: "Food",
    icon: UtensilsCrossed,
    description: "Fresh and packaged food items",
    productCount: 1876,
    products: [
      {
        id: "food1",
        name: "Organic Honey from Local Farms",
        price: 12.99,
        originalPrice: 16.99,
        rating: 4.9,
        reviewCount: 345,
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop&crop=center",
        vendor: "Natural Foods Co",
        isNew: true,
      },
      {
        id: "food2",
        name: "Premium Dried Fruits Mix",
        price: 8.50,
        rating: 4.6,
        reviewCount: 234,
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop&crop=center",
        vendor: "Healthy Snacks",
        isFeatured: true,
      },
      {
        id: "food3",
        name: "Artisan Bread Selection",
        price: 6.99,
        rating: 4.7,
        reviewCount: 178,
        image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=400&fit=crop&crop=center",
        vendor: "Bakery Fresh",
        isNew: true,
      },
      {
        id: "food4",
        name: "Gourmet Cheese Collection",
        price: 24.50,
        originalPrice: 32.00,
        rating: 4.8,
        reviewCount: 156,
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop&crop=center",
        vendor: "Cheese Masters",
        isFeatured: true,
      },
      {
        id: "food5",
        name: "Organic Olive Oil",
        price: 18.99,
        originalPrice: 25.00,
        rating: 4.7,
        reviewCount: 267,
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop&crop=center",
        vendor: "Mediterranean Foods",
        isNew: true,
      },
      {
        id: "food6",
        name: "Spice Collection Set",
        price: 14.50,
        rating: 4.5,
        reviewCount: 189,
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop&crop=center",
        vendor: "Spice World",
        isFeatured: true,
      },
    ]
  },
  beverages: {
    name: "Beverages",
    icon: Coffee,
    description: "Drinks and beverage products",
    productCount: 654,
    products: [
      {
        id: "bev1",
        name: "Organic Ethiopian Coffee Beans",
        price: 18.50,
        rating: 4.7,
        reviewCount: 203,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&crop=center",
        vendor: "Mountain Coffee Co",
        isFeatured: true,
      },
      {
        id: "bev2",
        name: "Fresh Fruit Juice Blend",
        price: 4.99,
        originalPrice: 6.99,
        rating: 4.5,
        reviewCount: 167,
        image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop&crop=center",
        vendor: "Fresh Juices",
        isNew: true,
      },
      {
        id: "bev3",
        name: "Herbal Tea Collection",
        price: 12.99,
        rating: 4.8,
        reviewCount: 234,
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop&crop=center",
        vendor: "Tea Garden",
        isFeatured: true,
      },
      {
        id: "bev4",
        name: "Craft Beer Selection",
        price: 15.50,
        originalPrice: 20.00,
        rating: 4.6,
        reviewCount: 98,
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop&crop=center",
        vendor: "Craft Brewery",
        isNew: true,
      },
      {
        id: "bev5",
        name: "Sparkling Mineral Water",
        price: 2.99,
        rating: 4.4,
        reviewCount: 456,
        image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop&crop=center",
        vendor: "Pure Waters",
        isFeatured: true,
      },
      {
        id: "bev6",
        name: "Hot Chocolate Mix",
        price: 8.99,
        originalPrice: 12.00,
        rating: 4.7,
        reviewCount: 134,
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop&crop=center",
        vendor: "Cocoa Delights",
        isNew: true,
      },
    ]
  },
  "para-pharmacy": {
    name: "Para Pharmacy",
    icon: Heart,
    description: "Health and wellness products",
    productCount: 432,
    products: [
      {
        id: "pharm1",
        name: "Natural Vitamin C Supplements",
        price: 22.99,
        originalPrice: 28.99,
        rating: 4.8,
        reviewCount: 189,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center",
        vendor: "Health Plus",
        isNew: true,
      },
      {
        id: "pharm2",
        name: "Essential Oil Diffuser",
        price: 35.00,
        rating: 4.6,
        reviewCount: 145,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center",
        vendor: "Wellness Home",
        isFeatured: true,
      },
      {
        id: "pharm3",
        name: "Organic Protein Powder",
        price: 28.50,
        originalPrice: 35.00,
        rating: 4.7,
        reviewCount: 267,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center",
        vendor: "Nutrition Pro",
        isNew: true,
      },
      {
        id: "pharm4",
        name: "Aromatherapy Candle Set",
        price: 18.99,
        rating: 4.5,
        reviewCount: 123,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center",
        vendor: "Relax & Recharge",
        isFeatured: true,
      },
      {
        id: "pharm5",
        name: "Collagen Peptides",
        price: 32.99,
        originalPrice: 40.00,
        rating: 4.8,
        reviewCount: 178,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center",
        vendor: "Beauty Supplements",
        isNew: true,
      },
      {
        id: "pharm6",
        name: "Yoga Mat Premium",
        price: 25.50,
        rating: 4.6,
        reviewCount: 234,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center",
        vendor: "Fitness Gear",
        isFeatured: true,
      },
    ]
  },
  "home-deco": {
    name: "Home Deco",
    icon: Home,
    description: "Home decoration and interior design",
    productCount: 765,
    products: [
      {
        id: "deco1",
        name: "Modern Wall Art Canvas",
        price: 45.99,
        originalPrice: 65.00,
        rating: 4.8,
        reviewCount: 234,
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center",
        vendor: "Art Gallery",
        isNew: true,
      },
      {
        id: "deco2",
        name: "Ceramic Vase Collection",
        price: 32.50,
        rating: 4.6,
        reviewCount: 156,
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center",
        vendor: "Home Decor Plus",
        isFeatured: true,
      },
      {
        id: "deco3",
        name: "LED String Lights",
        price: 18.99,
        originalPrice: 25.00,
        rating: 4.7,
        reviewCount: 189,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop&crop=center",
        vendor: "Lighting World",
        isNew: true,
      },
      {
        id: "deco4",
        name: "Throw Pillow Set",
        price: 28.00,
        rating: 4.5,
        reviewCount: 98,
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center",
        vendor: "Comfort Home",
        isFeatured: true,
      },
      {
        id: "deco5",
        name: "Plant Pot Collection",
        price: 15.99,
        originalPrice: 22.00,
        rating: 4.6,
        reviewCount: 167,
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center",
        vendor: "Garden Decor",
        isNew: true,
      },
      {
        id: "deco6",
        name: "Mirror Wall Decor",
        price: 55.00,
        rating: 4.7,
        reviewCount: 89,
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center",
        vendor: "Mirror Masters",
        isFeatured: true,
      },
    ]
  },
};

export default function Category() {
  const { categoryName } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get category data based on URL parameter
  const category = categoryData[categoryName as keyof typeof categoryData];

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return category.products;
    }
    
    const query = searchQuery.toLowerCase();
    return category.products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.vendor.toLowerCase().includes(query)
    );
  }, [category.products, searchQuery]);
  
  if (!category) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
            <Button onClick={() => navigate('/')}>Go Back Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Category Header */}
        <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                <category.icon className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-foreground">
                  {category.name}
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground mb-2">
                  {category.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  {category.productCount.toLocaleString()} products available
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-6 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="relative w-full sm:w-80">
                <Input
                  type="text"
                  placeholder="Search in this category..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
            
            {filteredProducts.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No products found for "{searchQuery}"
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
