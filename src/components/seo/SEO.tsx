import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: string;
}

export default function SEO({
  title,
  description,
  path,
  ogImage = "/hero-bg.webp",
  ogType = "website",
}: SEOProps) {
  const siteUrl = "https://integraltech.ma";
  const canonicalUrl = `${siteUrl}${path}`;
  const fullOgImage = ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`;

  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "IntegralTech",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "sameAs": [
      "https://twitter.com/integraltech",
      "https://linkedin.com/company/integraltech",
      "https://facebook.com/integraltech"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+212-5XX-XXXXXX",
      "contactType": "customer service",
      "areaServed": "MA",
      "availableLanguage": ["French", "English"]
    }
  };

  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "IntegralTech",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/blog?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{`${title} | IntegralTech`}</title>
      <meta name="title" content={`${title} | IntegralTech`} />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={`${title} | IntegralTech`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={`${title} | IntegralTech`} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullOgImage} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLdOrg)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(jsonLdWebsite)}
      </script>
    </Helmet>
  );
}
