import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FAQs() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const faqCategories = [
    {
      title: "Getting Started",
      icon: "🚀",
      faqs: [
        {
          question: "How do I create an account on WENZE TII NDAKU?",
          answer: "Creating an account is easy! Click the 'Sign Up' button in the top right corner, fill in your email, create a password, and verify your email address. You'll be ready to start shopping in minutes."
        },
        {
          question: "Is it free to create an account?",
          answer: "Yes, creating an account is completely free. You only pay for the products you purchase from our vendors."
        },
        {
          question: "Do I need to verify my email address?",
          answer: "Yes, email verification is required for security purposes. Check your inbox for a verification link after signing up."
        },
        {
          question: "Can I browse without creating an account?",
          answer: "You can browse products and view vendor stores without an account, but you'll need to create one to make purchases and access all features."
        }
      ]
    },
    {
      title: "Shopping & Orders",
      icon: "🛒",
      faqs: [
        {
          question: "How do I place an order?",
          answer: "Browse products, add items to your cart, proceed to checkout, enter your shipping details, choose a payment method, and confirm your order. You'll receive an order confirmation email."
        },
        {
          question: "Can I modify or cancel my order?",
          answer: "You can modify or cancel your order within 1 hour of placing it, as long as the vendor hasn't started processing it. Contact customer support for assistance."
        },
        {
          question: "How do I track my order?",
          answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order in your account dashboard under 'My Orders'."
        },
        {
          question: "What if I receive the wrong item?",
          answer: "Contact the vendor immediately through our messaging system or reach out to customer support. We'll help you get the correct item or process a return."
        }
      ]
    },
    {
      title: "Payment & Billing",
      icon: "💳",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and mobile money services popular across Africa."
        },
        {
          question: "Is my payment information secure?",
          answer: "Yes, we use industry-standard encryption and secure payment processors. We never store your full payment details on our servers."
        },
        {
          question: "When will I be charged?",
          answer: "You'll be charged immediately when you place your order. The payment goes to the vendor, and we hold it securely until your order is delivered."
        },
        {
          question: "Can I get a refund?",
          answer: "Yes, we offer refunds according to our return policy. Most items can be returned within 30 days of delivery in original condition."
        }
      ]
    },
    {
      title: "Shipping & Delivery",
      icon: "📦",
      faqs: [
        {
          question: "How long does shipping take?",
          answer: "Shipping times vary by location and vendor. Local deliveries typically take 3-5 business days, while international shipping may take 7-14 business days."
        },
        {
          question: "What are the shipping costs?",
          answer: "Shipping costs vary by vendor and delivery location. You'll see the exact shipping cost during checkout before confirming your order."
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes, many of our vendors offer international shipping. Check the product page or contact the vendor directly for international shipping options."
        },
        {
          question: "What if my package is damaged during shipping?",
          answer: "Contact us immediately with photos of the damage. We'll work with the vendor and shipping company to resolve the issue and get you a replacement or refund."
        }
      ]
    },
    {
      title: "Returns & Exchanges",
      icon: "🔄",
      faqs: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for most items. Items must be in original condition with tags and packaging. Some items like food and personal care products may have different return policies."
        },
        {
          question: "How do I return an item?",
          answer: "Go to your order history, select the item you want to return, and follow the return process. You'll receive a return label and instructions."
        },
        {
          question: "Who pays for return shipping?",
          answer: "Return shipping costs depend on the reason for return. If the item is defective or incorrect, we cover the cost. For other returns, the customer typically pays return shipping."
        },
        {
          question: "How long does it take to process a return?",
          answer: "Once we receive your returned item, we'll process the refund within 3-5 business days. The refund will appear in your original payment method within 5-10 business days."
        }
      ]
    },
    {
      title: "Vendor & Store",
      icon: "🏪",
      faqs: [
        {
          question: "How do I become a vendor?",
          answer: "Click on 'Become a Vendor' in the footer, fill out the application form, and our team will review your application. Approved vendors can start selling immediately."
        },
        {
          question: "How do I contact a vendor?",
          answer: "You can contact vendors through their store page using the 'Contact Vendor' button, or through our messaging system after placing an order."
        },
        {
          question: "Are all vendors verified?",
          answer: "Yes, we verify all vendors before they can start selling. This includes identity verification, business registration, and quality checks."
        },
        {
          question: "What if I have an issue with a vendor?",
          answer: "Contact our customer support team immediately. We'll investigate the issue and work to resolve it fairly for both you and the vendor."
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-orange-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Find quick answers to the most common questions about our marketplace
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Search FAQs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            {searchTerm && (
              <div className="mb-8">
                <p className="text-muted-foreground">
                  Showing results for "{searchTerm}" ({filteredFAQs.reduce((total, category) => total + category.faqs.length, 0)} results)
                </p>
              </div>
            )}
            
            <div className="max-w-4xl mx-auto space-y-8">
              {filteredFAQs.map((category, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 p-6 border-b">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <span className="text-3xl">{category.icon}</span>
                      {category.title}
                    </h2>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {category.faqs.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`${index}-${faqIndex}`}>
                        <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                          <span className="font-semibold">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              ))}
            </div>

            {filteredFAQs.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any FAQs matching "{searchTerm}"
                </p>
                <Button onClick={() => setSearchTerm("")} variant="outline">
                  Clear search
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here to help you 24/7.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
                Contact Support
              </Button>
              <Button size="lg" variant="outline">
                Live Chat
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
