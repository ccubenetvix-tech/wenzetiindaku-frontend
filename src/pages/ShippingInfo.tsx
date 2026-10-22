import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Clock, Package, RotateCcw } from "lucide-react";

// Only states what the client's documents say about delivery (Frequently Asked Questions, Return and Refund Policy, bug checklist).
export default function ShippingInfo() {
  const { t } = useTranslation();

  const sections = [
    {
      icon: Truck,
      title: t('pages.shippingInfo.deliveryFees'),
      lines: [t('deliveryFeeNotice'), t('pages.shippingInfo.shownAtCheckout')],
    },
    {
      icon: Clock,
      title: t('pages.shippingInfo.deliveryTimeTitle'),
      lines: [t('pages.shippingInfo.deliveryTimeText')],
    },
    {
      icon: Package,
      title: t('pages.shippingInfo.orderStatus'),
      lines: [t('pages.shippingInfo.checkStatusInMyOrders')],
    },
    {
      icon: RotateCcw,
      title: t('pages.shippingInfo.returnsTitle'),
      lines: [t('pages.shippingInfo.returnsSummary')],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-orange-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('pages.shippingInfo.shippingInformation')}</h1>
            <p className="text-xl max-w-2xl mx-auto">{t('pages.shippingInfo.howDeliveryWorks')}</p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-3xl space-y-6">
            {sections.map((section) => (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <section.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                  {section.lines.map((line) => <p key={line}>{line}</p>)}
                </CardContent>
              </Card>
            ))}
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
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
                <Link to="/contact">{t('pages.shippingInfo.contactSupport')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/returns">{t('pages.shippingInfo.returnsTitle')}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
