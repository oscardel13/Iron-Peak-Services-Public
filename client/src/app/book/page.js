import Hero from "@/components/hero/hero.component";
import METADATA from "@/data/data";

export default function BookPage() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <Hero>
        <div className="relative max-w-3xl mx-auto text-center space-y-6 px-4">
          <p className="text-sm tracking-[0.28em] text-gray-200 uppercase">
            Online Booking
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Booking Coming Soon
          </h1>

          <p className="text-lg md:text-xl text-gray-100">
            We’re currently building our online booking system so you can
            schedule dumpster rentals quickly and easily.
          </p>
        </div>
      </Hero>

      {/* Content */}
      <section className="px-4 md:px-16 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">

          <h2 className="text-2xl md:text-3xl font-bold text-brand-text-primary">
            {`We're Working On It`}
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            {`Our online booking system will allow you to choose your dumpster
            size, select delivery dates, and schedule pickup all in one place.
            We're putting the finishing touches on it now.`}
          </p>

          <p className="text-gray-700 leading-relaxed">
            In the meantime, you can still schedule a dumpster rental, junk
            removal, or demolition service by contacting us directly.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">

            <a
              href={METADATA.clickablePhone}
              className="px-6 py-3 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary-hover transition"
            >
              Call {METADATA.phone}
            </a>

            {/* <a
              href="/contact"
              className="px-6 py-3 rounded-lg border border-brand-primary text-brand-primary font-semibold hover:bg-brand-primary hover:text-white transition"
            >
              Request a Quote
            </a> */}

          </div>

        </div>
      </section>

    </div>
  );
}