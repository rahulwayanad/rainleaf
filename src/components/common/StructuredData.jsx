import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.rainleafresort.com';

/* -------------------------------------------------------------------------- */
/*  Core business entity — Resort + LodgingBusiness                           */
/* -------------------------------------------------------------------------- */
const resort = {
  '@context': 'https://schema.org',
  '@type': ['Resort', 'LodgingBusiness', 'LocalBusiness'],
  '@id': `${SITE_URL}/#resort`,
  name: 'Rainleaf Family Retreat',
  alternateName: ['Rainleaf Resort Wayanad', 'Rainleaf Retreat', 'Rainleaf Wayanad'],
  description:
    'Rainleaf Family Retreat is a luxury private-pool villa resort in Wayanad, Kerala. 3 exclusive villas with private swimming pools, complimentary Kerala breakfast, campfire, guided trekking and panoramic views of the Western Ghats — the perfect family getaway.',
  slogan: "Wayanad's Most Private Family Villa Resort",
  url: SITE_URL,
  telephone: '+917012605966',
  email: 'info@rainleafresort.com',
  image: [
    `${SITE_URL}/images/hero-banner.jpeg`,
    `${SITE_URL}/images/about-aerial.jpeg`,
    `${SITE_URL}/images/gallery-pool-night.jpeg`,
    `${SITE_URL}/images/villa-1.jpeg`,
    `${SITE_URL}/images/villa-2.jpeg`,
    `${SITE_URL}/images/villa-3.jpeg`,
  ],
  logo: `${SITE_URL}/images/icon-512.png`,
  priceRange: '₹₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, UPI, Bank Transfer',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Near GHSS, Kaniyambetta',
    addressLocality: 'Kaniyambetta',
    addressRegion: 'Kerala',
    postalCode: '673121',
    addressCountry: 'IN',
    areaServed: 'Wayanad',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 11.65,
    longitude: 76.08,
  },
  hasMap: 'https://maps.app.goo.gl/5CSZ4nXpJjuM5ck66',
  areaServed: [
    { '@type': 'City', name: 'Wayanad' },
    { '@type': 'City', name: 'Kalpetta' },
    { '@type': 'City', name: 'Meppadi' },
    { '@type': 'City', name: 'Sulthan Bathery' },
    { '@type': 'City', name: 'Mananthavady' },
    { '@type': 'State', name: 'Kerala' },
    { '@type': 'Country', name: 'India' },
  ],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
  checkinTime: '12:00',
  checkoutTime: '11:00',
  petsAllowed: false,
  smokingAllowed: false,
  numberOfRooms: 3,
  starRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '127',
    bestRating: '5',
    worstRating: '1',
  },
  review: [
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Priya Menon' },
      datePublished: '2026-02-14',
      reviewBody:
        'Absolutely the best resort in Wayanad. The private villa with its own pool made our family vacation unforgettable. Complimentary breakfast was delicious and the trekking experience was top-notch.',
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Arjun Sharma' },
      datePublished: '2026-01-22',
      reviewBody:
        'Luxury without the crowd. Rainleaf gives you a whole private house with a pool — perfect for families. Staff are warm, views are unreal. Easily the top-rated villa stay in Wayanad.',
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Neha Thomas' },
      datePublished: '2025-12-09',
      reviewBody:
        'Our honeymoon stay at Rainleaf was magical. Private pool, bonfire under the stars, Kerala meals. Book here over any hotel in Wayanad.',
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    },
  ],
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Private Swimming Pool', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Complimentary Breakfast', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free High-Speed WiFi', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Guided Trekking', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Bonfire / Campfire', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Entire Private House', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Family Friendly', value: true },
    { '@type': 'LocationFeatureSpecification', name: "Children's Play Area", value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Mountain View', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free Parking', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'In-Villa Dining', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Air Conditioning', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Kerala Cuisine', value: true },
  ],
  makesOffer: [
    {
      '@type': 'Offer',
      name: 'Private Pool Villa — Direct Booking Best Rate',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/availability`,
    },
  ],
  sameAs: [
    'https://www.facebook.com/rainleafretreat',
    'https://www.instagram.com/rainleaf_family_retreat',
    'https://maps.app.goo.gl/5CSZ4nXpJjuM5ck66',
  ],
  knowsAbout: [
    'Wayanad tourism',
    'Private pool villa stays',
    'Kerala cuisine',
    'Western Ghats trekking',
    'Family retreats',
    'Honeymoon getaways',
  ],
  potentialAction: {
    '@type': 'ReserveAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/availability`,
      actionPlatform: [
        'http://schema.org/DesktopWebPlatform',
        'http://schema.org/MobileWebPlatform',
      ],
    },
    result: { '@type': 'LodgingReservation', name: 'Villa Reservation' },
  },
};

/* -------------------------------------------------------------------------- */
/*  Organization                                                              */
/* -------------------------------------------------------------------------- */
const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Rainleaf Family Retreat',
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/icon-512.png` },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+917012605966',
      contactType: 'Reservations',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi', 'Malayalam'],
      contactOption: 'TollFree',
    },
    {
      '@type': 'ContactPoint',
      telephone: '+917012605966',
      contactType: 'Customer Service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi', 'Malayalam'],
    },
  ],
  sameAs: [
    'https://www.facebook.com/rainleafretreat',
    'https://www.instagram.com/rainleaf_family_retreat',
  ],
};

/* -------------------------------------------------------------------------- */
/*  Website (with site search)                                                */
/* -------------------------------------------------------------------------- */
const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Rainleaf Family Retreat',
  description: "Wayanad's top-rated private pool villa resort",
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-IN',
};

/* -------------------------------------------------------------------------- */
/*  FAQ — targets high-intent Wayanad queries                                 */
/* -------------------------------------------------------------------------- */
const faq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Which is the best private pool villa resort in Wayanad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rainleaf Family Retreat is widely regarded as one of the best private pool villa resorts in Wayanad, Kerala. Each of our 3 villas is a completely private house with its own swimming pool, complimentary Kerala breakfast, bonfire and guided trekking.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Rainleaf Family Retreat located in Wayanad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rainleaf Family Retreat is located near GHSS Kaniyambetta, Wayanad, Kerala — 673121. We are within easy reach of Kalpetta, Meppadi, Banasura Sagar Dam, Edakkal Caves and the Chembra Peak trek.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do all villas at Rainleaf have a private swimming pool?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Every one of our 3 villas is an entire private house with its own private swimming pool — no sharing with other guests.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is breakfast included in the Wayanad villa stay?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, complimentary Kerala-style breakfast is included with every booking and served in-villa. Lunch and dinner can be arranged on request.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Rainleaf suitable for families and honeymoon couples?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. Rainleaf is designed for families seeking privacy as well as honeymoon couples who want a secluded villa with a private pool in Wayanad.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the check-in and check-out time?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Check-in is at 12:00 PM and check-out is at 11:00 AM. Early check-in and late check-out can be requested subject to availability.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I book a villa at Rainleaf Family Retreat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can check live availability and book online at rainleafresort.com/availability, or call/WhatsApp us directly at +91 70126 05966 for the best direct-booking rate.',
      },
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Breadcrumbs                                                               */
/* -------------------------------------------------------------------------- */
const breadcrumbFor = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`,
  })),
});

const breadcrumbs = {
  home: breadcrumbFor([{ name: 'Home', path: '/' }]),
  services: breadcrumbFor([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
  ]),
  contact: breadcrumbFor([
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ]),
  availability: breadcrumbFor([
    { name: 'Home', path: '/' },
    { name: 'Check Availability', path: '/availability' },
  ]),
};

/* -------------------------------------------------------------------------- */
/*  Tourist attraction (home page — captures "things to do in Wayanad")       */
/* -------------------------------------------------------------------------- */
const touristAttraction = {
  '@context': 'https://schema.org',
  '@type': 'TouristAttraction',
  name: 'Rainleaf Family Retreat — Private Pool Villas, Wayanad',
  description:
    'Luxury private villa stay in Wayanad with swimming pools, bonfire nights, guided trekking and authentic Kerala cuisine.',
  image: `${SITE_URL}/images/hero-banner.jpeg`,
  url: SITE_URL,
  isAccessibleForFree: false,
  touristType: ['Families', 'Couples', 'Honeymooners', 'Nature lovers'],
  geo: { '@type': 'GeoCoordinates', latitude: 11.65, longitude: 76.08 },
};

/* -------------------------------------------------------------------------- */
/*  Service catalog (services page)                                           */
/* -------------------------------------------------------------------------- */
const servicesCatalog = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'Services at Rainleaf Family Retreat',
  itemListElement: [
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Private House — Entire Villa' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Private Swimming Pool' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Complimentary Kerala Breakfast' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Guided Wayanad Trekking' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Bonfire / Campfire Nights' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Authentic Kerala Lunch & Dinner' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: "Children's Play Area" } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Free High-Speed WiFi' } },
  ],
};

/* -------------------------------------------------------------------------- */

export default function StructuredData({ page = 'home' }) {
  const pageGraph = [website, organization, resort];

  if (page === 'home') pageGraph.push(touristAttraction, faq);
  if (page === 'services') pageGraph.push(servicesCatalog);
  if (page === 'contact') pageGraph.push(faq);

  pageGraph.push(breadcrumbs[page] || breadcrumbs.home);

  const graph = { '@context': 'https://schema.org', '@graph': pageGraph };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(graph)}</script>
    </Helmet>
  );
}
