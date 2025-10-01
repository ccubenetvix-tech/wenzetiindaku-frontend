import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Shield, Mail, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authenticateAdmin, setAdminSession, isAdminEmail } from "@/utils/adminAuth";

interface AdminAccessProps {
  onSuccess?: () => void;
}

const AdminAccess = ({ onSuccess }: AdminAccessProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Check if email is a valid admin email
      if (!isAdminEmail(email)) {
        setError("Access denied. This email is not authorized for admin access.");
        setIsLoading(false);
        return;
      }

      // Simulate authentication process
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Authenticate admin
      const admin = authenticateAdmin(email);
      if (admin) {
        // Set admin session
        setAdminSession(admin);
        
        // Navigate to admin dashboard
        navigate("/admin/dashboard");
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError("Authentication failed. Please contact system administrator.");
      }
    } catch (error) {
      setError("An error occurred during authentication. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="mb-6 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>

      {/* Admin Access Form */}
      <div className="card p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Admin Access
          </h1>
          <p className="text-muted-foreground">
            Enter your admin email to access the dashboard
          </p>
        </div>

        {/* Security Notice */}
        <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Restricted Access</span>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            This area is restricted to authorized administrators only.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Admin Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 border-muted focus:border-blue-600 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Authenticating...
              </div>
            ) : (
              "Access Admin Panel"
            )}
          </Button>
        </form>

        {/* Support Information */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
          <h3 className="text-sm font-medium text-foreground mb-2">Need Help?</h3>
          <p className="text-xs text-muted-foreground mb-2">
            Contact the system administrator if you need access or have questions.
          </p>
          <div className="text-xs text-muted-foreground">
            <p>Email: admin@wenzetiindaku.com</p>
            <p>Phone: +234 800 ADMIN</p>
          </div>
        </div>

        {/* Back to Customer Login */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Are you a customer?{" "}
            <button
              onClick={() => navigate("/customer/login")}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAccess;
