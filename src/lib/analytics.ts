// Google Analytics 4 (gtag.js).
// Loads only on production builds and only after the visitor accepts
// "performance" cookies in the cookie banner (see CookieConsent).

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-TKQRYVDF6B";
const ENABLED = import.meta.env.PROD && Boolean(MEASUREMENT_ID);

type GtagArgs = [string, ...unknown[]];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagArgs) => void;
  }
}

let loaded = false;

export const hasAnalyticsConsent = (): boolean => {
  try {
    const consent = JSON.parse(localStorage.getItem("cookie-consent") || "null");
    return Boolean(consent?.performance);
  } catch {
    return false;
  }
};

// Safe to call repeatedly; does nothing until consent is given.
export const initAnalytics = (): void => {
  if (!ENABLED || loaded || !hasAnalyticsConsent()) return;
  loaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: GtagArgs) {
    // gtag expects the arguments object itself on the data layer.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  // Page views are sent by trackPageView on every route change (single-page app).
  window.gtag("config", MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
};

const send = (...args: GtagArgs): void => {
  if (!loaded || !window.gtag) return;
  window.gtag(...args);
};

export const trackPageView = (path: string): void => {
  send("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
};

interface AnalyticsItem {
  id: string;
  name: string;
  price?: number;
  quantity?: number;
  category?: string;
  vendor?: string;
}

const toGaItems = (items: AnalyticsItem[]) =>
  items.map((item) => ({
    item_id: item.id,
    item_name: item.name,
    price: Number(item.price) || 0,
    quantity: item.quantity ?? 1,
    item_category: item.category,
    item_brand: item.vendor,
  }));

const totalOf = (items: AnalyticsItem[]) =>
  items.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity ?? 1), 0);

export const trackSearch = (searchTerm: string): void => {
  if (searchTerm.trim()) send("event", "search", { search_term: searchTerm.trim() });
};

export const trackViewItem = (item: AnalyticsItem): void => {
  send("event", "view_item", { currency: "USD", value: Number(item.price) || 0, items: toGaItems([item]) });
};

export const trackAddToCart = (item: AnalyticsItem): void => {
  send("event", "add_to_cart", { currency: "USD", value: totalOf([item]), items: toGaItems([item]) });
};

export const trackBeginCheckout = (items: AnalyticsItem[]): void => {
  send("event", "begin_checkout", { currency: "USD", value: totalOf(items), items: toGaItems(items) });
};

export const trackPurchase = (transactionId: string, value: number, paymentMethod?: string): void => {
  send("event", "purchase", {
    transaction_id: transactionId,
    currency: "USD",
    value: Number(value) || 0,
    payment_type: paymentMethod,
  });
};
