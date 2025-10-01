import { useTranslation } from "react-i18next";
import { 
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CategoryCard } from "@/components/CategoryCard";
import { useNavigate } from "react-router-dom";

// Categories data with proper names matching the CategoryCard component

const Categories = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // All categories with their synthetic data
  const allCategories = [
    {
      name: 'Cosmetics',
      href: '/category/cosmetics',
      description: 'Beauty and personal care products',
      productCount: 1247,
      products: [
        {
          id: "cosm1",
          name: "Premium African Shea Butter Face Cream",
          price: 24.99,
          originalPrice: 34.99,
          rating: 4.8,
          reviewCount: 127,
          image: "/marketplace.jpeg",
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
          image: "/marketplace.jpeg",
          vendor: "Natural Beauty Co",
          isFeatured: true,
        },
      ]
    },
    {
      name: 'Tech Products',
      href: '/category/tech',
      description: 'Electronics and technology gadgets',
      productCount: 2156,
      products: [
        {
          id: "tech1",
          name: "Samsung Galaxy Smartphone Case",
          price: 19.99,
          rating: 4.6,
          reviewCount: 89,
          image: "/marketplace.jpeg",
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
          image: "/marketplace.jpeg",
          vendor: "AudioTech Pro",
          isNew: true,
        },
      ]
    },
    {
      name: 'Clothes',
      href: '/category/clothes',
      description: 'Fashion and clothing items',
      productCount: 3421,
      products: [
        {
          id: "cloth1",
          name: "Traditional African Print Dress",
          price: 45.00,
          originalPrice: 60.00,
          rating: 4.9,
          reviewCount: 156,
          image: "/marketplace.jpeg",
          vendor: "Heritage Fashion",
          isNew: true,
        },
        {
          id: "cloth2",
          name: "Premium Cotton T-Shirt",
          price: 22.99,
          rating: 4.4,
          reviewCount: 89,
          image: "/marketplace.jpeg",
          vendor: "Urban Style",
          isFeatured: true,
        },
      ]
    },
    {
      name: 'Toys',
      href: '/category/toys',
      description: 'Toys and children entertainment',
      productCount: 987,
      products: [
        {
          id: "toy1",
          name: "Educational Wooden Building Blocks",
          price: 35.99,
          originalPrice: 45.00,
          rating: 4.8,
          reviewCount: 234,
          image: "/marketplace.jpeg",
          vendor: "Educational Toys Co",
          isNew: true,
        },
        {
          id: "toy2",
          name: "Remote Control Car",
          price: 28.50,
          rating: 4.5,
          reviewCount: 156,
          image: "/marketplace.jpeg",
          vendor: "Toy World",
          isFeatured: true,
        },
      ]
    },
    {
      name: 'Food',
      href: '/category/food',
      description: 'Fresh and packaged food items',
      productCount: 1876,
      products: [
        {
          id: "food1",
          name: "Organic Honey from Local Farms",
          price: 12.99,
          originalPrice: 16.99,
          rating: 4.9,
          reviewCount: 345,
          image: "/marketplace.jpeg",
          vendor: "Natural Foods Co",
          isNew: true,
        },
        {
          id: "food2",
          name: "Premium Dried Fruits Mix",
          price: 8.50,
          rating: 4.6,
          reviewCount: 234,
          image: "/marketplace.jpeg",
          vendor: "Healthy Snacks",
          isFeatured: true,
        },
      ]
    },
    {
      name: 'Beverages',
      href: '/category/beverages',
      description: 'Drinks and beverage products',
      productCount: 654,
      products: [
        {
          id: "bev1",
          name: "Organic Ethiopian Coffee Beans",
          price: 18.50,
          rating: 4.7,
          reviewCount: 203,
          image: "/marketplace.jpeg",
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
          image: "/marketplace.jpeg",
          vendor: "Fresh Juices",
          isNew: true,
        },
      ]
    },
    {
      name: 'Para-Pharmacy',
      href: '/category/para-pharmacy',
      description: 'Health and wellness products',
      productCount: 432,
      products: [
        {
          id: "pharm1",
          name: "Natural Vitamin C Supplements",
          price: 22.99,
          originalPrice: 28.99,
          rating: 4.8,
          reviewCount: 189,
          image: "/marketplace.jpeg",
          vendor: "Health Plus",
          isNew: true,
        },
        {
          id: "pharm2",
          name: "Essential Oil Diffuser",
          price: 35.00,
          rating: 4.6,
          reviewCount: 145,
          image: "/marketplace.jpeg",
          vendor: "Wellness Home",
          isFeatured: true,
        },
      ]
    },
    {
      name: 'Home Deco',
      href: '/category/home-deco',
      description: 'Home decoration and interior design',
      productCount: 765,
      products: [
        {
          id: "deco1",
          name: "Modern Wall Art Canvas",
          price: 45.99,
          originalPrice: 65.00,
          rating: 4.8,
          reviewCount: 234,
          image: "/marketplace.jpeg",
          vendor: "Art Gallery",
          isNew: true,
        },
        {
          id: "deco2",
          name: "Ceramic Vase Collection",
          price: 32.50,
          rating: 4.6,
          reviewCount: 156,
          image: "/marketplace.jpeg",
          vendor: "Home Decor Plus",
          isFeatured: true,
        },
      ]
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-navy-800">
          <div className="container mx-auto px-4 py-12">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-gray-600 dark:text-gray-300 hover:text-navy-600 dark:hover:text-navy-400"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                All Categories
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Explore our diverse marketplace with thousands of products across multiple categories
              </p>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 bg-gray-50 dark:bg-navy-950">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allCategories.map((category, index) => (
                <div key={index} className={`group animate-slide-up ${index < 8 ? `stagger-${index + 1}` : 'stagger-8'}`}>
                  <CategoryCard
                    name={category.name}
                    href={category.href}
                    description={category.description}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
