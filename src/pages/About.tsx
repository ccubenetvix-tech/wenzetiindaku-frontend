import { useTranslation } from "react-i18next";
import {
  Info,
  Users,
  Target,
  Award,
  Mail,
  MapPin,
  Phone,
  Heart,
  Globe,
  Shield
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

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

        {/* Mission Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <Target className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-3xl font-bold">{t('missionTitle')}</h2>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  {t('missionText1')}
                </p>
                <p className="text-lg text-muted-foreground">
                  {t('missionText2')}
                </p>
              </div>
              <div className="bg-card p-8 rounded-lg shadow-sm">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                    <div className="text-muted-foreground">{t('activeVendors')}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-secondary mb-2">50K+</div>
                    <div className="text-muted-foreground">{t('products')}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">25K+</div>
                    <div className="text-muted-foreground">{t('happyCustomers')}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-secondary mb-2">15</div>
                    <div className="text-muted-foreground">{t('countries')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('valuesTitle')}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('valuesSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">{t('communityFirst')}</h3>
                <p className="text-muted-foreground">
                  {t('communityDesc')}
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <Shield className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">{t('trustSecurity')}</h3>
                <p className="text-muted-foreground">
                  {t('trustDesc')}
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">{t('globalReach')}</h3>
                <p className="text-muted-foreground">
                  {t('globalDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-primary mr-3" />
                <h2 className="text-3xl font-bold">{t('ourStoryTitle')}</h2>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('ourStoryText')}
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-primary">{t('whatWeDo')}</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-secondary mr-3 mt-0.5" />
                      <span>{t('whatWeDo1')}</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-secondary mr-3 mt-0.5" />
                      <span>{t('whatWeDo2')}</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-secondary mr-3 mt-0.5" />
                      <span>{t('whatWeDo3')}</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-secondary mr-3 mt-0.5" />
                      <span>{t('whatWeDo4')}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4 text-secondary">{t('ourImpact')}</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <span>{t('impact1')}</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <span>{t('impact2')}</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <span>{t('impact3')}</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <span>{t('impact4')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('getInTouch')}</h2>
              <p className="text-xl text-muted-foreground">
                {t('getInTouchSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{t('emailUs')}</h3>
                <p className="text-muted-foreground">info@wenzendaku.com</p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <Phone className="h-8 w-8 text-secondary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{t('callUs')}</h3>
                <p className="text-muted-foreground">+234 123 456 7890</p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{t('visitUs')}</h3>
                <p className="text-muted-foreground">Lagos, Nigeria</p>
              </div>
            </div>

            <div className="text-center">
              <Button size="lg" className="mr-4">
                <Mail className="h-4 w-4 mr-2" />
                {t('contactUs')}
              </Button>
              <Button variant="outline" size="lg">
                {t('learnMore')}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
