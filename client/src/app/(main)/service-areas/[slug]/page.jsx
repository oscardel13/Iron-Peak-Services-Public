// app/service-areas/[slug]/page.jsx
import Image from "next/image";
import { notFound } from "next/navigation";
import Hero from "@/components/hero/hero.component";
import METADATA from "@/data/data";

const siteUrl = "https://iron-peak-services.com";

const AREAS = {
  "denver-co": { city: "Denver", label: "Denver, CO" },
  "aurora-co": { city: "Aurora", label: "Aurora, CO" },
  "lakewood-co": { city: "Lakewood", label: "Lakewood, CO" },
  "arvada-co": { city: "Arvada", label: "Arvada, CO" },
  "littleton-co": { city: "Littleton", label: "Littleton, CO" },
  "golden-co": { city: "Golden", label: "Golden, CO" },
  "englewood-co": { city: "Englewood", label: "Englewood, CO" },
  "wheat-ridge-co": { city: "Wheat Ridge", label: "Wheat Ridge, CO" },
  "highlands-ranch-co": {
    city: "Highlands Ranch",
    label: "Highlands Ranch, CO",
  },
  "centennial-co": { city: "Centennial", label: "Centennial, CO" },
  "commerce-city-co": { city: "Commerce City", label: "Commerce City, CO" },
  "brighton-co": { city: "Brighton", label: "Brighton, CO" },
  "broomfield-co": { city: "Broomfield", label: "Broomfield, CO" },
  "thornton-co": { city: "Thornton", label: "Thornton, CO" },
  "northglenn-co": { city: "Northglenn", label: "Northglenn, CO" },
  "federal-heights-co": {
    city: "Federal Heights",
    label: "Federal Heights, CO",
  },
  "sherrelwood-co": { city: "Sherrelwood", label: "Sherrelwood, CO" },
  "welby-co": { city: "Welby", label: "Welby, CO" },
  "frederick-co": { city: "Frederick", label: "Frederick, CO" },
  "firestone-co": { city: "Firestone", label: "Firestone, CO" },
  "castle-rock-co": { city: "Castle Rock", label: "Castle Rock, CO" },
  "bennett-co": { city: "Bennett", label: "Bennett, CO" },
  "elizabeth-co": { city: "Elizabeth", label: "Elizabeth, CO" },
  "kiowa-co": { city: "Kiowa", label: "Kiowa, CO" },
  "watkins-co": { city: "Watkins", label: "Watkins, CO" },
  "byers-co": { city: "Byers", label: "Byers, CO" },
  "evergreen-co": { city: "Evergreen", label: "Evergreen, CO" },
  "morrison-co": { city: "Morrison", label: "Morrison, CO" },
  "conifer-co": { city: "Conifer", label: "Conifer, CO" },
  "pueblo-co": { city: "Pueblo", label: "Pueblo, CO" },
  "longmont-co": { city: "Longmont", label: "Longmont, CO" },
  "superior-co": { city: "Superior", label: "Superior, CO" },
  "westminster-co": { city: "Westminster", label: "Westminster, CO" },
  "dacono-co": { city: "Dacono", label: "Dacono, CO" },
  "erie-co": { city: "Erie", label: "Erie, CO" },
  "louisville-co": { city: "Louisville", label: "Louisville, CO" },
  "lone-tree-co": { city: "Lone Tree", label: "Lone Tree, CO" },
  "parker-co": { city: "Parker", label: "Parker, CO" },
};

export function generateStaticParams() {
  return Object.keys(AREAS).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const area = AREAS[slug];
  if (!area) return {};

  const title = `Dumpster Rental, Junk Removal & Demolition in ${area.label} | Iron Peak Services`;
  const description = `Reliable dumpster rental, junk removal, and demolition services in ${area.label}. Fast scheduling, fair pricing, and local service you can count on.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/service-areas/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/service-areas/${slug}`,
      type: "website",
    },
  };
}

export default async function ServiceAreaPage({ params }) {
  const { slug } = await params;
  const area = AREAS[slug];

  if (!area) return notFound();

  const h1 = `Dumpster Rental, Junk Removal & Demolition in ${area.label}`;
  const intro = `Iron Peak Services provides dumpster rental, junk removal, and demolition services throughout ${area.label} and nearby communities. Whether you are cleaning out a property, working on a remodel, or clearing debris from a job site, we make the process straightforward with reliable scheduling and clear communication.`;

  return (
    <div className="flex flex-col">
      <Hero>
        <div className="relative max-w-3xl mx-auto text-center space-y-4 px-4">
          <p className="text-sm tracking-[0.28em] text-gray-200 uppercase">
            Service Area
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">{h1}</h1>
          <p className="text-lg md:text-xl text-gray-100">
            Local dumpster rental, junk removal, and demolition services in{" "}
            {area.label}.
          </p>
        </div>
      </Hero>

      <section className="px-4 md:px-16 py-12 bg-white">
        <div className="max-w-5xl mx-auto space-y-8">
          <p className="text-lg text-gray-700">{intro}</p>

          <p className="text-gray-700 leading-relaxed">
            Whether you need a dumpster delivered for a cleanup, help hauling
            away unwanted junk, or demolition for a shed, deck, interior space,
            or other small structure, we bring dependable service and a
            get-it-done attitude to every project.
          </p>

          <p className="text-gray-700 leading-relaxed">
            We’re a family-run company that values clear communication, showing
            up when we say we will, and leaving the site as clean as possible.
            From the first quote to the final pickup or haul-away, you’ll know
            what to expect.
          </p>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <div>
              <h2 className="text-xl font-semibold text-brand-text-primary mb-3">
                Services in {area.city}
              </h2>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>Roll-off dumpster rentals for home and job site cleanup</li>
                <li>Junk removal for homes, offices, and properties</li>
                <li>Light demolition for sheds, decks, fences, and tear-outs</li>
                <li>Construction debris and renovation cleanup</li>
                <li>Property and estate cleanouts</li>
                <li>Flexible scheduling and reliable pickup</li>
                <li>Friendly local service with fair pricing</li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-3">
              <h3 className="text-lg font-semibold text-brand-text-primary">
                Work with a Local Team
              </h3>
              <p className="text-gray-700">
                We regularly work in {area.label} and nearby neighborhoods. Tell
                us about your cleanup, rental, or demolition project and we’ll
                help you choose the right service for the job.
              </p>
              <div className="flex gap-5">
                <a
                href="/dumpster-rental"
                className="inline-flex justify-center items-center mt-2 px-6 py-3 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary-hover transition"
              >
                Book Online
              </a>
              <a
                href={METADATA.clickablePhone}
                className="inline-flex mt-2 px-6 py-3 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary-hover transition"
              >
                Call {METADATA.phone}
              </a>
              {/* <a
                href={`${METADATA.clickablePhone}`}
                className="inline-flex justify-center items-center mt-2 px-6 py-3 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary-hover transition"
              >Request a Quote</a> */}
              </div>
              
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}