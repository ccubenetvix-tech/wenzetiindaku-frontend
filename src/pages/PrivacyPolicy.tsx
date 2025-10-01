import { useTranslation } from "react-i18next";
import { Shield, FileText, Lock, Eye, UserCheck, AlertTriangle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-secondary">
          <div className="container mx-auto px-4 text-center text-white">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-12 w-12 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90">
              Your privacy and data security are our top priorities
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
                <FileText className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Introduction</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                At WENZE TII NDAKU, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our marketplace platform.
              </p>
              <p className="text-muted-foreground">
                By using our services, you agree to the collection and use of information in accordance with this policy. We will not use or share your information with anyone except as described in this Privacy Policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <Eye className="h-6 w-6 text-secondary mr-3" />
                <h2 className="text-2xl font-bold">Information We Collect</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-primary">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Name, email address, and phone number</li>
                    <li>Billing and shipping addresses</li>
                    <li>Payment information (processed securely by our payment partners)</li>
                    <li>Date of birth and gender (optional)</li>
                    <li>Language preferences</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-secondary">Usage Information</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Products viewed, searched, and purchased</li>
                    <li>Reviews and ratings you provide</li>
                    <li>Communication with vendors and customer support</li>
                    <li>Device information and IP address</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-primary">Vendor Information</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Business name and registration details</li>
                    <li>Bank account and tax information</li>
                    <li>Product listings and inventory data</li>
                    <li>Sales performance and analytics</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <UserCheck className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">How We Use Your Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-secondary">Service Provision</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Process orders and payments</li>
                    <li>Manage your account</li>
                    <li>Provide customer support</li>
                    <li>Deliver products and services</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-primary">Communication</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Send order confirmations and updates</li>
                    <li>Notify you of promotions and offers</li>
                    <li>Respond to your inquiries</li>
                    <li>Send important account information</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-secondary">Platform Improvement</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Analyze usage patterns</li>
                    <li>Improve our services</li>
                    <li>Develop new features</li>
                    <li>Prevent fraud and abuse</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-primary">Legal Compliance</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Comply with legal obligations</li>
                    <li>Protect our rights and property</li>
                    <li>Ensure platform security</li>
                    <li>Resolve disputes</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Information Sharing */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <Lock className="h-6 w-6 text-secondary mr-3" />
                <h2 className="text-2xl font-bold">Information Sharing</h2>
              </div>
              
              <div className="bg-card p-6 rounded-lg mb-4">
                <p className="text-muted-foreground mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described below:
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Vendors</h4>
                    <p className="text-muted-foreground">
                      We share necessary information with vendors to fulfill your orders, including your name, shipping address, and order details.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-secondary mb-2">Service Providers</h4>
                    <p className="text-muted-foreground">
                      We work with trusted third-party service providers for payment processing, shipping, and analytics. They only access information needed to perform their services.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Legal Requirements</h4>
                    <p className="text-muted-foreground">
                      We may disclose information if required by law, court order, or to protect our rights and safety.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <Shield className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Data Security</h2>
              </div>
              
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
                <p className="text-muted-foreground mb-4">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Lock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Encryption</h4>
                      <p className="text-sm text-muted-foreground">SSL/TLS encryption for data transmission</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-secondary mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Secure Storage</h4>
                      <p className="text-sm text-muted-foreground">Encrypted databases and secure servers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <UserCheck className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Access Control</h4>
                      <p className="text-sm text-muted-foreground">Limited access to authorized personnel only</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Eye className="h-5 w-5 text-secondary mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Monitoring</h4>
                      <p className="text-sm text-muted-foreground">Continuous security monitoring and audits</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <UserCheck className="h-6 w-6 text-secondary mr-3" />
                <h2 className="text-2xl font-bold">Your Rights</h2>
              </div>
              
              <div className="bg-card p-6 rounded-lg">
                <p className="text-muted-foreground mb-4">
                  You have the following rights regarding your personal information:
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                    <div>
                      <strong>Access:</strong> Request a copy of your personal information
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-3 mt-2"></div>
                    <div>
                      <strong>Correction:</strong> Update or correct inaccurate information
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                    <div>
                      <strong>Deletion:</strong> Request deletion of your personal information
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-3 mt-2"></div>
                    <div>
                      <strong>Portability:</strong> Request your data in a portable format
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                    <div>
                      <strong>Objection:</strong> Object to certain processing activities
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <AlertTriangle className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Contact Us</h2>
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <p className="text-muted-foreground mb-4">
                  If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
                </p>
                
                <div className="space-y-2">
                  <p><strong>Email:</strong> privacy@wenzendaku.com</p>
                  <p><strong>Phone:</strong> +234 123 456 7890</p>
                  <p><strong>Address:</strong> 123 Business District, Lagos, Nigeria</p>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section>
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Policy Updates</h3>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically for any changes.
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

export default PrivacyPolicy;