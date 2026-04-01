import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.rainleafresort.com'; // Replace with actual domain
const DEFAULT_IMAGE = `${SITE_URL}/images/hero-banner.jpeg`;

export default function SEO({
  title,
  description,
  keywords,
  canonicalPath = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
}) {
  const fullTitle = title
    ? `${title} | Rainleaf Family Retreat - Wayanad`
    : 'Rainleaf Family Retreat - Private Villas with Pool in Wayanad, Kerala';

  const fullDescription =
    description ||
    '3 exclusive private villas with swimming pools in Wayanad, Kerala. Enjoy complimentary breakfast, trekking, and total privacy. Book your family retreat today.';

  const fullKeywords =
    keywords ||
    'Rainleaf Family Retreat, Wayanad villa, private pool villa Wayanad, homestay Wayanad Kerala, family resort Wayanad, Kaniyambetta resort, private villa Kerala, Wayanad accommodation';

  const canonicalURL = `${SITE_URL}${canonicalPath}`;

  return (
    <Helmet>
      {/* Primary Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Rainleaf Family Retreat" />
      <link rel="canonical" href={canonicalURL} />

      {/* Open Graph (Facebook, WhatsApp, etc.) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonicalURL} />
      <meta property="og:site_name" content="Rainleaf Family Retreat" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />

      {/* Geo tags for local SEO */}
      <meta name="geo.region" content="IN-KL" />
      <meta name="geo.placename" content="Kaniyambetta, Wayanad, Kerala" />
      <meta name="geo.position" content="11.65;76.08" />
      <meta name="ICBM" content="11.65, 76.08" />
    </Helmet>
  );
}
