import i18n from '@/lib/i18n';
import { predefinedCategories } from '@/data/categories';

// Formatting helpers that follow the language the user picked on the site,
// not the browser's locale. Components re-render on language change via
// useTranslation(), so these pick up the new language automatically.

const LOCALES: Record<string, string> = { en: 'en-US', fr: 'fr-FR' };

export const currentLocale = (): string => LOCALES[i18n.language?.split('-')[0]] ?? 'en-US';

export const formatDate = (
  input?: string | number | Date | null,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' },
): string => {
  if (input === null || input === undefined || input === '') return '—';
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return String(input);
  return new Intl.DateTimeFormat(currentLocale(), options).format(date);
};

export const formatDateTime = (input?: string | number | Date | null): string =>
  formatDate(input, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export const formatTime = (input?: string | number | Date | null): string =>
  formatDate(input, { hour: '2-digit', minute: '2-digit' });

export const formatLongDate = (input?: string | number | Date | null): string =>
  formatDate(input, { year: 'numeric', month: 'long', day: 'numeric' });

export const formatMoney = (value: unknown, currency = 'USD'): string => {
  const amount = typeof value === 'number' ? value : Number.parseFloat(String(value ?? 0));
  return new Intl.NumberFormat(currentLocale(), { style: 'currency', currency, maximumFractionDigits: 2 })
    .format(Number.isFinite(amount) ? amount : 0);
};

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat(currentLocale()).format(Number.isFinite(value) ? value : 0);

const titleCase = (value: string): string =>
  value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

// Order / payment / account statuses come from the database as raw values
// like "out_for_delivery"; translate the known ones, title-case anything else.
export const formatStatus = (status?: string | null): string => {
  if (!status) return i18n.t('status.unknown');
  const key = status.trim().toLowerCase().replace(/[\s-]+/g, '_');
  return i18n.t(`status.${key}`, { defaultValue: titleCase(status) });
};

// Payment method values stored on orders: 'cod', 'online', 'paid by card', ...
export const formatPaymentMethod = (method?: string | null): string => {
  if (!method) return i18n.t('paymentMethods.unknown');
  const key = method.trim().toLowerCase().replace(/[\s-]+/g, '_');
  return i18n.t(`paymentMethods.${key}`, { defaultValue: titleCase(method) });
};

// Categories are stored in the database by their English name ("Home & Garden").
// Map them to the translated label; unknown/custom categories show as stored.
export const categoryLabel = (value?: string | null): string => {
  if (!value) return i18n.t('unknownCategory');
  const match = predefinedCategories.find(
    (c) => c.id.toLowerCase() === value.toLowerCase() || c.name === value,
  );
  return match ? i18n.t(match.name) : value;
};

// "Just now", "5 min ago", "3 days ago" -- localized by the browser's Intl data.
export const formatRelativeTime = (input?: string | number | Date | null): string => {
  if (input === null || input === undefined || input === '') return '—';
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return String(input);
  const minutes = Math.round((date.getTime() - Date.now()) / 60000);
  if (Math.abs(minutes) < 1) return i18n.t('time.justNow');
  const rtf = new Intl.RelativeTimeFormat(currentLocale(), { numeric: 'auto', style: 'short' });
  if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 7) return rtf.format(days, 'day');
  return formatDate(date);
};
