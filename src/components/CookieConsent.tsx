import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { X, Cookie, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CookieConsent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showConsent, setShowConsent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always true, cannot be disabled
    performance: false,
    functional: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const preferences = {
      essential: true,
      performance: true,
      functional: true,
      marketing: true,
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowConsent(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(cookiePreferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowConsent(false);
    setShowSettings(false);
  };

  const handleDecline = () => {
    const preferences = {
      essential: true, // Always true
      performance: false,
      functional: false,
      marketing: false,
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowConsent(false);
  };

  const handlePreferenceChange = (type: keyof typeof cookiePreferences) => {
    if (type === 'essential') return; // Essential cookies cannot be disabled
    
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleViewPolicy = () => {
    navigate('/cookies');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Cookie className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold text-lg">Cookie Consent</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
              By clicking "Accept All", you consent to our use of cookies. You can manage your preferences or learn more in our{" "}
              <button 
                onClick={handleViewPolicy}
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Cookie Policy
              </button>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            {!showSettings ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Customize
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDecline}
                >
                  Decline
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Accept All
                </Button>
              </>
            ) : (
              <div className="w-full lg:w-auto">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-3">
                  <h4 className="font-medium mb-3">Cookie Preferences</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Essential Cookies</p>
                        <p className="text-xs text-muted-foreground">Required for basic website functionality</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={cookiePreferences.essential}
                        disabled
                        className="rounded"
                        aria-label="Essential cookies (required)"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Performance Cookies</p>
                        <p className="text-xs text-muted-foreground">Help us understand how you use our website</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={cookiePreferences.performance}
                        onChange={() => handlePreferenceChange('performance')}
                        className="rounded"
                        aria-label="Performance cookies"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Functional Cookies</p>
                        <p className="text-xs text-muted-foreground">Remember your preferences and settings</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={cookiePreferences.functional}
                        onChange={() => handlePreferenceChange('functional')}
                        className="rounded"
                        aria-label="Functional cookies"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Marketing Cookies</p>
                        <p className="text-xs text-muted-foreground">Used to deliver relevant advertisements</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={cookiePreferences.marketing}
                        onChange={() => handlePreferenceChange('marketing')}
                        className="rounded"
                        aria-label="Marketing cookies"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(false)}
                  >
                    Back
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAcceptSelected}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
