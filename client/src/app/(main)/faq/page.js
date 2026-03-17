// "use client";

// app/faq/page.jsx
import Hero from "@/components/hero/hero.component";
import FaqQuestionForm from "@/components/faq/faq-question-form.component";
import AllowedDisallowedSection from "@/components/allowed-disallowed-section/allowed-disallowed-section.component"
import GetAQuoteTodaySection from "@/components/get-a-quote-today-section/get-a-quote-today-section.component";

import FAQ_ITEMS, {
  ALLOWED_ITEMS,
  NOT_ALLOWED_ITEMS,
  MATERIALS_DETAILS,
} from "@/data/faq";

const siteUrl = "https://iron-peak-services.com";

export const metadata = {
  title: "Dumpster Rental FAQ | Iron Peak Services",
  description:
    "Answers to common questions about dumpster rentals, junk removal, demolition, allowed materials, prohibited items, weight limits, and booking.",
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
  openGraph: {
    title: "Dumpster Rental FAQ | Iron Peak Services",
    description:
      "Learn more about dumpster sizes, rental periods, weight limits, junk removal, demolition, and what is allowed in our dumpsters.",
    url: `${siteUrl}/faq`,
    type: "website",
  },
};

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl space-y-3">
      {eyebrow && (
        <p className="text-sm tracking-[0.28em] uppercase text-brand-text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-graphite">{title}</h2>
      {description && (
        <p className="text-base md:text-lg text-brand-secondary/80">
          {description}
        </p>
      )}
    </div>
  );
}

function InfoCard({ title, description, tone = "light" }) {
  const styles =
    tone === "dark"
      ? "bg-graphite text-white border border-white/10"
      : "bg-white border border-gray-200 text-graphite";

  return (
    <div className={`rounded-2xl p-6 shadow-sm ${styles}`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p
        className={`mt-3 leading-relaxed ${
          tone === "dark" ? "text-white/80" : "text-brand-secondary/80"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <Hero>
        <div className="relative max-w-3xl mx-auto text-center space-y-5 px-4">
          <p className="text-sm tracking-[0.28em] text-gray-200 uppercase">
            ROLL OFF DUMPSTERS
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-gray-100">
            See answers to common questions about dumpster rentals, junk
            removal, demolition, accepted materials, and more.
          </p>
        </div>
      </Hero>

      {/* Intro + FAQ */}
      <section className="px-4 md:px-10 lg:px-16 py-14 bg-white">
        <div className="max-w-6xl mx-auto space-y-10">
          <SectionHeader
            eyebrow="WE HAVE ANSWERS"
            title="Read Our Frequently Asked Questions"
            description="From pricing and dumpster sizes to heavy materials and pickup timing, here are the questions we hear most often."
          />

          <div className="space-y-5">
            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5 md:p-6 shadow-sm"
              >
                <h3 className="text-lg md:text-xl font-semibold text-graphite">
                  {item.q}
                </h3>
                <p className="mt-3 text-sm md:text-base text-brand-secondary/80 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AllowedDisallowedSection/>

      {/* More Info */}
      <section className="px-4 md:px-10 lg:px-16 py-14 bg-white">
        <div className="max-w-6xl mx-auto space-y-10">
          <SectionHeader
            eyebrow="DETAILS"
            title="More Info"
            description="Here is a quick breakdown of acceptable, restricted, and prohibited materials."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-graphite">
                Acceptable Materials
              </h3>
              <ul className="mt-4 space-y-3 text-brand-secondary/80">
                {MATERIALS_DETAILS.acceptable.map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-brand-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-graphite">
                Restricted Materials
              </h3>
              <ul className="mt-4 space-y-3 text-brand-secondary/80">
                {MATERIALS_DETAILS.restricted.map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-harvest-orange shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-graphite">
                Prohibited Materials
              </h3>
              <ul className="mt-4 space-y-3 text-brand-secondary/80">
                {MATERIALS_DETAILS.prohibited.map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-red-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Ask a question */}
      <GetAQuoteTodaySection/>
    </div>
  );
}