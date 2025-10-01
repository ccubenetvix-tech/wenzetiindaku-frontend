import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Truck, 
  Clock, 
  MapPin, 
  Package, 
  Shield, 
  Globe, 
  CheckCircle, 
  AlertCircle,
  Info
} from "lucide-react";

export default function ShippingInfo() {
  const { t } = useTranslation();

  const shippingOptions = [
    {
      name: "Standard Shipping",
      icon: Truck,
      duration: "3-7 business days",
      cost: "Free on orders over $50",
      description: "Regular delivery to your doorstep",
      features: ["Tracking included", "Signature required", "Insurance included"],
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    },
    {
      name: "Express Shipping",
      icon: Clock,
      duration: "1-3 business days",
      cost: "$9.99",
      description: "Fast delivery for urgent orders",
      features: ["Priority handling", "Real-time tracking", "Guaranteed delivery"],
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
    },
    {
      name: "Same Day Delivery",
      icon: Package,
      duration: "Same day",
      cost: "$19.99",
      description: "Delivery within hours (select areas)",
      features: ["Available in major cities", "2-hour delivery window", "Live tracking"],
      color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    },
    {
      name: "International Shipping",
      icon: Globe,
      duration: "7-21 business days",
      cost: "Varies by destination",
      description: "Worldwide delivery to your location",
      features: ["Customs handling", "Duty calculation", "International tracking"],
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
    }
  ];

  const shippingRegions = [
    {
      region: "Local (Same City)",
      duration: "1-2 days",
      cost: "Free",
      coverage: "Major cities and surrounding areas"
    },
    {
      region: "Domestic (Same Country)",
      duration: "3-5 days",
      cost: "Free on orders $50+",
      coverage: "All major cities and towns"
    },
    {
      region: "Regional (Africa)",
      duration: "5-10 days",
      cost: "$12.99",
      coverage: "All African countries"
    },
    {
      region: "International",
      duration: "10-21 days",
      cost: "$24.99+",
      coverage: "Worldwide delivery"
    }
  ];

  const shippingTips = [
    {
      icon: CheckCircle,
      title: "Verify Your Address",
      description: "Double-check your shipping address before placing your order to avoid delays."
    },
    {
      icon: Clock,
      title: "Order Early",
      description: "Place orders early in the day for same-day processing and faster delivery."
    },
    {
      icon: MapPin,
      title: "Provide Landmarks",
      description: "Include nearby landmarks or specific delivery instructions for easier location."
    },
    {
      icon: Shield,
      title: "Track Your Package",
      description: "Use the tracking number to monitor your package's progress in real-time."
    }
  ];

  const restrictions = [
    {
      category: "Hazardous Materials",
      items: ["Batteries", "Aerosols", "Flammable liquids", "Explosives"],
      reason: "Safety regulations and shipping restrictions"
    },
    {
      category: "Perishable Items",
      items: ["Fresh food", "Live plants", "Medications", "Cosmetics"],
      reason: "Requires special handling and temperature control"
    },
    {
      category: "Fragile Items",
      items: ["Glassware", "Electronics", "Artwork", "Ceramics"],
      reason: "May require special packaging and handling"
    },
    {
      category: "Restricted Items",
      items: ["Weapons", "Alcohol", "Tobacco", "Prescription drugs"],
      reason: "Legal restrictions and customs regulations"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-orange-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shipping Information</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Everything you need to know about shipping, delivery, and tracking your orders
            </p>
          </div>
        </section>

        {/* Shipping Options */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Shipping Options</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {shippingOptions.map((option, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/20 dark:to-orange-900/20 rounded-full w-fit">
                      <option.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">{option.name}</CardTitle>
                    <Badge className={`w-fit mx-auto ${option.color}`}>
                      {option.duration}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <p className="text-2xl font-bold text-primary">{option.cost}</p>
                    </div>
                    <ul className="space-y-2">
                      {option.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Shipping Regions */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Shipping Regions & Times</h2>
            
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-blue-600" />
                    Delivery Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Region</th>
                          <th className="text-left py-3 px-4 font-semibold">Delivery Time</th>
                          <th className="text-left py-3 px-4 font-semibold">Cost</th>
                          <th className="text-left py-3 px-4 font-semibold">Coverage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shippingRegions.map((region, index) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium">{region.region}</td>
                            <td className="py-3 px-4">{region.duration}</td>
                            <td className="py-3 px-4 font-semibold text-primary">{region.cost}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{region.coverage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Shipping Tips */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Shipping Tips</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {shippingTips.map((tip, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-full w-fit">
                      <tip.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold mb-2">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Shipping Restrictions */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Shipping Restrictions</h2>
            
            <div className="max-w-4xl mx-auto space-y-6">
              {restrictions.map((restriction, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      {restriction.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Restricted Items:</h4>
                        <ul className="space-y-1">
                          {restriction.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Reason:</h4>
                        <p className="text-sm text-muted-foreground">{restriction.reason}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tracking Information */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">Track Your Package</h2>
              <p className="text-muted-foreground mb-8">
                Once your order ships, you'll receive a tracking number to monitor your package's journey.
              </p>
              
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4" />
                      <span>Enter your tracking number below</span>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Enter tracking number"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Button>Track Package</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help with Shipping?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Have questions about your order or shipping? Our support team is here to help.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
                Contact Support
              </Button>
              <Button size="lg" variant="outline">
                Check Order Status
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
