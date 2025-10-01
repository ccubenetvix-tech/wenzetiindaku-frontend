import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MessageCircle, Search, HelpCircle, FileText, Users, Clock } from "lucide-react";

export default function HelpCenter() {
  const { t } = useTranslation();

  const helpCategories = [
    {
      icon: FileText,
      title: "Getting Started",
      description: "Learn how to use our marketplace",
      topics: ["Account Setup", "First Purchase", "Profile Management", "Security Tips"]
    },
    {
      icon: Users,
      title: "Account & Profile",
      description: "Manage your account settings",
      topics: ["Password Reset", "Email Verification", "Profile Updates", "Account Deletion"]
    },
    {
      icon: Clock,
      title: "Orders & Shipping",
      description: "Track and manage your orders",
      topics: ["Order Tracking", "Shipping Options", "Delivery Issues", "Order History"]
    },
    {
      icon: HelpCircle,
      title: "Payment & Billing",
      description: "Payment methods and billing",
      topics: ["Payment Methods", "Billing Issues", "Refunds", "Payment Security"]
    }
  ];

  const popularQuestions = [
    {
      question: "How do I create an account?",
      answer: "Click on 'Sign Up' in the top right corner, fill in your details, verify your email, and you're ready to start shopping!"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, bank transfers, and mobile money services across Africa."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping times vary by location and vendor. Local orders typically arrive within 3-5 days, while international orders may take 7-14 days."
    },
    {
      question: "Can I return items?",
      answer: "Yes! We offer a 30-day return policy for most items. Check our Returns page for detailed information."
    },
    {
      question: "How do I contact a vendor?",
      answer: "You can contact vendors directly through their store pages or by using our messaging system after placing an order."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-orange-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Find answers to your questions and get the support you need
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Search for help..." 
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How can we help you?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {helpCategories.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit">
                      <category.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <p className="text-muted-foreground text-sm">{category.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="text-sm text-muted-foreground hover:text-primary cursor-pointer">
                          • {topic}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Questions */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Popular Questions</h2>
            
            <div className="max-w-4xl mx-auto space-y-4">
              {popularQuestions.map((faq, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">Still need help?</h2>
              <p className="text-muted-foreground mb-8">
                Can't find what you're looking for? Contact our support team directly.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Email Support</h3>
                    <p className="text-sm text-muted-foreground mb-4">Get help via email</p>
                    <Button variant="outline" size="sm">Send Email</Button>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <Phone className="h-8 w-8 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Phone Support</h3>
                    <p className="text-sm text-muted-foreground mb-4">Call us directly</p>
                    <Button variant="outline" size="sm">Call Now</Button>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Live Chat</h3>
                    <p className="text-sm text-muted-foreground mb-4">Chat with support</p>
                    <Button variant="outline" size="sm">Start Chat</Button>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Your name" />
                    <Input placeholder="Your email" type="email" />
                  </div>
                  <Input placeholder="Subject" />
                  <Textarea placeholder="Your message" rows={4} />
                  <Button className="w-full">Send Message</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
