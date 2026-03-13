"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import DumpsterCard from "@/components/dumpster-size-card/dumpster-size-card.component"; // adjust path
import GetAQuoteTodaySection from "@/components/get-a-quote-today-section/get-a-quote-today-section.component";
import Hero from "@/components/hero/hero.component";

import METADATA from "@/data/data"; // adjust path
import Image from "next/image";

/**
 * Rentals page layout:
 * - Desktop: 2-column layout
 *   - Left column: sticky cards (Rent + Contact)
 *   - Right column: scrollable grid (2 per row)
 * - Mobile: hide left column, show only the grid
 * - End: reuse GetAQuoteTodaySection
 *
 * Notes:
 * - Sticky works when the left column isn't inside an overflow-hidden parent.
 * - Use `sticky top-24` so it clears your navbar height.
 */

function RentStickyCard() {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-graphite text-white p-6 border border-white/10 shadow-sm text-center">
      {/* <p className="text-sm tracking-[0.28em] uppercase text-white/70">
        Rent Your Dumpster Today
      </p> */}
      <Image
        src="/assets/logo.svg"
        alt="Logo"
        width={150}
        height={150}
        priority
        className={`scale-125`}
      />
      <h3 className="mt-3 text-xl font-bold">Rent Your Dumpster Today!</h3>
      <p className="mt-3 text-white/80">
        We provide same day deliveries at affordable prices – get your rental
        when you need it!
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <Link
          href="/book"
          className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white hover:bg-brand-primary-hover transition"
        >
          Book Online
        </Link>
        <Link
          href="/dumpster-weight-calculator"
          className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
        >
          Use Weight Calculator
        </Link>
      </div>
      {/* 
      <div className="mt-6 rounded-xl bg-white/5 border border-white/10 p-4">
        <p className="font-semibold">Need help choosing?</p>
        <p className="mt-1 text-white/80 text-sm">
          Tell us what you’re tossing and we’ll point you to the right size.
        </p>
      </div> */}
    </div>
  );
}

function ContactStickyCard() {
  return (
    <div className="rounded-2xl bg-white p-6 border border-alabaster-grey shadow-sm">
      <p className="text-sm tracking-[0.28em] uppercase text-brand-secondary/70">
        Contact
      </p>
      <h3 className="mt-3 text-2xl font-bold text-graphite">
        Get a quick quote
      </h3>
      <p className="mt-2 text-brand-secondary/80">
        Call or message us—friendly support, no pressure.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        <Link
          href={METADATA.clickablePhone}
          className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white hover:bg-brand-primary-hover transition"
        >
          Call {METADATA.phone}
        </Link>

        {/* <Link
          href={METADATA.clickableEmail}
          className="inline-flex items-center justify-center rounded-xl border border-brand-primary px-6 py-3 font-semibold text-brand-primary hover:bg-alabaster-grey/40 transition"
        >
          Email Us
        </Link>

        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-xl bg-graphite px-6 py-3 font-semibold text-white hover:bg-charcoal transition"
        >
          Request a Quote
        </Link> */}
      </div>

      {/* <div className="mt-6 text-sm text-brand-secondary/70">
        <p className="font-semibold text-graphite">Service hours</p>
        <p>Mon–Sat • 7am–6pm</p>
      </div> */}
    </div>
  );
}

export default function OurRentalsPage() {
  const rentals = useMemo(() => METADATA.rentals ?? [], []);

  return (
    <div className="flex flex-col bg-white">
      {/* Header / intro */}
      <Hero display="/assets/rentals/hero1.jpg">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:py-16">
          <span className="text-sm tracking-[0.28em] uppercase text-white/70">
            OUR RENTALS
          </span>
          <h1 className="mt-4 text-5xl lg:text-6xl font-bold text-white">
            Choose Your Dumpster Size
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-white/80">
            Browse our dumpster sizes below. Pick what fits your project and
            we’ll get you scheduled for delivery.
          </p>

          <div className="mt-8 flex flex-col justify-center items-center sm:flex-row gap-3">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white hover:bg-brand-primary-hover transition"
            >
              Book Online
            </Link>
            <Link
              href={METADATA.clickablePhone}
              className="px-6 py-3 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary-hover transition"
            >
              Call {METADATA.phone}
            </Link>
            {/* <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
            >
              Get a Quote
            </Link> */}
          </div>
        </div>
      </Hero>

      {/* Main split layout */}
      <section className="w-full">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left sticky column (hidden on mobile) */}
            <aside className="hidden lg:block lg:col-span-4">
              <div className="sticky top-24 flex flex-col gap-6">
                <RentStickyCard />
                <ContactStickyCard />
              </div>
            </aside>

            {/* Right: cards */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {rentals.map((rental, index) => (
                  <div key={rental.slug ?? index} className="w-full">
                    <DumpsterCard
                      size={rental.name}
                      description={rental.longDescription}
                      path={`/dumpster-rental/${rental.slug}`}
                      buttonText={`${rental.title}`}
                      image={rental.image}
                    />
                  </div>
                ))}
              </div>

              {/* Optional: bottom note */}
              <div className="mt-10 rounded-2xl border border-alabaster-grey bg-white p-6">
                <h3 className="text-xl font-bold text-graphite">
                  Not sure which size to pick?
                </h3>
                <p className="mt-2 text-brand-secondary/80">
                  Use our weight calculator or reach out—we’ll recommend the
                  right dumpster for your job.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/dumpster-weight-calculator"
                    className="inline-flex items-center justify-center rounded-xl bg-graphite px-6 py-3 font-semibold text-white hover:bg-charcoal transition"
                  >
                    Weight Calculator
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl border border-brand-primary px-6 py-3 font-semibold text-brand-primary hover:bg-alabaster-grey/40 transition"
                  >
                    Talk to a Human
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* End CTA */}
      <GetAQuoteTodaySection />
    </div>
  );
}
