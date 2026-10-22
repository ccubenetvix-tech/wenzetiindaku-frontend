import { useTranslation } from "react-i18next";
import { Info, Store, Mail, MapPin, MessageCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Only states what the client's documents say (Frequently Asked Questions, section 1).
const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-r from-primary to-secondary">
          <div className="container mx-auto px-4 text-center text-white">
            <div className="flex items-center justify-center mb-6">
              <Info className="h-12 w-12 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold">
                {t('aboutTitle')}
              </h1>
            </div>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              {t('aboutSubtitle')}
            </p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-4xl space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">{t('aboutPage.whoWeAreTitle')}</h2>
              <p className="text-lg text-muted-foreground">{t('aboutPage.whoWeAreText')}</p>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <MapPin className="h-7 w-7 text-primary mr-3" />
                <h2 className="text-2xl font-bold">{t('aboutPage.offerTitle')}</h2>
              </div>
              <p className="text-lg text-muted-foreground">{t('aboutPage.whereText')}</p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <div className="flex items-center mb-3">
                <Store className="h-6 w-6 text-secondary mr-3" />
                <h3 className="text-xl font-semibold">{t('aboutPage.intermediaryTitle')}</h3>
              </div>
              <p className="text-muted-foreground">{t('aboutPage.intermediaryText')}</p>
            </div>

            <p className="text-center text-sm text-muted-foreground italic">{t('aboutPage.registration')}</p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('getInTouch')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{t('emailUs')}</h3>
                <p className="text-muted-foreground">wenzetiindaku@outlook.com</p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <MessageCircle className="h-8 w-8 text-secondary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{t('whatsappMessagesOnly')}</h3>
                <a
                  href="https://wa.me/32495846866"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  +32 495 84 68 66
                </a>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{t('aboutPage.location')}</h3>
                <p className="text-muted-foreground">{t('pages.about.kinshasaRDCongo')}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
