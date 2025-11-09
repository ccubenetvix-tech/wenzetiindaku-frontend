import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, Eye, EyeOff, Mail, Lock, ArrowLeft, UserPlus, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/utils/api";

const CustomerSignup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signup, verifyOTP, resendOTP, googleLogin, isLoading } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    newsletter: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailStatus, setEmailStatus] = useState<{
    state: "idle" | "checking" | "available" | "blocked";
    message: string;
  }>({ state: "idle", message: "" });

  useEffect(() => {
    const email = formData.email.trim();

    if (!email) {
      setEmailStatus({ state: "idle", message: "" });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setEmailStatus({ state: "idle", message: "" });
      return;
    }

    const controller = new AbortController();
    setEmailStatus({ state: "checking", message: "" });

    const debounceId = window.setTimeout(async () => {
      try {
        const response = await apiClient.getEmailStatus(email, "customer", controller.signal);

        if (response?.success) {
          const { isRegistered, registeredAs, label, message } = response.data ?? {};

          if (isRegistered && registeredAs) {
            setEmailStatus({
              state: "blocked",
              message: message || `This email is already registered as a ${label || (registeredAs === "vendor" ? "Vendor" : "Customer")}. Please use a different email.`,
            });
          } else {
            setEmailStatus({ state: "available", message: "" });
          }
        } else {
          setEmailStatus({ state: "idle", message: "" });
        }
      } catch (error) {
        if ((error as Error)?.name === "AbortError") {
          return;
        }

        console.error("Email availability check failed:", error);
        setEmailStatus({ state: "idle", message: "" });
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(debounceId);
    };
  }, [formData.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailStatus.state === "blocked") {
      toast({
        title: "Email Unavailable",
        description: emailStatus.message,
        variant: "destructive",
      });
      return;
    }
    
    try {
      await signup(formData, 'customer');
      setShowOTPForm(true);
      toast({
        title: "Account Created",
        description: "Please check your email for the verification code.",
      });
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "An error occurred during signup",
        variant: "destructive",
      });
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await verifyOTP(formData.email, otp, 'customer');
      toast({
        title: "Account Verified",
        description: "Your account has been successfully verified! Please complete your profile.",
      });
      navigate("/update-profile");
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Invalid OTP",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignup = () => {
    try {
      googleLogin();
    } catch (error) {
      toast({
        title: "Google Signup Failed",
        description: "An error occurred during Google signup",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword &&
      formData.agreeToTerms &&
      emailStatus.state !== "blocked"
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          {/* Signup Form */}
          <div className="card p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Create Account
              </h1>
              <p className="text-muted-foreground">
                Join WENZE TII NDAKU marketplace
              </p>
            </div>

            {!showOTPForm ? (
              <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="border-muted focus:border-primary focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="border-muted focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="pl-10 border-muted focus:border-primary focus:ring-primary"
                  />
                </div>
                {emailStatus.state === "checking" && (
                  <p className="text-xs text-muted-foreground">Checking email availability...</p>
                )}
                {emailStatus.state === "blocked" && (
                  <div className="mt-2 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                    <AlertCircle className="mt-0.5 h-4 w-4" />
                    <span>{emailStatus.message}</span>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
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
                    className="pl-10 pr-10 border-muted focus:border-primary focus:ring-primary"
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm Password
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
                    className="pl-10 pr-10 border-muted focus:border-primary focus:ring-primary"
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

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary border-muted rounded focus:ring-primary focus:ring-2 mt-1"
                    aria-label="Agree to terms and conditions"
                    title="Agree to terms and conditions"
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:text-primary/80 underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:text-primary/80 underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <input
                    id="newsletter"
                    name="newsletter"
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary border-muted rounded focus:ring-primary focus:ring-2 mt-1"
                    aria-label="Subscribe to newsletter"
                    title="Subscribe to newsletter"
                  />
                  <Label htmlFor="newsletter" className="text-sm text-muted-foreground">
                    Subscribe to our newsletter for updates and offers
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !isFormValid() || emailStatus.state === "checking"}
                className="w-full gradient-primary hover:from-blue-700 hover:to-blue-800 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
            ) : (
              <form onSubmit={handleOTPSubmit} className="space-y-6">
                {/* OTP Verification Form */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Verify Your Email
                  </h2>
                  <p className="text-muted-foreground">
                    We've sent a 6-digit verification code to
                  </p>
                  <p className="text-sm font-medium text-primary">
                    {formData.email}
                  </p>
                </div>

                {/* OTP Input */}
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
                    className="text-center text-2xl tracking-widest border-muted focus:border-primary focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Enter the 6-digit code sent to your email
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
                        await resendOTP(formData.email, 'customer');
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
                    className="text-primary hover:text-primary/80"
                  >
                    Didn't receive the code? Resend
                  </Button>
                </div>

                {/* Verify Button */}
                <Button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full gradient-primary hover:from-blue-700 hover:to-blue-800 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    "Verify Email"
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
                    ← Back to signup form
                  </Button>
                </div>
              </form>
            )}

            {/* Social Signup - Only show when not in OTP form */}
            {!showOTPForm && (
              <>
                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                {/* Social Signup */}
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-muted hover:border-primary hover:bg-primary/5"
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                </div>
              </>
            )}

            {/* Benefits */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Why join WENZE TII NDAKU?
              </h3>
              <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3" />
                  <span>Access to thousands of products</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3" />
                  <span>Secure shopping experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3" />
                  <span>Exclusive member discounts</span>
                </div>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/customer/login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Want to sell?{" "}
                <Link
                  to="/vendor/register"
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  Become a vendor
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

export default CustomerSignup;
