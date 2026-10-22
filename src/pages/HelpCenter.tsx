import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mail, MessageCircle, HelpCircle, FileText, RotateCcw, Truck, Shield } from "lucide-react";

export default function HelpCenter() {
  const { t } = useTranslation();

  // Pages that hold the client's own documents.
  const helpLinks = [
    { icon: HelpCircle, title: t('legalDocs.faq.title'), href: '/faq' },
    { icon: RotateCcw, title: t('legalDocs.returns.title'), href: '/returns' },
    { icon: Truck, title: t('pages.shippingInfo.shippingInformation'), href: '/shipping' },
    { icon: FileText, title: t('legalDocs.terms.title'), href: '/terms' },
    { icon: FileText, title: t('legalDocs.vendorTerms.title'), href: '/vendor-terms' },
    { icon: Shield, title: t('legalDocs.privacy.title'), href: '/privacy' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-orange-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('pages.helpCenter.helpCenter')}</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {t('pages.helpCenter.findAnswersToYourQuestionsAnd')}
            </p>

          </div>
        </section>

        {/* Help Categories */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{t('pages.helpCenter.howCanWeHelpYou')}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpLinks.map((link) => (
                <Link key={link.href} to={link.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit">
                        <link.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <CardTitle className="text-lg">{link.title}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>



        {/* Contact Support */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">{t('pages.helpCenter.stillNeedHelp')}</h2>
              <p className="text-muted-foreground mb-8">
                {t('pages.helpCenter.canTFindWhatYouRe')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{t('pages.helpCenter.emailSupport')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{t('pages.helpCenter.getHelpViaEmail')}</p>
                    <Button asChild variant="outline" size="sm">
                      <a href="mailto:wenzetiindaku@outlook.com">{t('pages.helpCenter.sendEmail')}</a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{t('whatsappMessagesOnly')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">+32 495 84 68 66</p>
                    <Button asChild variant="outline" size="sm">
                      <a href="https://wa.me/32495846866" target="_blank" rel="noopener noreferrer">
                        {t('pages.helpCenter.sendWhatsappMessage')}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
