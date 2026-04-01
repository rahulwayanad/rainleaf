import { Helmet } from 'react-helmet-async';

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Rainleaf Family Retreat',
  description:
    '3 exclusive private villas with swimming pools nestled in the serene hills of Wayanad, Kerala. Perfect family retreat with complimentary breakfast and trekking.',
  url: 'https://www.rainleafresort.com',
  telephone: '+917012605966',
  email: 'info@rainleafresort.com',
  image: 'https://www.rainleafresort.com/images/hero-banner.jpeg',
  logo: 'https://www.rainleafresort.com/images/hero-banner.jpeg',
  priceRange: '₹₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Near GHSS, Kaniyambetta',
    addressLocality: 'Wayanad',
    addressRegion: 'Kerala',
    postalCode: '673121',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 11.65,
    longitude: 76.08,
  },
  hasMap: 'https://maps.app.goo.gl/5CSZ4nXpJjuM5ck66',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    ],
    opens: '00:00',
    closes: '23:59',
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Private Swimming Pool', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free Breakfast', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Trekking', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Camp Fire', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Private House', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Family Friendly', value: true },
  ],
  numberOfRooms: 3,
  starRating: { '@type': 'Rating', ratingValue: '5' },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '50',
    bestRating: '5',
    worstRating: '1',
  },
  sameAs: [
    'https://www.facebook.com/rainleafretreat',
    'https://www.instagram.com/rainleafretreat',
  ],
};

const breadcrumbHome = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.rainleafresort.com/' },
  ],
};

export default function StructuredData({ page = 'home' }) {
  const breadcrumbs = {
    home: breadcrumbHome,
    services: {
      ...breadcrumbHome,
      itemListElement: [
        ...breadcrumbHome.itemListElement,
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.rainleafresort.com/services' },
      ],
    },
    contact: {
      ...breadcrumbHome,
      itemListElement: [
        ...breadcrumbHome.itemListElement,
        { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://www.rainleafresort.com/contact' },
      ],
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(localBusiness)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbs[page] || breadcrumbHome)}
      </script>
    </Helmet>
  );
}
