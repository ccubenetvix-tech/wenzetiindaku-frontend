import { useTranslation } from "react-i18next";
import {
  Mail,
  Phone,
  MapPin,
  HelpCircle,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Contact = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      question: "How do I create a vendor account?",
      answer: "You can create a vendor account by clicking on 'Become a Vendor' in the header menu. Fill out the registration form and wait for approval from our team."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards (Visa, Mastercard), mobile money payments, and bank transfers depending on your location."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping times vary by location and vendor. Typically, local deliveries take 1-3 business days, while international shipping can take 5-14 business days."
    },
    {
      question: "Can I return a product if I'm not satisfied?",
      answer: "Yes, we have a return policy. You can return products within 14 days of delivery if they're in original condition. Please check with individual vendors for their specific return policies."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via email and SMS. You can also track your orders from your profile page."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect your personal and payment information. We never share your data with third parties without your consent."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-secondary">
          <div className="container mx-auto px-4 text-center text-white">
            <div className="flex items-center justify-center mb-6">
              <Mail className="h-12 w-12 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold">Contact Us</h1>
            </div>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90">
              We're here to help! Get in touch with our support team
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">

          <div className="max-w-2xl mx-auto">
            {/* Contact Information */}
            <div className="bg-card p-8 rounded-lg shadow-sm mb-12 border">
              <h2 className="text-2xl font-bold mb-6 text-center">Get in Touch</h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-3">Email Support</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <div>
                        <p className="font-medium text-foreground text-sm">General Inquiries</p>
                        <p>info@wenzetiindaku.com</p>
                      </div>

                      <div>
                        <p className="font-medium text-foreground text-sm">Technical Support</p>
                        <p>tech@wenzetiindaku.com <span className="text-xs text-muted-foreground italic block">(For tech assistance)</span></p>
                      </div>

                      <div>
                        <p className="font-medium text-foreground text-sm">Vendor Support</p>
                        <p>vendors@wenzetiindaku.com</p>
                      </div>

                      <div>
                        <p className="font-medium text-foreground text-sm">Customer Support</p>
                        <p>customers@wenzetiindaku.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-secondary mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone Support</h3>
                    <p className="text-muted-foreground">+32 495 84 68 66</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Office Address</h3>
                    <p className="text-muted-foreground">
                      Kinshasa, R.D. CONGO
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <HelpCircle className="h-8 w-8 text-primary mr-3" />
                <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
              </div>
              <p className="text-xl text-muted-foreground">
                Quick answers to common questions
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;