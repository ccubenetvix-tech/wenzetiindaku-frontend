// Import i18next for internationalization support
import { useTranslation } from "react-i18next";
// Import React Router for navigation
import { useNavigate } from "react-router-dom";
// Import Lucide React icons for social media and contact information
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

/**
 * Footer Component - Main footer for the marketplace
 * 
 * Features:
 * - Company information and branding
 * - Organized link sections (Company, Support, Legal)
 * - Contact information with icons
 * - Social media links
 * - Admin access link for testing
 * - Responsive design
 */
export function Footer() {
  // Internationalization hook for translated text
  const { t } = useTranslation();
  // Navigation hook for programmatic routing
  const navigate = useNavigate();

  // Footer link structure organized by categories
  const footerLinks = [
    {
      title: "Company",                    // Company information section
      links: [
        { name: t('about'), href: '/about' },           // About page
        { name: t('contact'), href: '/contact' },       // Contact page
      ]
    },
    {
      title: "Support",                    // Customer support section
      links: [
        { name: t('helpCenter'), href: '/help' },       // Help center
        { name: t('faqs'), href: '/faqs' },             // FAQ page
        { name: t('shippingInfo'), href: '/shipping' }, // Shipping information
        { name: t('returns'), href: '/returns' },       // Returns policy
      ]
    },
    {
      title: "Legal",                      // Legal documents section
      links: [
        { name: t('privacyPolicy'), href: '/privacy' }, // Privacy policy
        { name: t('termsOfService'), href: '/terms' },  // Terms of service
        { name: t('cookiePolicy'), href: '/cookies' },  // Cookie policy
        { name: "Vendor Terms", href: '/vendor-terms' }, // Vendor terms (static text)
      ]
    }
  ];

  return (
    <footer className="bg-muted mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              WENZE TII NDAKU
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Your premier multi-vendor marketplace connecting you with the best local and international vendors across Africa and beyond.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@wenzetiindaku.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>123 Marketplace St, Commerce City</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4 text-foreground">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => navigate(link.href)}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
            <p className="text-muted-foreground text-sm">
              © 2025 WENZE TII NDAKU. All rights reserved.
            </p>
            {/* Admin Access Link - for testing purposes */}
            <button
              onClick={() => navigate('/admin/login')}
              className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200 underline"
            >
              Admin Access
            </button>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              title="Follow us on Facebook"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              title="Follow us on Twitter"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              title="Follow us on Instagram"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}