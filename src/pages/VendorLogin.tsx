import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Store, Eye, EyeOff, Mail, Lock, ArrowLeft, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const VendorLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'vendor') {
        navigate('/vendor/dashboard', { replace: true });
      } else if (user.role === 'customer') {
        navigate('/customer/profile', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { user } = await login(formData.email, formData.password, 'vendor');
      
      // Check if vendor is approved
      if (user.role === 'vendor' && !user.approved) {
        toast({
          title: "Login Successful",
          description: "Your vendor application is pending approval. You'll be notified once approved.",
        });
        navigate("/");
      } else {
        toast({
          title: "Login Successful",
          description: "Welcome to your vendor dashboard!",
        });
        navigate("/vendor/dashboard");
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
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

          {/* Login Form */}
          <div className="card p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="h-8 w-8 text-orange-600" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Vendor Portal
              </h1>
              <p className="text-muted-foreground">
                Sign in to your vendor account
              </p>
            </div>

            {/* Vendor Benefits */}
            <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200 mb-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Grow Your Business</span>
              </div>
              <div className="space-y-1 text-xs text-orange-700 dark:text-orange-300">
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3" />
                  <span>Reach thousands of customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" />
                  <span>Track sales and analytics</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Business Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter business email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="pl-10 border-muted focus:border-orange-600 focus:ring-orange-600"
                  />
                </div>
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
                    placeholder="Enter password"
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
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-orange-600 border-muted rounded focus:ring-orange-600 focus:ring-2"
                    aria-label="Remember me"
                    title="Remember me"
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-muted-foreground">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/vendor/forgot-password"
                  className="text-sm text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Access Vendor Portal"
                )}
              </Button>
            </form>

            {/* Become a Vendor CTA */}
            <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
                Want to become a vendor?
              </h3>
              <p className="text-xs text-orange-700 dark:text-orange-300 mb-3">
                Join our marketplace and start selling your products to customers worldwide.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                onClick={() => navigate("/vendor/register")}
              >
                Apply to Become a Vendor
              </Button>
            </div>

            {/* Support Information */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <h3 className="text-sm font-medium text-foreground mb-2">Need Support?</h3>
              <div className="text-xs text-muted-foreground">
                <p>Email: vendors@wenzetiindaku.com</p>
                <p>Phone: +234 800 VENDOR</p>
                <p>Hours: Mon-Fri 9AM-6PM WAT</p>
              </div>
            </div>

            {/* Back to Customer Login */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Are you a customer?{" "}
                <Link
                  to="/customer/login"
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

export default VendorLogin;

