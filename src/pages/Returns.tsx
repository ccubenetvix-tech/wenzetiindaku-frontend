import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  RotateCcw, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package, 
  Truck, 
  CreditCard,
  AlertTriangle,
  Info,
  Calendar,
  Shield
} from "lucide-react";

export default function Returns() {
  const { t } = useTranslation();

  const returnSteps = [
    {
      step: 1,
      title: "Initiate Return",
      description: "Go to your order history and select the item you want to return",
      icon: RotateCcw,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    },
    {
      step: 2,
      title: "Print Return Label",
      description: "Download and print the prepaid return shipping label",
      icon: Package,
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
    },
    {
      step: 3,
      title: "Package Item",
      description: "Pack the item securely in its original packaging with all accessories",
      icon: Package,
      color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    },
    {
      step: 4,
      title: "Ship Return",
      description: "Drop off the package at any authorized shipping location",
      icon: Truck,
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
    },
    {
      step: 5,
      title: "Receive Refund",
      description: "Get your refund processed within 3-5 business days of receiving the return",
      icon: CreditCard,
      color: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400"
    }
  ];

  const returnPolicy = [
    {
      category: "Eligible Items",
      icon: CheckCircle,
      items: [
        "Items in original condition with tags",
        "Unused items with original packaging",
        "Items returned within 30 days",
        "Items with valid proof of purchase"
      ],
      color: "text-green-600"
    },
    {
      category: "Non-Eligible Items",
      icon: XCircle,
      items: [
        "Personalized or custom items",
        "Perishable goods (food, flowers)",
        "Intimate or sanitary products",
        "Items damaged by customer",
        "Items without original packaging"
      ],
      color: "text-red-600"
    }
  ];

  const returnReasons = [
    {
      reason: "Changed Mind",
      description: "You no longer want the item",
      refundType: "Full refund",
      timeframe: "30 days"
    },
    {
      reason: "Wrong Size/Color",
      description: "Item doesn't fit or wrong color received",
      refundType: "Full refund + exchange",
      timeframe: "30 days"
    },
    {
      reason: "Defective Item",
      description: "Item arrived damaged or not working",
      refundType: "Full refund + replacement",
      timeframe: "60 days"
    },
    {
      reason: "Not as Described",
      description: "Item differs from description",
      refundType: "Full refund",
      timeframe: "30 days"
    }
  ];

  const refundMethods = [
    {
      method: "Original Payment Method",
      timeframe: "3-5 business days",
      description: "Refunded to your original payment method",
      icon: CreditCard
    },
    {
      method: "Store Credit",
      timeframe: "Immediate",
      description: "Instant credit to your account for future purchases",
      icon: Shield
    },
    {
      method: "Bank Transfer",
      timeframe: "5-7 business days",
      description: "Direct transfer to your bank account",
      icon: CreditCard
    }
  ];

  const returnFees = [
    {
      scenario: "Free Return",
      conditions: ["Defective item", "Wrong item sent", "Not as described"],
      cost: "Free"
    },
    {
      scenario: "Standard Return",
      conditions: ["Changed mind", "Wrong size/color", "No longer needed"],
      cost: "$5.99"
    },
    {
      scenario: "Express Return",
      conditions: ["Urgent return needed", "Same-day processing"],
      cost: "$9.99"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-orange-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Returns & Exchanges</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Easy returns and exchanges with our 30-day return policy
            </p>
          </div>
        </section>

        {/* Return Policy Overview */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Return Policy</h2>
              <p className="text-muted-foreground text-lg">
                We want you to be completely satisfied with your purchase. If you're not happy, we'll make it right.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {returnPolicy.map((policy, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <policy.icon className={`h-6 w-6 ${policy.color}`} />
                      {policy.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {policy.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Return Process */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How to Return an Item</h2>
            
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {returnSteps.map((step, index) => (
                  <div key={index} className="relative">
                    <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                      <CardContent className="p-6 text-center">
                        <div className="mb-4">
                          <Badge className={`${step.color} text-lg font-bold w-12 h-12 rounded-full flex items-center justify-center mx-auto`}>
                            {step.step}
                          </Badge>
                        </div>
                        <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/20 dark:to-orange-900/20 rounded-full w-fit">
                          <step.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-semibold mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </CardContent>
                    </Card>
                    
                    {/* Arrow between steps */}
                    {index < returnSteps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                        <div className="w-6 h-0.5 bg-muted-foreground/30"></div>
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-muted-foreground/30 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Return Reasons */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Common Return Reasons</h2>
            
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-6 w-6 text-blue-600" />
                    Return Reasons & Refund Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Reason</th>
                          <th className="text-left py-3 px-4 font-semibold">Description</th>
                          <th className="text-left py-3 px-4 font-semibold">Refund Type</th>
                          <th className="text-left py-3 px-4 font-semibold">Timeframe</th>
                        </tr>
                      </thead>
                      <tbody>
                        {returnReasons.map((reason, index) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium">{reason.reason}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{reason.description}</td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                {reason.refundType}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 font-semibold text-primary">{reason.timeframe}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Refund Methods */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Refund Methods</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {refundMethods.map((method, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/20 dark:to-orange-900/20 rounded-full w-fit">
                      <method.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold mb-2">{method.method}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                    <Badge variant="outline" className="text-primary">
                      {method.timeframe}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Return Fees */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Return Fees</h2>
            
            <div className="max-w-4xl mx-auto space-y-6">
              {returnFees.map((fee, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{fee.scenario}</h3>
                        <div className="space-y-1">
                          {fee.conditions.map((condition, conditionIndex) => (
                            <p key={conditionIndex} className="text-sm text-muted-foreground">
                              • {condition}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{fee.cost}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-400">
                    <AlertTriangle className="h-6 w-6" />
                    Important Return Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Before Returning:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Keep original packaging and tags</li>
                        <li>• Take photos if item is damaged</li>
                        <li>• Contact support for large items</li>
                        <li>• Check return eligibility</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">After Returning:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Track your return package</li>
                        <li>• Allow 3-5 days for processing</li>
                        <li>• Check your email for updates</li>
                        <li>• Contact support if needed</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Start Return Process */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Return an Item?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start your return process now. It's quick, easy, and secure.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
                Start Return Process
              </Button>
              <Button size="lg" variant="outline">
                Check Return Status
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
