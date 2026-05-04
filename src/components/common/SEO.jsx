import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.rainleafresort.com';
const DEFAULT_IMAGE = `${SITE_URL}/images/hero-banner.jpeg`;

const DEFAULT_TITLE =
  'Rainleaf Family Retreat — #1 Private Pool Villa Resort in Wayanad, Kerala';

const DEFAULT_DESCRIPTION =
  'Rainleaf Family Retreat — affordable, budget-friendly private pool villas in Wayanad, Kerala. 3 exclusive villas with private swimming pools, complimentary Kerala breakfast, bonfire, guided trekking & 24×7 WiFi near Kaniyambetta. Book direct for the best-value private pool villa rate in Wayanad.';

const DEFAULT_KEYWORDS = [
  'resorts in Wayanad',
  'best resort in Wayanad',
  'Wayanad resort',
  'luxury resort Wayanad',
  'private pool villa Wayanad',
  'villa with private pool Wayanad',
  'family resort Wayanad',
  'Wayanad homestay with pool',
  'Kaniyambetta resort',
  'honeymoon resort Wayanad',
  'Rainleaf Family Retreat',
  'Rainleaf Resort Wayanad',
  'resort near Kalpetta',
  'resort near Meppadi',
  'resort near Banasura Sagar Dam',
  'Wayanad Kerala resort booking',
  'private villa Kerala',
  'Wayanad accommodation',
  // Budget / value-focused
  'budget friendly private pool villa Wayanad',
  'budget private pool villa in Wayanad',
  'affordable private pool villa Wayanad',
  'cheap private pool villa Wayanad',
  'low budget private pool villa Wayanad',
  'budget resort in Wayanad',
  'affordable resort in Wayanad',
  'cheap resort in Wayanad with pool',
  'budget villa with private pool Kerala',
  'best value private pool villa Wayanad',
  'low cost pool villa Wayanad',
  'affordable family villa Wayanad',
  'budget honeymoon villa Wayanad',
].join(', ');

export default function SEO({
  title,
  description,
  keywords,
  canonicalPath = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
}) {
  const fullTitle = title
    ? `${title} | Rainleaf Family Retreat — Wayanad's Best Private Pool Resort`
    : DEFAULT_TITLE;

  const fullDescription = description || DEFAULT_DESCRIPTION;
  const fullKeywords = keywords || DEFAULT_KEYWORDS;
  const canonicalURL = `${SITE_URL}${canonicalPath}`;
  const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return (
    <Helmet prioritizeSeoTags>
      {/* Primary Meta */}
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta
        name="robots"
        content={
          noindex
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        }
      />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1" />
      <meta name="bingbot" content="index, follow" />
      <meta name="author" content="Rainleaf Family Retreat" />
      <meta name="publisher" content="Rainleaf Family Retreat" />
      <meta name="copyright" content="Rainleaf Family Retreat" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="3 days" />
      <meta name="rating" content="General" />
      <meta name="distribution" content="global" />
      <meta name="coverage" content="Worldwide" />
      <meta name="target" content="all" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />
      <meta name="format-detection" content="telephone=yes" />
      <link rel="canonical" href={canonicalURL} />

      {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:secure_url" content={absoluteImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Rainleaf Family Retreat - Private Pool Villa in Wayanad, Kerala" />
      <meta property="og:url" content={canonicalURL} />
      <meta property="og:site_name" content="Rainleaf Family Retreat" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={absoluteImage} />
      <meta name="twitter:image:alt" content="Rainleaf Family Retreat - Private Pool Villa in Wayanad, Kerala" />
      <meta name="twitter:site" content="@rainleafretreat" />
      <meta name="twitter:creator" content="@rainleafretreat" />

      {/* Geo / Local SEO */}
      <meta name="geo.region" content="IN-KL" />
      <meta name="geo.placename" content="Kaniyambetta, Wayanad, Kerala, India" />
      <meta name="geo.position" content="11.65;76.08" />
      <meta name="ICBM" content="11.65, 76.08" />
      <meta name="DC.title" content={fullTitle} />

      {/* Business / Contact */}
      <meta name="contact" content="info@rainleafresort.com" />
      <meta name="reply-to" content="info@rainleafresort.com" />
      <meta name="owner" content="Rainleaf Family Retreat" />

      {/* Mobile / PWA */}
      <meta name="theme-color" content="#5a8f4a" />
      <meta name="apple-mobile-web-app-title" content="Rainleaf Retreat" />

      {/* Alternate languages (hreflang) */}
      <link rel="alternate" hrefLang="en-in" href={canonicalURL} />
      <link rel="alternate" hrefLang="en" href={canonicalURL} />
      <link rel="alternate" hrefLang="x-default" href={canonicalURL} />
    </Helmet>
  );
}
