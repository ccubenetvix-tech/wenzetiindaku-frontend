import { useTranslation } from "react-i18next";
import { FileText, Shield, AlertTriangle, Users, DollarSign, CreditCard, Gavel, Scale, Ban, Building } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const TermsOfService = () => {
  const { t } = useTranslation();

  const sections = [
    {
      title: "1. Introduction",
      icon: <Building className="h-6 w-6 text-primary" />,
      content: "These Terms and Conditions govern access to and use of the WENZE TII NDAKU platform. By accessing or using the platform, you agree to be legally bound by these Terms."
    },
    {
      title: "2. Definitions",
      icon: <FileText className="h-6 w-6 text-orange-500" />,
      content: (
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>Platform:</strong> WENZE TII NDAKU website and services.</li>
          <li><strong>Seller:</strong> Any entity registered to sell on the platform.</li>
          <li><strong>Buyer:</strong> Any user purchasing products.</li>
        </ul>
      )
    },
    {
      title: "3. Seller Obligations",
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      content: "Sellers must display lawful, genuine, and quality products. Any reference to drugs, crime, terrorism, pedo■pornography, or illegal activities is strictly forbidden and prosecutable."
    },
    {
      title: "4. Faulty Products",
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
      content: "Defective or non-compliant products must be fully reimbursed at the seller’s charge."
    },
    {
      title: "5. Fees & Commission",
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
      content: (
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>Membership fee:</strong> USD 10 per month.</li>
          <li><strong>Commission:</strong> 15% of monthly sales volume.</li>
        </ul>
      )
    },
    {
      title: "6. Payments",
      icon: <CreditCard className="h-6 w-6 text-purple-600" />,
      content: "Seller revenues are paid once at the end of each calendar month, after deductions."
    },
    {
      title: "7. Suspension & Termination",
      icon: <Ban className="h-6 w-6 text-red-600" />,
      content: "The platform may terminate any seller account immediately in case of suspicious or unacceptable behavior."
    },
    {
      title: "8. False Advertising",
      icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
      content: "Advertising non-existent items or false advertising is strictly prohibited and prosecutable."
    },
    {
      title: "9. Limitation of Liability",
      icon: <Shield className="h-6 w-6 text-gray-600" />,
      content: "WENZE TII NDAKU acts as an intermediary marketplace and is not liable for seller misconduct."
    },
    {
      title: "10. Governing Law",
      icon: <Scale className="h-6 w-6 text-indigo-600" />,
      content: "These Terms are governed by applicable commercial laws under the platform’s legal jurisdiction."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                <Gavel className="h-12 w-12 text-blue-200" />
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                Terms and Conditions
              </h1>
              <div className="h-1 w-24 bg-blue-400 rounded-full mb-6"></div>
            </div>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-blue-100 font-light">
              User Agreement & Policy Guide
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Last Updated Badge */}
            <div className="flex justify-center mb-12">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                Last updated: 2025
              </span>
            </div>

            {/* Terms Content Cards */}
            <div className="grid gap-8">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="bg-card hover:shadow-lg transition-all duration-300 rounded-xl border border-border/50 overflow-hidden group"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-3 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                        {section.icon}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                          {section.title}
                        </h2>
                        <div className="text-muted-foreground leading-relaxed">
                          {section.content}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Support Section */}
            <div className="mt-16 text-center">
              <p className="text-muted-foreground mb-4">
                Have questions about our terms?
              </p>
              <a
                href="mailto:wenzetiindaku@outlook.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm"
              >
                Contact Legal Support
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;