import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CircleCheck, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * LogoutConfirmation - Professional logout confirmation page
 * 
 * Displays a success message after logout with:
 * - Success icon
 * - Confirmation message
 * - Action buttons (Go to Home, Login Again)
 * - Auto-redirect after 2-3 seconds
 */
const LogoutConfirmation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(3);
  
  // Get user role from URL params to determine correct login page
  const userRole = searchParams.get('role') || 'customer';
  const loginPath = userRole === 'vendor' ? '/vendor/login' : '/customer/login';

  useEffect(() => {
    // Auto-redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleLoginAgain = () => {
    navigate(loginPath);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
              <CircleCheck className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {t("logoutConfirmation.title", "You have been logged out successfully.")}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {t(
              "logoutConfirmation.redirectMessage",
              "Redirecting to homepage in {{countdown}} seconds...",
              { countdown }
            )}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoHome}
              className="flex-1 bg-gradient-to-r from-navy-600 to-navy-700 hover:from-navy-700 hover:to-navy-800 text-white"
            >
              <Home className="h-4 w-4 mr-2" />
              {t("logoutConfirmation.goToHome", "Go to Home")}
            </Button>
            <Button
              onClick={handleLoginAgain}
              variant="outline"
              className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
            >
              <LogIn className="h-4 w-4 mr-2" />
              {t("logoutConfirmation.loginAgain", "Login Again")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogoutConfirmation;

