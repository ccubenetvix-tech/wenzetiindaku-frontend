import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    schema?: any;
    breadcrumbs?: { name: string; url: string }[];
}

export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    schema,
    breadcrumbs,
}) => {
    const siteName = 'Wenze Tii Ndaku';
    const defaultTitle = 'Wenze Tii Ndaku | African Multi-Vendor Marketplace';
    const defaultDescription = 'Discover Wenze Tii Ndaku, the premier African multi-vendor marketplace. Shop electronics, fashion, beauty, food, and more from trusted vendors.';
    const defaultImage = 'https://www.wenzetiindaku.com/marketplace.jpeg';
    const siteUrl = 'https://www.wenzetiindaku.com';

    const seoTitle = title ? `${title} | ${siteName}` : defaultTitle;
    const seoDescription = description || defaultDescription;
    const seoImage = image || defaultImage;
    const seoUrl = url ? `${siteUrl}${url}` : siteUrl;

    const breadcrumbSchema = breadcrumbs ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": `${siteUrl}${crumb.url}`
        }))
    } : null;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{seoTitle}</title>
            <meta name="description" content={seoDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={seoUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={seoUrl} />
            <meta property="og:title" content={seoTitle} />
            <meta property="og:description" content={seoDescription} />
            <meta property="og:image" content={seoImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={seoUrl} />
            <meta name="twitter:title" content={seoTitle} />
            <meta name="twitter:description" content={seoDescription} />
            <meta name="twitter:image" content={seoImage} />

            {/* Structured Data */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
            {breadcrumbSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            )}
        </Helmet>
    );
};
