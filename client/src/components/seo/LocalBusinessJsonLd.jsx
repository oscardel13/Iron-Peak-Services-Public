// components/seo/LocalBusinessJsonLd.tsx
import Script from "next/script";

export default function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Contractor",
    name: "Iron Peak Services",
    url: "https://iron-peak-services.com",
    logo: "https://iron-peak-services.com/assets/logo.png",
    image: "https://iron-peak-services.com/assets/logo.png",
    telephone: "720-515-2245",
    email: "hector@iron-peak-services.com",
    areaServed: [
      "Denver, CO",
      "Aurora, CO",
      "Lakewood, CO",
      "Arvada, CO",
      "Littleton, CO",
      "Golden, CO",
      "Englewood, CO",
      "Wheat Ridge, CO",
      "Highlands Ranch, CO",
      "Centennial, CO",
      "Commerce City, CO",
      "Brighton, CO",
      "Broomfield, CO",
      "Thornton, CO",
      "Northglenn, CO",
      "Federal Heights, CO",
      "Sherrelwood, CO",
      "Welby, CO",
      "Frederick, CO",
      "Firestone, CO",
      "Dacono, CO",
      "Erie, CO",
      "Louisville, CO",
      "Superior, CO",
      "Westminster, CO",
      "Castle Rock, CO",
      "Lone Tree, CO",
      "Parker, CO",
      "Bennett, CO",
      "Elizabeth, CO",
      "Kiowa, CO",
      "Watkins, CO",
      "Byers, CO",
      "Evergreen, CO",
      "Morrison, CO",
      "Conifer, CO",
      "Longmont, CO",
      "Pueblo, CO",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Denver",
      addressRegion: "CO",
      postalCode: "802XX",
      addressCountry: "US",
    },
    sameAs: [
      // add if you have them
      "https://www.facebook.com/DelConcrete/",
      // "https://www.instagram.com/...",
      // "https://g.co/kgs/<your_gbp_short>"
    ],
    priceRange: "$$",
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Concrete Driveways" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Concrete Patios" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Concrete Walkways" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Concrete Sidewalks" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Concrete Slabs" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Concrete Foundations" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Concrete Footings" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Stamped Concrete" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Concrete Removal" },
      },

      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Decorative Concrete",
        },
      },
    ],
  };

  return (
    <Script
      id="ld-localbusiness"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
