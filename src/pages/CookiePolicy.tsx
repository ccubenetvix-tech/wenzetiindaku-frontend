import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const CookiePolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                  They are widely used to make websites work more efficiently and to provide information to website owners.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  WENZE TII NDAKU uses cookies to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
                  <li>Remember your language preferences</li>
                  <li>Keep track of items in your shopping cart</li>
                  <li>Provide personalized content and recommendations</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Improve website functionality and user experience</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-2">Essential Cookies</h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies are necessary for the website to function properly. They enable basic functions like page navigation, 
                    access to secure areas, and shopping cart functionality.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-2">Performance Cookies</h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies collect information about how visitors use our website, such as which pages are visited most often. 
                    This helps us improve how our website works.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-2">Functional Cookies</h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies enable the website to remember choices you make (such as your language preference) and provide 
                    enhanced, more personal features.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-2">Marketing Cookies</h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies are used to track visitors across websites to display relevant and engaging advertisements.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Managing Your Cookie Preferences</h2>
                <p className="text-muted-foreground mb-4">
                  You can control and manage cookies in various ways. Please note that removing or blocking cookies can impact 
                  your user experience and parts of our website may no longer be fully accessible.
                </p>
                
                <div className="mb-4">
                  <h3 className="text-xl font-medium mb-2">Browser Settings</h3>
                  <p className="text-muted-foreground mb-2">
                    Most browsers allow you to refuse cookies or delete them. You can usually find these settings in the 
                    "Options" or "Preferences" menu of your browser.
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-medium mb-2">Cookie Consent</h3>
                  <p className="text-muted-foreground mb-2">
                    When you first visit our website, you will be asked to consent to our use of cookies. You can change 
                    your preferences at any time by clicking the cookie settings link in our footer.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  Some cookies on our website are set by third-party services. These may include:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
                  <li>Google Analytics for website analytics</li>
                  <li>Social media platforms for sharing content</li>
                  <li>Payment processors for secure transactions</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about our use of cookies, please contact us at:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-muted-foreground">
                    Email: privacy@wenzetiindaku.com<br />
                    Phone: +1 (555) 123-4567<br />
                    Address: 123 Marketplace St, Commerce City
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
                <p className="text-muted-foreground mb-4">
                  We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new 
                  Cookie Policy on this page and updating the "Last updated" date.
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
