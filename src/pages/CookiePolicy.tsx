import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

import { formatDate } from "@/lib/format";
const CookiePolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{t('pages.cookiePolicy.cookiePolicy')}</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-6">
                {t('pages.cookiePolicy.lastUpdatedValue', { value: formatDate(new Date()) })}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('pages.cookiePolicy.whatAreCookies')}</h2>
                <p className="text-muted-foreground mb-4">
                  {t('pages.cookiePolicy.cookiesAreSmallTextFilesThat')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('pages.cookiePolicy.howWeUseCookies')}</h2>
                <p className="text-muted-foreground mb-4">
                  {t('pages.cookiePolicy.wenzeTiiNdakuUsesCookiesTo')}
                </p>
                <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
                  <li>{t('pages.cookiePolicy.rememberYourLanguagePreferences')}</li>
                  <li>{t('pages.cookiePolicy.keepTrackOfItemsInYour')}</li>
                  <li>{t('pages.cookiePolicy.providePersonalizedContentAndRecommendations')}</li>
                  <li>{t('pages.cookiePolicy.analyzeWebsiteTrafficAndUsagePatterns')}</li>
                  <li>{t('pages.cookiePolicy.improveWebsiteFunctionalityAndUserExperience')}</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('pages.cookiePolicy.typesOfCookiesWeUse')}</h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-2">{t('pages.cookiePolicy.essentialCookies')}</h3>
                  <p className="text-muted-foreground mb-2">
                    {t('pages.cookiePolicy.theseCookiesAreNecessaryForThe')}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-2">{t('pages.cookiePolicy.performanceCookies')}</h3>
                  <p className="text-muted-foreground mb-2">
                    {t('pages.cookiePolicy.theseCookiesCollectInformationAboutHow')}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-2">{t('pages.cookiePolicy.functionalCookies')}</h3>
                  <p className="text-muted-foreground mb-2">
                    {t('pages.cookiePolicy.theseCookiesEnableTheWebsiteTo')}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-2">{t('pages.cookiePolicy.marketingCookies')}</h3>
                  <p className="text-muted-foreground mb-2">
                    {t('pages.cookiePolicy.theseCookiesAreUsedToTrack')}
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('pages.cookiePolicy.managingYourCookiePreferences')}</h2>
                <p className="text-muted-foreground mb-4">
                  {t('pages.cookiePolicy.youCanControlAndManageCookies')}
                </p>
                
                <div className="mb-4">
                  <h3 className="text-xl font-medium mb-2">{t('pages.cookiePolicy.browserSettings')}</h3>
                  <p className="text-muted-foreground mb-2">
                    {t('pages.cookiePolicy.mostBrowsersAllowYouToRefuse')}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-medium mb-2">{t('pages.cookiePolicy.cookieConsent')}</h3>
                  <p className="text-muted-foreground mb-2">
                    {t('pages.cookiePolicy.whenYouFirstVisitOurWebsite')}
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('pages.cookiePolicy.thirdPartyCookies')}</h2>
                <p className="text-muted-foreground mb-4">
                  {t('pages.cookiePolicy.someCookiesOnOurWebsiteAre')}
                </p>
                <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
                  <li>{t('pages.cookiePolicy.googleAnalyticsForWebsiteAnalytics')}</li>
                  <li>{t('pages.cookiePolicy.socialMediaPlatformsForSharingContent')}</li>
                  <li>{t('pages.cookiePolicy.paymentProcessorsForSecureTransactions')}</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('pages.cookiePolicy.contactUs')}</h2>
                <p className="text-muted-foreground mb-4">
                  {t('pages.cookiePolicy.ifYouHaveAnyQuestionsAbout')}
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-muted-foreground">
                    {t('pages.cookiePolicy.emailPrivacyWenzetiindakuCom')}<br />
                    {t('pages.cookiePolicy.phone15551234567')}<br />
                    {t('pages.cookiePolicy.address123MarketplaceStCommerceCity')}
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t('pages.cookiePolicy.updatesToThisPolicy')}</h2>
                <p className="text-muted-foreground mb-4">
                  {t('pages.cookiePolicy.weMayUpdateThisCookiePolicy')}
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
