"use client";

import Link from "next/link";

export default function GetAQuoteTodaySection() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-3xl bg-alabaster-grey/90 border border-black/10 px-6 py-10 lg:px-10 lg:py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-sm tracking-[0.28em] uppercase text-black/70">
                Get a Quote Today
              </span>
              <h3 className="mt-3 text-4xl font-bold text-black">
                Need a dumpster fast?
              </h3>
              <p className="mt-3 text-lg text-black/80">
                Tell us your address and your project type—we’ll recommend a
                size and get you scheduled. No pressure, no confusing pricing.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-6 py-3 font-semibold text-black hover:bg-brand-primary-hover transition"
                >
                  Book Online
                </Link>
                {/* <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-graphite hover:bg-alabaster-grey transition"
                >
                  Request a Quote
                </Link> */}
                <Link
                  href="tel:7205152245"
                  className="inline-flex items-center justify-center rounded-xl border border-black/20 px-6 py-3 font-semibold text-black hover:bg-black/10 transition"
                >
                  Call 720.515.2245
                </Link>
              </div>
            </div>

            {/* Right: mini trust box */}
            <div className="w-full lg:w-[360px] rounded-2xl bg-black/5 border border-black/10 p-6">
              <p className="text-black font-semibold text-lg">What you get</p>
              <ul className="mt-4 space-y-3 text-black/80">
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-primary" />
                  Fast delivery + easy pickup scheduling
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-primary" />
                  Driveway-safe options + add-ons
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-primary" />
                  Friendly support if you’re unsure on size
                </li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/service-areas"
                  className="text-black/80 hover:text-black underline underline-offset-4"
                >
                  See service areas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
