import Head from 'next/head';

/**
 * Props interface for SEO component
 */
interface SEOProps {
  title?: string;           // Page title
  description?: string;     // Meta description
  image?: string;          // OG image URL
  url?: string;            // Canonical URL
}

/**
 * SEO Component
 * Handles all meta tags and SEO-related head elements
 * Provides default values for Capture Incridea website
 */
const SEO = ({ 
  title = "Capture Incridea | Official Gallery of Incridea", 
  description = "Capture Incridea is the official digital gallery platform of Incridea, the annual techno-cultural fest of NMAM Institute of Technology, Nitte.",
  image = "/images/Logo/favicon.png",
  url = "https://capture.incridea.in"
}: SEOProps) => {
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Social Media Meta Tags */}
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Technical Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={url} />
      
      {/* Favicon Configuration */}
      <link rel="icon" type="image/png" sizes="32x32" href="/images/Logo/favicon.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/images/Logo/favicon.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/images/Logo/favicon.png" />
    </Head>
  );
};

export default SEO;
