import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MessageCircle, Search, HelpCircle, FileText, Users, Clock } from "lucide-react";

export default function HelpCenter() {
  const { t } = useTranslation();

  const helpCategories = [
    {
      icon: FileText,
      title: t('pages.helpCenter.gettingStarted'),
      description: t('pages.helpCenter.learnHowToUseOurMarketplace'),
      topics: [t('pages.helpCenter.accountSetup'), t('pages.helpCenter.firstPurchase'), t('pages.helpCenter.profileManagement'), t('pages.helpCenter.securityTips')]
    },
    {
      icon: Users,
      title: t('pages.helpCenter.accountProfile'),
      description: t('pages.helpCenter.manageYourAccountSettings'),
      topics: [t('pages.helpCenter.passwordReset'), t('pages.helpCenter.emailVerification'), t('pages.helpCenter.profileUpdates'), t('pages.helpCenter.accountDeletion')]
    },
    {
      icon: Clock,
      title: t('pages.helpCenter.ordersShipping'),
      description: t('pages.helpCenter.trackAndManageYourOrders'),
      topics: [t('pages.helpCenter.orderTracking'), t('pages.helpCenter.shippingOptions'), t('pages.helpCenter.deliveryIssues'), t('pages.helpCenter.orderHistory')]
    },
    {
      icon: HelpCircle,
      title: t('pages.helpCenter.paymentBilling'),
      description: t('pages.helpCenter.paymentMethodsAndBilling'),
      topics: [t('pages.helpCenter.paymentMethods'), t('pages.helpCenter.billingIssues'), t('pages.helpCenter.refunds'), t('pages.helpCenter.paymentSecurity')]
    }
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

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder={t('pages.helpCenter.searchForHelp')}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{t('pages.helpCenter.howCanWeHelpYou')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {helpCategories.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit">
                      <category.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <p className="text-muted-foreground text-sm">{category.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="text-sm text-muted-foreground hover:text-primary cursor-pointer">
                          • {topic}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{t('pages.helpCenter.emailSupport')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{t('pages.helpCenter.getHelpViaEmail')}</p>
                    <Button variant="outline" size="sm">{t('pages.helpCenter.sendEmail')}</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <Phone className="h-8 w-8 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{t('pages.helpCenter.phoneSupport')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{t('pages.helpCenter.callUsDirectly')}</p>
                    <Button variant="outline" size="sm">{t('pages.helpCenter.callNow')}</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{t('pages.helpCenter.liveChat')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{t('pages.helpCenter.chatWithSupport')}</p>
                    <Button variant="outline" size="sm">{t('pages.helpCenter.startChat')}</Button>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>{t('pages.helpCenter.sendUsAMessage')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder={t('pages.helpCenter.yourName')} />
                    <Input placeholder={t('pages.helpCenter.yourEmail')} type="email" />
                  </div>
                  <Input placeholder={t('pages.helpCenter.subject')} />
                  <Textarea placeholder={t('pages.helpCenter.yourMessage')} rows={4} />
                  <Button className="w-full">{t('pages.helpCenter.sendMessage')}</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
