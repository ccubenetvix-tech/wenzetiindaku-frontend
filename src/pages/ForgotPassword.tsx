import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { getApiBaseUrl } from "@/utils/api";
import i18n from "@/lib/i18n";

const API_BASE_URL = getApiBaseUrl();

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<"request" | "reset">("request");

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast({
        title: i18n.t('pages.forgotPassword.emailIsRequired'),
        description: i18n.t('pages.forgotPassword.pleaseEnterYourRegisteredEmail'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/customer/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error?.message || i18n.t('pages.forgotPassword.failedToSendOtp'));
      }

      toast({
        title: i18n.t('pages.forgotPassword.otpSent'),
        description: i18n.t('pages.forgotPassword.pleaseCheckYourEmailForThe'),
      });

      setStage("reset");
    } catch (error) {
      toast({
        title: i18n.t('pages.forgotPassword.requestFailed'),
        description: error instanceof Error ? error.message : i18n.t('pages.forgotPassword.anErrorOccurred'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword.length < 8) {
      toast({
        title: i18n.t('pages.forgotPassword.passwordTooShort'),
        description: i18n.t('pages.forgotPassword.newPasswordMustBeAtLeast'),
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: i18n.t('pages.forgotPassword.passwordsDoNotMatch'),
        description: i18n.t('pages.forgotPassword.pleaseReTypeTheSameNew'),
        variant: "destructive",
      });
      return;
    }

    if (formData.otp.length !== 6) {
      toast({
        title: i18n.t('pages.forgotPassword.invalidOtp'),
        description: i18n.t('pages.forgotPassword.pleaseEnterThe6DigitOtp'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/customer/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error?.message || i18n.t('pages.forgotPassword.failedToResetPassword'));
      }

      toast({
        title: i18n.t('pages.forgotPassword.passwordUpdated'),
        description: i18n.t('pages.forgotPassword.pleaseLoginWithYourNewPassword'),
      });

      navigate("/customer/login");
    } catch (error) {
      toast({
        title: i18n.t('pages.forgotPassword.resetFailed'),
        description: error instanceof Error ? error.message : i18n.t('pages.forgotPassword.anErrorOccurred'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!formData.email.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/customer/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error?.message || i18n.t('pages.forgotPassword.failedToResendOtp'));
      }

      toast({
        title: i18n.t('pages.forgotPassword.otpResent'),
        description: i18n.t('pages.forgotPassword.pleaseCheckYourEmailForThe2'),
      });

      setFormData((prev) => ({ ...prev, otp: "" }));
    } catch (error) {
      toast({
        title: i18n.t('pages.forgotPassword.resendFailed'),
        description: error instanceof Error ? error.message : i18n.t('pages.forgotPassword.anErrorOccurred'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            onClick={() => navigate("/customer/login")}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("backToHome")}
          </Button>

          <div className="card p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">{t("forgotPassword")}</h1>
              <p className="text-muted-foreground">{t('pages.forgotPassword.resetYourCustomerAccountPassword')}</p>
            </div>

            {stage === "request" ? (
              <form onSubmit={requestOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    {t("emailAddress")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t("enterEmail")}
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="pl-10 border-muted focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full gradient-primary hover:from-blue-700 hover:to-blue-800 text-white py-3"
                >
                  {isLoading ? t('pages.forgotPassword.sending') : t('pages.forgotPassword.sendOtp')}
                </Button>
              </form>
            ) : (
              <form onSubmit={resetPassword} className="space-y-6">
                <div className="text-center mb-2">
                  <p className="text-sm text-muted-foreground">{t('pages.forgotPassword.codeSentTo')}</p>
                  <p className="text-sm font-medium text-primary">{formData.email}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium text-foreground">
                    {t("verificationCode")}
                  </Label>
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    placeholder={t("enterCode")}
                    value={formData.otp}
                    onChange={handleInputChange}
                    required
                    maxLength={6}
                    className="text-center tracking-widest border-muted focus:border-primary focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    {t("enterCodeInstructions", "Enter the 6-digit code sent to your email")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium text-foreground">
                    {t("password")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder={t("createPassword")}
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      required
                      minLength={8}
                      className="border-muted focus:border-primary focus:ring-primary pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    {t("confirmPassword")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t("createPassword")}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      minLength={8}
                      className="border-muted focus:border-primary focus:ring-primary pr-10"
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
                </div>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={resendOtp}
                    disabled={isLoading}
                    className="text-primary hover:text-primary/80"
                  >
                    {t("resendCode")}
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    formData.otp.length !== 6 ||
                    formData.newPassword.length < 8 ||
                    formData.confirmPassword.length < 8
                  }
                  className="w-full gradient-primary hover:from-blue-700 hover:to-blue-800 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? t('pages.forgotPassword.resetting') : t('pages.forgotPassword.resetPassword')}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setStage("request")}
                    disabled={isLoading}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {t('pages.forgotPassword.changeEmail')}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;

