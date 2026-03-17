import Hero from "@/components/hero/hero.component";
import METADATA from "@/data/data";

export const metadata = {
  title: "Terms of Service | Iron Peak Services",
  description:
    "Review the Terms of Service for Iron Peak Services regarding use of our website and our dumpster rental, junk removal, and demolition services.",
};

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col">
      <Hero>
        <div className="relative max-w-3xl mx-auto text-center space-y-4 px-4">
          <p className="text-sm tracking-[0.28em] text-gray-200 uppercase">
            Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Terms of Service
          </h1>
          <p className="text-lg md:text-xl text-gray-100">
            The basic rules for using our website and working with Iron Peak
            Services.
          </p>
        </div>
      </Hero>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-10 bg-white text-gray-800">
        <p className="text-gray-700">
          Last updated: {new Date().getFullYear()}
        </p>

        <p>
          By accessing or using the Iron Peak Services website, you agree to the
          following Terms of Service. If you do not agree, please discontinue
          use of the site.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-brand-text-primary">
            1. Services Provided
          </h2>
          <p>
            Iron Peak Services provides dumpster rental, junk removal, and
            demolition services for residential and commercial customers. All
            services are subject to written agreements, estimates, rental terms,
            and service availability.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-brand-text-primary">
            2. Estimates, Quotes, & Pricing
          </h2>
          <p>
            All quotes and estimates are based on the information available at
            the time they are provided. Final pricing may vary depending on job
            scope, debris type, material weight, prohibited items, overage
            charges, rental period extensions, travel distance, or changes
            requested by the customer.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-brand-text-primary">
            3. Dumpster Rental Terms
          </h2>
          <p>
            Customers are responsible for loading dumpsters safely and not
            exceeding the fill line or applicable weight limits. Certain items,
            including hazardous materials, liquids, batteries, tires,
            electronics, and other prohibited materials, may not be placed in a
            dumpster. Additional charges may apply for overfilled containers,
            overweight loads, prohibited items, or extended rental periods.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-brand-text-primary">
            4. Junk Removal & Demolition Terms
          </h2>
          <p>
            Junk removal and demolition services are performed based on the
            agreed scope of work. Customers are responsible for disclosing site
            conditions, access limitations, utilities, hazardous materials, and
            any other factors that may affect the job. Additional costs may
            apply if the scope changes or unforeseen conditions are discovered.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-brand-text-primary">
            5. Website Use
          </h2>
          <p>When using our website, you agree not to:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Use the site for unlawful purposes</li>
            <li>Submit false or misleading information</li>
            <li>Attempt to interfere with website functionality or security</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-brand-text-primary">
            6. Intellectual Property
          </h2>
          <p>
            All content, images, logos, graphics, and materials on this website
            are owned by Iron Peak Services and may not be reproduced,
            distributed, or used without permission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-brand-text-primary">
            7. Liability
          </h2>
          <p>
            We strive to provide accurate information, but we do not guarantee
            that the website will always be error-free or uninterrupted. Iron
            Peak Services is not liable for damages resulting from website use,
            customer misuse of rented equipment, improper loading, unsafe site
            conditions, or delays caused by circumstances outside our control.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-brand-text-primary">
            8. Service Agreements
          </h2>
          <p>
            Any dumpster rental, junk removal, or demolition service provided by
            Iron Peak Services may require a signed agreement, confirmation, or
            acceptance of specific rental or service terms. Terms in project or
            service agreements supersede this document when applicable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-brand-text-primary">
            9. Changes to Terms
          </h2>
          <p>
            We may update these Terms of Service at any time. Continued use of
            the website means you accept any modifications.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-brand-text-primary">
            10. Contact Us
          </h2>
          <p>For questions regarding these terms, contact us:</p>
          <div className="mt-3 space-y-1">
            <p>📍 {METADATA.address}</p>
            <p>📞 {METADATA.phone}</p>
            <p>✉️ {METADATA.email}</p>
          </div>
        </section>
      </main>
    </div>
  );
}