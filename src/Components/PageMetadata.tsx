import { Helmet } from 'react-helmet-async';

interface PageMetadataProps {
  title: string;
  description?: string;
  image?: string;
  type?: string;
}

export function PageMetadata({ 
  title, 
  description, 
  image,
  type = 'website' 
}: PageMetadataProps) {
  const fullTitle = `${title} - UNDP Future Trends and Signals System`;
  const defaultDescription = "Explore emerging trends and weak signals of change to inform development strategies and decision-making at UNDP.";
  const defaultImage = 'https://www.undp.org/sites/g/files/zskgke326/files/2023-01/undp-logo-blue.svg';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:type" content={type} />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
}