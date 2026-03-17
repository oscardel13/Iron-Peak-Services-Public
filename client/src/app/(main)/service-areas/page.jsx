// app/service-areas/page.jsx
import Link from "next/link";
import Hero from "@/components/hero/hero.component";
import METADATA from "@/data/data";

const siteUrl = "https://iron-peak-services.com";

const SERVICE_AREAS = [
  { slug: "denver-co", name: "Denver, CO" },
  { slug: "aurora-co", name: "Aurora, CO" },
  { slug: "lakewood-co", name: "Lakewood, CO" },
  { slug: "arvada-co", name: "Arvada, CO" },
  { slug: "littleton-co", name: "Littleton, CO" },
  { slug: "golden-co", name: "Golden, CO" },
  { slug: "englewood-co", name: "Englewood, CO" },
  { slug: "wheat-ridge-co", name: "Wheat Ridge, CO" },
  { slug: "highlands-ranch-co", name: "Highlands Ranch, CO" },
  { slug: "centennial-co", name: "Centennial, CO" },
  { slug: "commerce-city-co", name: "Commerce City, CO" },
  { slug: "brighton-co", name: "Brighton, CO" },
  { slug: "broomfield-co", name: "Broomfield, CO" },
  { slug: "thornton-co", name: "Thornton, CO" },
  { slug: "northglenn-co", name: "Northglenn, CO" },
  { slug: "federal-heights-co", name: "Federal Heights, CO" },
  { slug: "sherrelwood-co", name: "Sherrelwood, CO" },
  { slug: "welby-co", name: "Welby, CO" },
  { slug: "frederick-co", name: "Frederick, CO" },
  { slug: "firestone-co", name: "Firestone, CO" },
  { slug: "dacono-co", name: "Dacono, CO" },
  { slug: "erie-co", name: "Erie, CO" },
  { slug: "louisville-co", name: "Louisville, CO" },
  { slug: "superior-co", name: "Superior, CO" },
  { slug: "westminster-co", name: "Westminster, CO" },
  { slug: "castle-rock-co", name: "Castle Rock, CO" },
  { slug: "lone-tree-co", name: "Lone Tree, CO" },
  { slug: "parker-co", name: "Parker, CO" },
  { slug: "bennett-co", name: "Bennett, CO" },
  { slug: "elizabeth-co", name: "Elizabeth, CO" },
  { slug: "kiowa-co", name: "Kiowa, CO" },
  { slug: "watkins-co", name: "Watkins, CO" },
  { slug: "byers-co", name: "Byers, CO" },
  { slug: "evergreen-co", name: "Evergreen, CO" },
  { slug: "morrison-co", name: "Morrison, CO" },
  { slug: "conifer-co", name: "Conifer, CO" },
  { slug: "longmont-co", name: "Longmont, CO" },
  { slug: "pueblo-co", name: "Pueblo, CO" },
];

export const metadata = {
  title: "Dumpster Rental, Junk Removal & Demolition Service Areas | Iron Peak Services",
  description:
    "Iron Peak Services provides dumpster rental, junk removal, and demolition services across Denver and surrounding Colorado communities.",
  alternates: {
    canonical: `${siteUrl}/service-areas`,
  },
  openGraph: {
    title:
      "Dumpster Rental, Junk Removal & Demolition Service Areas | Iron Peak Services",
    description:
      "Local, reliable dumpster rental, junk removal, and demolition services serving Denver, Aurora, Lakewood, Thornton, and surrounding Colorado communities.",
    url: `${siteUrl}/service-areas`,
    type: "website",
  },
};

export default function ServiceAreasOverviewPage() {
  return (
    <div className="flex flex-col">
      <Hero>
        <div className="relative max-w-3xl mx-auto text-center space-y-4 px-4">
          <p className="text-sm tracking-[0.28em] text-gray-200 uppercase">
            Service Areas
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Dumpster Rental, Junk Removal & Demolition in the Denver Metro
          </h1>

          <p className="text-lg md:text-xl text-gray-100">
            Reliable dumpster rentals, junk removal, and light demolition
            services across Denver and surrounding Colorado communities.
          </p>

          <a
            href={METADATA.clickablePhone}
            className="inline-flex justify-center items-center mt-4 px-6 py-3 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary-hover transition"
          >
            Call {METADATA.phone}
          </a>
        </div>
      </Hero>

      <section className="px-4 md:px-16 py-12 bg-white">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-text-primary">
            Areas We Serve
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Iron Peak Services is a local, family-run company providing dumpster
            rentals, junk removal, and light demolition services throughout the
            Denver metro area and surrounding communities. Whether you&apos;re
            tackling a home cleanout, renovation, construction project, or
            property cleanup, we provide reliable service and straightforward
            scheduling.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Below are some of the cities and neighborhoods we regularly serve.
            If you don&apos;t see your location listed but you&apos;re near the
            Denver metro area, feel free to reach out—we may still be able to
            help with your project.
          </p>
        </div>
      </section>

      <section className="px-4 md:px-16 pb-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-row items-center gap-3 mb-6">
            <div className="w-10 h-0.5 bg-brand-text-primary" />
            <h2 className="text-xl font-bold text-gray-800">
              Cities & Communities We Serve
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {SERVICE_AREAS.map((area) => (
              <Link
                key={area.slug}
                href={`/service-areas/${area.slug}`}
                className="block border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 hover:bg-gray-100 hover:border-brand-primary transition"
              >
                <span className="text-sm font-semibold text-gray-800">
                  {area.name}
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  Learn more about our dumpster rental, junk removal, and
                  demolition services in {area.name}.
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}