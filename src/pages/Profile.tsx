import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  User,
  MapPin,
  CreditCard,
  Clock,
  Heart,
  Globe,
  Edit,
  Save,
  Eye,
  Truck,
  RefreshCw,
  LogOut,
  Settings
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { formatDate, formatStatus } from "@/lib/format";
const Profile = () => {
  const { t, i18n } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'af', name: 'Afrikaans' },
    { code: 'sw', name: 'Kiswahili' },
    { code: 'zu', name: 'isiZulu' }
  ];

  const orderHistory = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "Delivered",
      total: 69.98,
      items: 2,
      trackingNumber: "TRK123456789"
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "In Transit",
      total: 24.99,
      items: 1,
      trackingNumber: "TRK987654321"
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      status: "Processing",
      total: 45.00,
      items: 1,
      trackingNumber: "TRK456789123"
    }
  ];

  const wishlistItems = [
    {
      id: "1",
      name: "Premium African Shea Butter Face Cream",
      price: 24.99,
      originalPrice: 34.99,
      rating: 4.8,
      reviewCount: 127,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center",
      vendor: "AfriBeauty Store",
    },
    {
      id: "2",
      name: "Traditional African Print Dress",
      price: 45.00,
      rating: 4.9,
      reviewCount: 156,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center",
      vendor: "Heritage Fashion",
    }
  ];

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-success text-success-foreground';
      case 'In Transit': return 'bg-secondary text-secondary-foreground';
      case 'Processing': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-8 text-white mb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{t('pages.profile.johnDoe')}</h1>
                <p className="text-white/90 mb-1">john.doe@example.com</p>
                <p className="text-white/80">{t('pages.profile.memberSinceJanuary2023')}</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="tabs-scroll no-scrollbar sm:grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="personal" className="flex items-center gap-2 min-w-[140px] sm:min-w-0">
                <User className="h-4 w-4" />
                {t('pages.profile.personalInfo')}
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex items-center gap-2 min-w-[140px] sm:min-w-0">
                <MapPin className="h-4 w-4" />
                {t('pages.profile.addresses')}
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2 min-w-[140px] sm:min-w-0">
                <CreditCard className="h-4 w-4" />
                {t('pages.profile.payment')}
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2 min-w-[140px] sm:min-w-0">
                <Clock className="h-4 w-4" />
                {t('pages.profile.orderHistory')}
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2 min-w-[140px] sm:min-w-0">
                <Heart className="h-4 w-4" />
                {t('pages.profile.wishlist')}
              </TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    {t('pages.profile.personalInformation')}
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {t('pages.profile.saveChanges')}
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        {t('pages.profile.editProfile')}
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">{t('pages.profile.firstName')}</Label>
                    <Input
                      id="firstName"
                      defaultValue="John"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t('pages.profile.lastName')}</Label>
                    <Input
                      id="lastName"
                      defaultValue="Doe"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t('pages.profile.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="john.doe@example.com"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t('pages.profile.phoneNumber')}</Label>
                    <Input
                      id="phone"
                      defaultValue="+32 495 84 68 66"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Language Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-primary" />
                    {t('language')} {t('pages.profile.settings')}
                  </h3>
                  <div className="max-w-xs">
                    <Label htmlFor="language">{t('pages.profile.preferredLanguage')}</Label>
                    <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Shipping Addresses */}
            <TabsContent value="addresses">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    {t('pages.profile.shippingAddresses')}
                  </h2>
                  <Button>{t('pages.profile.addNewAddress')}</Button>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{t('pages.profile.homeAddress')}</h3>
                      <Badge variant="secondary">{t('pages.profile.default')}</Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {t('pages.profile.kinshasaKinshasa0000')}<br />
                      {t('pages.profile.drCongo')}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        {t('pages.profile.edit')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Payment Methods */}
            <TabsContent value="payment">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-primary" />
                    {t('pages.profile.paymentMethods')}
                  </h2>
                  <Button>{t('pages.profile.addPaymentMethod')}</Button>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-medium">•••• •••• •••• 4242</h3>
                          <p className="text-sm text-muted-foreground">{t('pages.profile.expires1225')}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{t('pages.profile.default')}</Badge>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        {t('pages.profile.edit')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Order History */}
            <TabsContent value="orders">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  {t('pages.profile.orderHistory')}
                </h2>

                <div className="space-y-4">
                  {orderHistory.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{t('pages.profile.orderId', { id: order.id })}</h3>
                          <p className="text-sm text-muted-foreground">
                            {t('pages.profile.placedOnValue', { value: formatDate(order.date) })}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {formatStatus(order.status)}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <p>{t('pages.profile.itemsItemSTotalTotal', { items: order.items, total: order.total })}</p>
                          <p>{t('pages.profile.trackingTrackingnumber', { trackingNumber: order.trackingNumber })}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            {t('pages.profile.viewDetails')}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Truck className="h-3 w-3 mr-1" />
                            {t('pages.profile.trackOrder')}
                          </Button>
                          {order.status === 'Delivered' && (
                            <Button variant="outline" size="sm">
                              <RefreshCw className="h-3 w-3 mr-1" />
                              {t('pages.profile.reorder')}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Wishlist */}
            <TabsContent value="wishlist">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-primary" />
                  {t('pages.profile.wishlistCountItems', { count: wishlistItems.length })}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Account Actions */}
          <div className="bg-card rounded-lg p-6 shadow-sm mt-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-primary" />
              {t('pages.profile.accountActions')}
            </h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                {t('pages.profile.editProfile')}
              </Button>
              <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                <LogOut className="h-4 w-4 mr-2" />
                {t('pages.profile.signOut')}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;