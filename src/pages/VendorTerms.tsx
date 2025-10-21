import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store, Shield, DollarSign, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const VendorTerms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Store className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vendor Terms of Service</h1>
              <p className="text-gray-600 dark:text-gray-400">Terms and conditions for vendors on WENZE TII NDAKU</p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Introduction</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Welcome to WENZE TII NDAKU, Africa's premier marketplace platform. These Vendor Terms of Service 
                ("Terms") govern your use of our platform as a vendor. By registering as a vendor and using our 
                services, you agree to be bound by these terms.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Important:</strong> Please read these terms carefully. If you do not agree with any part 
                  of these terms, you should not use our platform as a vendor.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Eligibility */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Vendor Eligibility</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">To become a vendor, you must:</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Be at least 18 years old</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Have a valid business registration or be a sole proprietor</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Provide accurate business information</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Have a valid bank account for payments</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Comply with all applicable laws and regulations</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Account Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>Account Setup and Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Account Requirements:</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Complete vendor registration with accurate business information</li>
                  <li>• Provide valid business registration documents</li>
                  <li>• Submit required identification documents</li>
                  <li>• Complete tax information and compliance forms</li>
                  <li>• Set up payment and banking information</li>
                </ul>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                  <strong>Note:</strong> Account verification may take 3-5 business days. You will be notified 
                  once your account is approved.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Fees and Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>Fees and Payments</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Commission Structure:</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Platform commission: 5-15% per transaction (varies by category)</li>
                  <li>• Payment processing fees: 2.9% + $0.30 per transaction</li>
                  <li>• Monthly subscription fee: $29.99 (optional premium features)</li>
                  <li>• Listing fees: Free for first 50 products, $0.50 per additional product</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Payment Terms:</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Payments are processed weekly (every Friday)</li>
                  <li>• Minimum payout threshold: $50</li>
                  <li>• Payment methods: Bank transfer, PayPal, Mobile Money</li>
                  <li>• Refunds are processed within 5-7 business days</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Product Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className="h-5 w-5 text-orange-600" />
                <span>Product Guidelines</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Allowed Products:</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Electronics and gadgets</li>
                  <li>• Clothing and accessories</li>
                  <li>• Home and garden items</li>
                  <li>• Beauty and personal care</li>
                  <li>• Books and media</li>
                  <li>• Sports and outdoor equipment</li>
                  <li>• Food and beverages (with proper licenses)</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Prohibited Items:</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Illegal drugs and substances</li>
                  <li>• Weapons and ammunition</li>
                  <li>• Counterfeit or replica items</li>
                  <li>• Adult content and services</li>
                  <li>• Hazardous materials</li>
                  <li>• Items that violate intellectual property rights</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-red-600" />
                <span>Vendor Responsibilities</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">You are responsible for:</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Accurate product descriptions and images</li>
                  <li>• Maintaining adequate inventory levels</li>
                  <li>• Processing orders within 24-48 hours</li>
                  <li>• Providing excellent customer service</li>
                  <li>• Handling returns and refunds according to our policy</li>
                  <li>• Complying with all applicable laws and regulations</li>
                  <li>• Protecting customer data and privacy</li>
                  <li>• Regular account maintenance and updates</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span>Account Termination</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">We may terminate your account for:</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Violation of these terms</li>
                  <li>• Fraudulent activities</li>
                  <li>• Poor customer service ratings</li>
                  <li>• Non-compliance with platform policies</li>
                  <li>• Legal violations</li>
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                  <strong>Warning:</strong> Account termination may result in loss of access to your vendor 
                  dashboard and pending payments may be held for up to 90 days.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                If you have any questions about these Vendor Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p><strong>Email:</strong> vendors@wenzetiindaku.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Marketplace Street, Business District, City, Country</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VendorTerms;
