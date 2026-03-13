// app/services/[slug]/page.jsx
import Hero from "@/components/hero/hero.component";
import METADATA from "@/data/data";
import { notFound } from "next/navigation";

const siteUrl = "https://iron-peak-services.com";

function getServiceBySlug(slug) {
  return METADATA.services.find((svc) => svc.slug === slug);
}

export function generateStaticParams() {
  return METADATA.services
    .filter((svc) => !!svc.slug)
    .map((svc) => ({ slug: svc.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.metaTitle || `${service.title} | Iron Peak Services`,
    description:
      service.metaDescription ||
      service.longDescription ||
      "Dumpster rental, junk removal, and demolition services in the Denver metro area.",
    alternates: {
      canonical: `${siteUrl}/services/${service.slug}`,
    },
    openGraph: {
      title: service.metaTitle || service.title,
      description:
        service.metaDescription ||
        service.longDescription ||
        "Dumpster rental, junk removal, and demolition services in the Denver metro area.",
      url: `${siteUrl}/services/${service.slug}`,
      type: "article",
    },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) return notFound();

  return (
    <div className="flex flex-col">
      <Hero display={service.image ? service.image : null}>
        <div className="relative max-w-3xl mx-auto text-center space-y-4 px-4">
          <p className="text-sm tracking-[0.28em] text-gray-200 uppercase">
            Our Services
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {service.h1 || service.title}
          </h1>

          {service.heroTagline && (
            <p className="text-lg md:text-xl text-gray-100">
              {service.heroTagline}
            </p>
          )}
        </div>
      </Hero>

      <section className="px-4 md:px-16 py-12 bg-white">
        <div className="max-w-5xl mx-auto space-y-8">
          {service.intro && (
            <p className="text-lg text-gray-700">{service.intro}</p>
          )}

          {(service.paragraphs || []).map((paragraph, idx) => (
            <p key={idx} className="text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <div>
              <h2 className="text-xl font-semibold text-brand-text-primary mb-3">
                What You Can Expect
              </h2>

              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                {(service.highlights || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-3">
              <h3 className="text-lg font-semibold text-brand-text-primary">
                Request a Quote
              </h3>

              <p className="text-gray-700">
                Tell us about your project and we’ll follow up with a free,
                no-pressure quote.
              </p>

              <a
                href={METADATA.clickablePhone}
                className="px-6 py-3 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary-hover transition"
              >
                Call {METADATA.phone}
              </a>

              {/* <a
                href={`${METADATA.clickablePhone}`}
                className="inline-flex justify-center items-center mt-2 px-6 py-3 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary-hover transition"
              >
                Get a Quote
              </a> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}