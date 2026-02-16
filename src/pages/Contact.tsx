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
  AccordionTrigger,
} from "@/components/ui/accordion";

const Contact = () => {
  const { t } = useTranslation();



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


        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;