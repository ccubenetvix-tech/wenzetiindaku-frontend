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
      name: t('pages.shippingInfo.standardShipping'),
      icon: Truck,
      duration: t('pages.shippingInfo.n37BusinessDays'),
      cost: t('pages.shippingInfo.freeOnOrdersOver50'),
      description: t('pages.shippingInfo.regularDeliveryToYourDoorstep'),
      features: [t('pages.shippingInfo.trackingIncluded'), t('pages.shippingInfo.signatureRequired'), t('pages.shippingInfo.insuranceIncluded')],
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    },
    {
      name: t('pages.shippingInfo.expressShipping'),
      icon: Clock,
      duration: t('pages.shippingInfo.n13BusinessDays'),
      cost: "$9.99",
      description: t('pages.shippingInfo.fastDeliveryForUrgentOrders'),
      features: [t('pages.shippingInfo.priorityHandling'), t('pages.shippingInfo.realTimeTracking'), t('pages.shippingInfo.guaranteedDelivery')],
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
    },
    {
      name: t('pages.shippingInfo.sameDayDelivery'),
      icon: Package,
      duration: t('pages.shippingInfo.sameDay'),
      cost: "$19.99",
      description: t('pages.shippingInfo.deliveryWithinHoursSelectAreas'),
      features: [t('pages.shippingInfo.availableInMajorCities'), t('pages.shippingInfo.n2HourDeliveryWindow'), t('pages.shippingInfo.liveTracking')],
      color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    },
    {
      name: t('pages.shippingInfo.internationalShipping'),
      icon: Globe,
      duration: t('pages.shippingInfo.n721BusinessDays'),
      cost: t('pages.shippingInfo.variesByDestination'),
      description: t('pages.shippingInfo.worldwideDeliveryToYourLocation'),
      features: [t('pages.shippingInfo.customsHandling'), t('pages.shippingInfo.dutyCalculation'), t('pages.shippingInfo.internationalTracking')],
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
    }
  ];

  const shippingRegions = [
    {
      region: t('pages.shippingInfo.localSameCity'),
      duration: t('pages.shippingInfo.n12Days'),
      cost: t('pages.shippingInfo.free'),
      coverage: t('pages.shippingInfo.majorCitiesAndSurroundingAreas')
    },
    {
      region: t('pages.shippingInfo.domesticSameCountry'),
      duration: t('pages.shippingInfo.n35Days'),
      cost: t('pages.shippingInfo.freeOnOrders50'),
      coverage: t('pages.shippingInfo.allMajorCitiesAndTowns')
    },
    {
      region: t('pages.shippingInfo.regionalAfrica'),
      duration: t('pages.shippingInfo.n510Days'),
      cost: "$12.99",
      coverage: t('pages.shippingInfo.allAfricanCountries')
    },
    {
      region: t('pages.shippingInfo.international'),
      duration: t('pages.shippingInfo.n1021Days'),
      cost: "$24.99+",
      coverage: t('pages.shippingInfo.worldwideDelivery')
    }
  ];

  const shippingTips = [
    {
      icon: CheckCircle,
      title: t('pages.shippingInfo.verifyYourAddress'),
      description: t('pages.shippingInfo.doubleCheckYourShippingAddressBefore')
    },
    {
      icon: Clock,
      title: t('pages.shippingInfo.orderEarly'),
      description: t('pages.shippingInfo.placeOrdersEarlyInTheDay')
    },
    {
      icon: MapPin,
      title: t('pages.shippingInfo.provideLandmarks'),
      description: t('pages.shippingInfo.includeNearbyLandmarksOrSpecificDelivery')
    },
    {
      icon: Shield,
      title: t('pages.shippingInfo.trackYourPackage'),
      description: t('pages.shippingInfo.useTheTrackingNumberToMonitor')
    }
  ];

  const restrictions = [
    {
      category: t('pages.shippingInfo.hazardousMaterials'),
      items: [t('pages.shippingInfo.batteries'), t('pages.shippingInfo.aerosols'), t('pages.shippingInfo.flammableLiquids'), t('pages.shippingInfo.explosives')],
      reason: t('pages.shippingInfo.safetyRegulationsAndShippingRestrictions')
    },
    {
      category: t('pages.shippingInfo.perishableItems'),
      items: [t('pages.shippingInfo.freshFood'), t('pages.shippingInfo.livePlants'), t('pages.shippingInfo.medications'), t('pages.shippingInfo.cosmetics')],
      reason: t('pages.shippingInfo.requiresSpecialHandlingAndTemperatureControl')
    },
    {
      category: t('pages.shippingInfo.fragileItems'),
      items: [t('pages.shippingInfo.glassware'), t('pages.shippingInfo.electronics'), t('pages.shippingInfo.artwork'), t('pages.shippingInfo.ceramics')],
      reason: t('pages.shippingInfo.mayRequireSpecialPackagingAndHandling')
    },
    {
      category: t('pages.shippingInfo.restrictedItems2'),
      items: [t('pages.shippingInfo.weapons'), t('pages.shippingInfo.alcohol'), t('pages.shippingInfo.tobacco'), t('pages.shippingInfo.prescriptionDrugs')],
      reason: t('pages.shippingInfo.legalRestrictionsAndCustomsRegulations')
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-orange-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('pages.shippingInfo.shippingInformation')}</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {t('pages.shippingInfo.everythingYouNeedToKnowAbout')}
            </p>
          </div>
        </section>

        {/* Shipping Options */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{t('pages.shippingInfo.shippingOptions')}</h2>
            
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
            <h2 className="text-3xl font-bold text-center mb-12">{t('pages.shippingInfo.shippingRegionsTimes')}</h2>
            
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-blue-600" />
                    {t('pages.shippingInfo.deliveryCoverage')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">{t('pages.shippingInfo.region')}</th>
                          <th className="text-left py-3 px-4 font-semibold">{t('pages.shippingInfo.deliveryTime')}</th>
                          <th className="text-left py-3 px-4 font-semibold">{t('pages.shippingInfo.cost')}</th>
                          <th className="text-left py-3 px-4 font-semibold">{t('pages.shippingInfo.coverage')}</th>
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
            <h2 className="text-3xl font-bold text-center mb-12">{t('pages.shippingInfo.shippingTips')}</h2>
            
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
            <h2 className="text-3xl font-bold text-center mb-12">{t('pages.shippingInfo.shippingRestrictions')}</h2>
            
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
                        <h4 className="font-semibold mb-2">{t('pages.shippingInfo.restrictedItems')}</h4>
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
                        <h4 className="font-semibold mb-2">{t('pages.shippingInfo.reason')}</h4>
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
              <h2 className="text-3xl font-bold mb-8">{t('pages.shippingInfo.trackYourPackage')}</h2>
              <p className="text-muted-foreground mb-8">
                {t('pages.shippingInfo.onceYourOrderShipsYouLl')}
              </p>
              
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4" />
                      <span>{t('pages.shippingInfo.enterYourTrackingNumberBelow')}</span>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder={t('pages.shippingInfo.enterTrackingNumber')}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Button>{t('pages.shippingInfo.trackPackage')}</Button>
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
            <h2 className="text-3xl font-bold mb-4">{t('pages.shippingInfo.needHelpWithShipping')}</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('pages.shippingInfo.haveQuestionsAboutYourOrderOr')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
                {t('pages.shippingInfo.contactSupport')}
              </Button>
              <Button size="lg" variant="outline">
                {t('pages.shippingInfo.checkOrderStatus')}
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
