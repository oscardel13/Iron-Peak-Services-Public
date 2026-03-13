// app/dumpster-rental/[slug]/page.jsx
import Hero from "@/components/hero/hero.component";
import GetAQuoteTodaySection from "@/components/get-a-quote-today-section/get-a-quote-today-section.component";
import AllowedDisallowedSection from "@/components/allowed-disallowed-section/allowed-disallowed-section.component"

import METADATA from "@/data/data";
import { notFound } from "next/navigation";

const siteUrl = "https://iron-peak-services.com";

function getRentalBySlug(slug) {
  return METADATA.rentals.find((rental) => rental.slug === slug);
}

export function generateStaticParams() {
  return METADATA.rentals
    .filter((rental) => !!rental.slug)
    .map((rental) => ({ slug: rental.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const rental = getRentalBySlug(slug);

  if (!rental) return {};

  return {
    title: rental.metaTitle || `${rental.title} | Iron Peak Services`,
    description:
      rental.metaDescription ||
      rental.longDescription ||
      "Dumpster rental in the Denver metro area.",
    alternates: {
      canonical: `${siteUrl}/dumpster-rental/${rental.slug}`,
    },
    openGraph: {
      title: rental.metaTitle || rental.title,
      description:
        rental.metaDescription ||
        rental.longDescription ||
        "Dumpster rental in the Denver metro area.",
      url: `${siteUrl}/dumpster-rental/${rental.slug}`,
      type: "article",
    },
  };
}

export default async function RentalPage({ params }) {
  const { slug } = await params;
  const rental = getRentalBySlug(slug);

  if (!rental) return notFound();

  return (
    <div className="flex flex-col">
      <Hero display={rental.image ? rental.image : null}>
        <div className="relative mx-auto max-w-3xl px-4 text-center space-y-4">
          <p className="text-sm tracking-[0.28em] text-gray-200 uppercase">
            Roll Off Dumpster Rental
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {rental.h1 || rental.title}
          </h1>

          <p className="text-lg md:text-xl text-gray-100">
            {rental.heroTagline || rental.shortDescription}
          </p>
        </div>
      </Hero>

      <section className="bg-white px-4 py-12 md:px-16">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.35fr_.95fr]">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-brand-text-primary">
              {rental.title}
            </h2>

            <p className="text-lg leading-relaxed text-gray-700">
              {rental.longDescription}
            </p>

            <p className="leading-relaxed text-gray-700">
              This dumpster is a great choice for homeowners, contractors, and
              property managers who need dependable cleanup capacity without
              overcomplicating the process. We keep scheduling simple and help
              you choose the right size for your project.
            </p>

            {rental.fits?.length ? (
              <div>
                <h3 className="mb-4 text-2xl font-semibold text-brand-text-primary">
                  What Fits in a {rental.title}?
                </h3>

                <ul className="space-y-3 text-gray-700">
                  {rental.fits.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm space-y-5">
            <h3 className="text-2xl font-semibold text-brand-text-primary">
              Rental Details
            </h3>

            <div className="space-y-4 text-gray-700">
              <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-3">
                <span className="font-medium">Dimensions</span>
                <span>{rental.dimensions || "Call for details"}</span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-3">
                <span className="font-medium">Rental Period</span>
                <span>{rental.rentalPeriod || "Call for details"}</span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-3">
                <span className="font-medium">Included Weight</span>
                <span>{rental.includedWeight || "Call for details"}</span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-3">
                <span className="font-medium">Extra Days</span>
                <span>{rental.extraDayCost || "Call for details"}</span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-3">
                <span className="font-medium">Extra Weight</span>
                <span>{rental.extraWeightCost || "Call for details"}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">Starting At</span>
                <span className="font-semibold text-brand-primary">
                  {rental.startingPrice || "Call for pricing"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-sm leading-relaxed text-gray-700">
                Need help choosing the right size? Give us a call and we’ll help
                you figure out which dumpster best fits your cleanup, remodel,
                or job site.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="/book"
                className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-6 py-3 font-semibold text-white transition hover:bg-brand-primary-hover"
              >
                Book Online
              </a>

              <a
                href={METADATA.clickablePhone}
                className="inline-flex items-center justify-center rounded-lg border border-brand-primary px-6 py-3 font-semibold text-brand-primary transition hover:bg-brand-primary hover:text-white"
              >
                Call {METADATA.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-14 md:px-16">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-xl font-semibold text-brand-text-primary">
              What You Can Expect
            </h3>

            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-brand-primary shrink-0" />
                <span>Reliable delivery and pickup scheduling</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-brand-primary shrink-0" />
                <span>Driveway-friendly placement when possible</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-brand-primary shrink-0" />
                <span>Clear communication and simple pricing</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-brand-primary shrink-0" />
                <span>Help choosing the right dumpster for the job</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
            <h3 className="mb-3 text-xl font-semibold text-brand-text-primary">
              Good Fit For
            </h3>

            <p className="leading-relaxed text-gray-700">
              {rental.goodFor ||
                "This dumpster works well for cleanouts, remodeling debris, construction waste, yard waste, and general junk removal. If you are unsure whether it is the right fit, reach out and we’ll help you decide."}
            </p>
          </div>
        </div>
      </section>

      <AllowedDisallowedSection/>

      <GetAQuoteTodaySection />
    </div>
  );
}