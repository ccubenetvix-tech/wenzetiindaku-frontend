import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initAnalytics, trackPageView } from "@/lib/analytics";

// Starts Google Analytics once cookies are accepted and records a page view on every route change.
export default function AnalyticsTracker() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const onConsentChange = () => {
      initAnalytics();
      trackPageView(window.location.pathname + window.location.search);
    };
    window.addEventListener("cookie-consent-changed", onConsentChange);
    return () => window.removeEventListener("cookie-consent-changed", onConsentChange);
  }, []);

  useEffect(() => {
    initAnalytics();
    trackPageView(pathname + search);
  }, [pathname, search]);

  return null;
}
