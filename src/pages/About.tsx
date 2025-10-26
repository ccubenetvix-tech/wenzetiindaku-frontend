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
                About WENZE TII NDAKU
              </h1>
            </div>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Empowering African vendors and connecting communities through trusted online marketplace solutions
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
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  WENZE TII NDAKU is dedicated to creating a thriving digital marketplace that bridges the gap between African vendors and global customers. We believe in empowering local businesses to reach new markets while providing customers with authentic, quality products.
                </p>
                <p className="text-lg text-muted-foreground">
                  Our platform supports multiple languages and payment methods, making it accessible to diverse communities across Africa and beyond.
                </p>
              </div>
              <div className="bg-card p-8 rounded-lg shadow-sm">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                    <div className="text-muted-foreground">Active Vendors</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-secondary mb-2">50K+</div>
                    <div className="text-muted-foreground">Products</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">25K+</div>
                    <div className="text-muted-foreground">Happy Customers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-secondary mb-2">15</div>
                    <div className="text-muted-foreground">Countries</div>
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
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Community First</h3>
                <p className="text-muted-foreground">
                  Building strong relationships and supporting local communities through economic empowerment.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <Shield className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Trust & Security</h3>
                <p className="text-muted-foreground">
                  Ensuring safe transactions and protecting both vendors and customers with robust security measures.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Global Reach</h3>
                <p className="text-muted-foreground">
                  Connecting African businesses to global markets while celebrating cultural diversity.
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
                <h2 className="text-3xl font-bold">Our Story</h2>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Founded with a vision to democratize e-commerce in Africa, WENZE TII NDAKU started as a small initiative to help local vendors reach digital markets. Today, we're proud to be a leading marketplace platform that spans across multiple countries and supports thousands of businesses.
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-primary">What We Do</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-secondary mr-3 mt-0.5" />
                      <span>Provide a secure, user-friendly marketplace platform</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-secondary mr-3 mt-0.5" />
                      <span>Support vendors with tools and training</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-secondary mr-3 mt-0.5" />
                      <span>Ensure quality products and customer satisfaction</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-secondary mr-3 mt-0.5" />
                      <span>Facilitate secure payments and logistics</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-secondary">Our Impact</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <span>Created thousands of employment opportunities</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <span>Enabled cross-border trade for small businesses</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <span>Promoted African products globally</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <span>Contributed to economic growth in local communities</span>
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
              <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
              <p className="text-xl text-muted-foreground">
                Have questions? We'd love to hear from you.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-muted-foreground">info@wenzendaku.com</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <Phone className="h-8 w-8 text-secondary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-muted-foreground">+234 123 456 7890</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Visit Us</h3>
                <p className="text-muted-foreground">Lagos, Nigeria</p>
              </div>
            </div>
            
            <div className="text-center">
              <Button size="lg" className="mr-4">
                <Mail className="h-4 w-4 mr-2" />
                Contact Us
              </Button>
              <Button variant="outline" size="lg">
                Learn More
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
