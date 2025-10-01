import { useTranslation } from "react-i18next";
import { FileText, Scale, AlertCircle, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const TermsOfService = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-secondary">
          <div className="container mx-auto px-4 text-center text-white">
            <div className="flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold">Terms of Service</h1>
            </div>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90">
              The terms and conditions governing the use of our marketplace
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Last Updated */}
            <div className="bg-muted p-4 rounded-lg mb-8">
              <p className="text-sm text-muted-foreground">
                <strong>Last Updated:</strong> December 2024
              </p>
            </div>

            {/* Introduction */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <Scale className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Agreement to Terms</h2>
              </div>
              <div className="bg-card p-6 rounded-lg">
                <p className="text-muted-foreground mb-4">
                  These Terms of Service ("Terms") govern your use of the WENZE TII NDAKU marketplace platform operated by WENZE TII NDAKU ("us", "we", or "our"). By accessing or using our service, you agree to be bound by these Terms.
                </p>
                <p className="text-muted-foreground">
                  If you disagree with any part of these terms, then you may not access the service. These terms apply to all visitors, users, and others who access or use the service.
                </p>
              </div>
            </section>

            {/* User Accounts */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <CheckCircle className="h-6 w-6 text-secondary mr-3" />
                <h2 className="text-2xl font-bold">User Accounts</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-primary">Account Creation</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>You must provide accurate and complete information when creating an account</li>
                    <li>You are responsible for maintaining the security of your account credentials</li>
                    <li>You must be at least 18 years old to create an account</li>
                    <li>One person or entity may not maintain more than one account</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-secondary">Account Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Keep your login information confidential</li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>Accept responsibility for all activities under your account</li>
                    <li>Maintain accurate and up-to-date account information</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Vendor Terms */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <DollarSign className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Vendor Terms</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-secondary">Vendor Approval</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>All vendor applications are subject to approval by WENZE TII NDAKU</li>
                    <li>We reserve the right to reject any application without explanation</li>
                    <li>Approved vendors must comply with all applicable laws and regulations</li>
                    <li>Vendors must provide accurate business documentation</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-primary">Product Listings</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Products must be accurately described with current pricing</li>
                    <li>Images must represent the actual product being sold</li>
                    <li>Prohibited items may not be listed (illegal, counterfeit, etc.)</li>
                    <li>We reserve the right to remove any listing at our discretion</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-secondary">Commission and Fees</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Commission rates are clearly disclosed during vendor registration</li>
                    <li>Fees are automatically deducted from sales proceeds</li>
                    <li>Payment schedules and methods are outlined in vendor agreements</li>
                    <li>Additional fees may apply for premium services</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Conduct */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <AlertCircle className="h-6 w-6 text-secondary mr-3" />
                <h2 className="text-2xl font-bold">User Conduct</h2>
              </div>
              
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-primary">Prohibited Activities</h3>
                <p className="text-muted-foreground mb-4">
                  Users are prohibited from engaging in the following activities:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-secondary mb-2">Platform Misuse</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Creating fake accounts or impersonating others</li>
                      <li>Attempting to circumvent security measures</li>
                      <li>Interfering with platform functionality</li>
                      <li>Automated data collection or scraping</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Illegal Activities</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Selling prohibited or illegal items</li>
                      <li>Money laundering or fraud</li>
                      <li>Violating intellectual property rights</li>
                      <li>Harassment or abusive behavior</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Payments and Refunds */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <DollarSign className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Payments and Refunds</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-secondary">Payment Processing</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>All payments are processed securely through approved payment partners</li>
                    <li>We do not store payment card information on our servers</li>
                    <li>Currency conversion rates are applied where applicable</li>
                    <li>Transaction fees may apply based on payment method</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-primary">Refund Policy</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Refunds are subject to individual vendor policies</li>
                    <li>We facilitate dispute resolution between buyers and vendors</li>
                    <li>Platform fees may be non-refundable in certain circumstances</li>
                    <li>Refund processing times vary by payment method</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <CheckCircle className="h-6 w-6 text-secondary mr-3" />
                <h2 className="text-2xl font-bold">Intellectual Property</h2>
              </div>
              
              <div className="bg-card p-6 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Platform Content</h4>
                    <p className="text-muted-foreground">
                      The platform, including its design, features, and content, is owned by WENZE TII NDAKU and protected by intellectual property laws. Users may not reproduce, distribute, or create derivative works without permission.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-secondary mb-2">User Content</h4>
                    <p className="text-muted-foreground">
                      Users retain ownership of content they upload but grant us a license to use, display, and distribute such content on the platform. Users are responsible for ensuring they have rights to upload content.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <XCircle className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Limitation of Liability</h2>
              </div>
              
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
                <p className="text-muted-foreground mb-4">
                  <strong>Important:</strong> Please read this section carefully as it limits our liability to you.
                </p>
                
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    WENZE TII NDAKU provides the platform "as is" without warranties of any kind. We do not guarantee continuous, uninterrupted access to the service.
                  </p>
                  <p>
                    We are not liable for indirect, incidental, special, or consequential damages arising from your use of the platform.
                  </p>
                  <p>
                    Our total liability to you for any claims related to the service is limited to the amount paid by you to us in the 12 months preceding the claim.
                  </p>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <XCircle className="h-6 w-6 text-secondary mr-3" />
                <h2 className="text-2xl font-bold">Termination</h2>
              </div>
              
              <div className="bg-card p-6 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-2">By You</h4>
                    <p className="text-muted-foreground">
                      You may terminate your account at any time by contacting our support team. Upon termination, you remain liable for any outstanding obligations.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-secondary mb-2">By Us</h4>
                    <p className="text-muted-foreground">
                      We may suspend or terminate your account immediately if you violate these terms, engage in fraudulent activity, or for any other reason at our sole discretion.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Governing Law */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <Scale className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Governing Law</h2>
              </div>
              
              <div className="bg-card p-6 rounded-lg">
                <p className="text-muted-foreground">
                  These Terms are governed by and construed in accordance with the laws of Nigeria. Any disputes arising from these Terms or your use of the service will be resolved in the courts of Lagos, Nigeria.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <AlertCircle className="h-6 w-6 text-secondary mr-3" />
                <h2 className="text-2xl font-bold">Contact Us</h2>
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <p className="text-muted-foreground mb-4">
                  If you have questions about these Terms of Service, please contact us:
                </p>
                
                <div className="space-y-2">
                  <p><strong>Email:</strong> legal@wenzendaku.com</p>
                  <p><strong>Phone:</strong> +234 123 456 7890</p>
                  <p><strong>Address:</strong> 123 Business District, Lagos, Nigeria</p>
                </div>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Changes to Terms</h3>
                <p className="text-muted-foreground">
                  We reserve the right to modify these Terms at any time. We will notify users of material changes by email or through the platform. Continued use of the service after changes constitutes acceptance of the new Terms.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;