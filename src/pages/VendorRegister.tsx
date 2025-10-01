import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Store, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Phone, 
  Globe,
  FileText,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const VendorRegister = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signup, verifyOTP, resendOTP, isLoading } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    businessWebsite: "",
    businessAddress: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    businessType: "",
    description: "",
    categories: [] as string[],
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToVendorTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [otp, setOtp] = useState("");

  const businessTypes = [
    "Individual/Sole Proprietor",
    "Partnership",
    "Limited Liability Company (LLC)",
    "Corporation",
    "Non-Profit",
    "Other"
  ];

  const availableCategories = [
    "Cosmetics & Beauty",
    "Technology & Electronics",
    "Clothing & Fashion",
    "Food & Beverages",
    "Home & Garden",
    "Health & Wellness",
    "Toys & Games",
    "Books & Media",
    "Sports & Outdoors",
    "Automotive",
    "Jewelry & Accessories",
    "Art & Collectibles"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signup(formData, 'vendor');
      setShowOTPForm(true);
      toast({
        title: "Vendor Application Submitted",
        description: "Please check your email for the verification code.",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive",
      });
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await verifyOTP(formData.businessEmail, otp, 'vendor');
      toast({
        title: "Account Verified",
        description: "Your vendor application is now under review. You'll be notified once approved.",
      });
      navigate("/vendor/login");
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Invalid OTP",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const isFormValid = () => {
    return (
      formData.businessName.trim() &&
      formData.businessEmail.trim() &&
      formData.businessPhone.trim() &&
      formData.businessAddress.trim() &&
      formData.city.trim() &&
      formData.state.trim() &&
      formData.country.trim() &&
      formData.businessType &&
      formData.description.trim() &&
      formData.categories.length > 0 &&
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword &&
      formData.agreeToTerms &&
      formData.agreeToVendorTerms
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          {/* Registration Form */}
          <div className="card p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-10 w-10 text-orange-600 dark:text-orange-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Become a Vendor
              </h1>
              <p className="text-muted-foreground text-lg">
                Start selling your products on WENZE TII NDAKU marketplace
              </p>
            </div>

            {/* Benefits Banner */}
            <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200 mb-3">
                <TrendingUp className="h-5 w-5" />
                <span className="text-lg font-semibold">Grow Your Business</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-orange-700 dark:text-orange-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Reach thousands of customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Easy-to-use vendor dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Secure payment processing</span>
                </div>
              </div>
            </div>

            {!showOTPForm ? (
              <form onSubmit={handleSubmit} className="space-y-8">
              {/* Business Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground border-b pb-2">
                  Business Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-sm font-medium text-foreground">
                      Business Name *
                    </Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      type="text"
                      placeholder="Enter business name"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required
                      className="border-muted focus:border-orange-600 focus:ring-orange-600"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessType" className="text-sm font-medium text-foreground">
                      Business Type *
                    </Label>
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-muted rounded-md focus:border-orange-600 focus:ring-orange-600 bg-background"
                      aria-label="Select business type"
                      title="Select business type"
                    >
                      <option value="">Select business type</option>
                      {businessTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessEmail" className="text-sm font-medium text-foreground">
                      Business Email *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="businessEmail"
                        name="businessEmail"
                        type="email"
                        placeholder="business@example.com"
                        value={formData.businessEmail}
                        onChange={handleInputChange}
                        required
                        className="pl-10 border-muted focus:border-orange-600 focus:ring-orange-600"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessPhone" className="text-sm font-medium text-foreground">
                      Business Phone *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="businessPhone"
                        name="businessPhone"
                        type="tel"
                        placeholder="+234 123 456 7890"
                        value={formData.businessPhone}
                        onChange={handleInputChange}
                        required
                        className="pl-10 border-muted focus:border-orange-600 focus:ring-orange-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessWebsite" className="text-sm font-medium text-foreground">
                    Business Website (Start with https://)
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="businessWebsite"
                      name="businessWebsite"
                      type="url"
                      placeholder="https://www.yourbusiness.com"
                      value={formData.businessWebsite}
                      onChange={handleInputChange}
                      className="pl-10 border-muted focus:border-orange-600 focus:ring-orange-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-foreground">
                    Business Description *
                  </Label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Describe your business, products, and what makes you unique..."
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-muted rounded-md focus:border-orange-600 focus:ring-orange-600 bg-background resize-none"
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground border-b pb-2">
                  Address Information
                </h2>
                
                <div className="space-y-2">
                  <Label htmlFor="businessAddress" className="text-sm font-medium text-foreground">
                    Street Address *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="businessAddress"
                      name="businessAddress"
                      type="text"
                      placeholder="Enter street address"
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                      required
                      className="pl-10 border-muted focus:border-orange-600 focus:ring-orange-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium text-foreground">
                      City *
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="border-muted focus:border-orange-600 focus:ring-orange-600"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-medium text-foreground">
                      State/Province *
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      type="text"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="border-muted focus:border-orange-600 focus:ring-orange-600"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium text-foreground">
                      Country *
                    </Label>
                    <Input
                      id="country"
                      name="country"
                      type="text"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="border-muted focus:border-orange-600 focus:ring-orange-600"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="text-sm font-medium text-foreground">
                      Postal Code *
                    </Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      placeholder="Postal Code"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      className="border-muted focus:border-orange-600 focus:ring-orange-600"
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground border-b pb-2">
                  Product Categories *
                </h2>
                <p className="text-sm text-muted-foreground">
                  Select the categories that best describe your products (select at least one)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableCategories.map(category => (
                    <label key={category} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="w-4 h-4 text-orange-600 border-muted rounded focus:ring-orange-600 focus:ring-2"
                      />
                      <span className="text-sm text-foreground">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Account Security */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground border-b pb-2">
                  Account Security
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">
                      Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="pl-10 pr-10 border-muted focus:border-orange-600 focus:ring-orange-600"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Must be at least 8 characters long
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                      Confirm Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="pl-10 pr-10 border-muted focus:border-orange-600 focus:ring-orange-600"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-600">Passwords do not match</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground border-b pb-2">
                  Terms & Conditions
                </h2>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-orange-600 border-muted rounded focus:ring-orange-600 focus:ring-2 mt-1"
                      aria-label="Agree to terms and conditions"
                      title="Agree to terms and conditions"
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm text-muted-foreground">
                      I agree to the{" "}
                      <Link to="/terms" className="text-orange-600 hover:text-orange-700 underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-orange-600 hover:text-orange-700 underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <input
                      id="agreeToVendorTerms"
                      name="agreeToVendorTerms"
                      type="checkbox"
                      checked={formData.agreeToVendorTerms}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-orange-600 border-muted rounded focus:ring-orange-600 focus:ring-2 mt-1"
                      aria-label="Agree to vendor terms and conditions"
                      title="Agree to vendor terms and conditions"
                    />
                    <Label htmlFor="agreeToVendorTerms" className="text-sm text-muted-foreground">
                      I agree to the{" "}
                      <Link to="/vendor/terms" className="text-orange-600 hover:text-orange-700 underline">
                        Vendor Agreement
                      </Link>{" "}
                      and understand my responsibilities as a vendor
                    </Label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !isFormValid()}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing application...
                  </div>
                ) : (
                  "Submit Vendor Application"
                )}
              </Button>
            </form>
            ) : (
              <form onSubmit={handleOTPSubmit} className="space-y-8">
                {/* OTP Verification Form */}
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-10 w-10 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Verify Your Business Email
                  </h2>
                  <p className="text-muted-foreground">
                    We've sent a 6-digit verification code to
                  </p>
                  <p className="text-lg font-medium text-orange-600">
                    {formData.businessEmail}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Please verify your email to complete your vendor application
                  </p>
                </div>

                {/* OTP Input */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-sm font-medium text-foreground">
                      Verification Code
                    </Label>
                    <Input
                      id="otp"
                      name="otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      maxLength={6}
                      className="text-center text-2xl tracking-widest border-muted focus:border-orange-600 focus:ring-orange-600"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Enter the 6-digit code sent to your business email
                    </p>
                  </div>

                  {/* Resend OTP */}
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        try {
                          await resendOTP(formData.businessEmail, 'vendor');
                          toast({
                            title: "Code Sent",
                            description: "A new verification code has been sent to your email.",
                          });
                        } catch (error) {
                          toast({
                            title: "Failed to Resend",
                            description: error instanceof Error ? error.message : "Could not resend code",
                            variant: "destructive",
                          });
                        }
                      }}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      Didn't receive the code? Resend
                    </Button>
                  </div>

                  {/* Verify Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </div>
                    ) : (
                      "Verify Email & Submit Application"
                    )}
                  </Button>

                  {/* Back to Signup */}
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowOTPForm(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ← Back to application form
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {/* Application Process Info */}
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <h3 className="text-lg font-medium text-foreground mb-3">What happens next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="text-center">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-orange-600 font-bold">1</span>
                  </div>
                  <p>Submit your application</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-orange-600 font-bold">2</span>
                  </div>
                  <p>We review within 2-3 business days</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-orange-600 font-bold">3</span>
                  </div>
                  <p>Start selling on our platform</p>
                </div>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Already have a vendor account?{" "}
                <Link
                  to="/vendor/login"
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VendorRegister;
