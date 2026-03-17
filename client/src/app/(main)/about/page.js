"use client";

import Hero from "@/components/hero/hero.component";
import GetAQuoteTodaySection from "@/components/get-a-quote-today-section/get-a-quote-today-section.component";
import Testimonials from "@/components/testimonials-section/testimonials-section.component";
import TeamSection from "./sections/team-section.component";
import HistorySection from "./sections/history-section.component";
import ValueSection from "./sections/value-section.component";
import MissionSection from "./sections/mission-section.component";
import LocalBusinessJsonLd from "@/components/seo/LocalBusinessJsonLd";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <LocalBusinessJsonLd />
      <Hero display={"/assets/about/mission.jpg"}>
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 text-center">
          <span className="text-sm uppercase tracking-[0.28em] text-gray-200">
            About Iron Peak Services
          </span>

          <h1 className="text-5xl font-bold text-white md:text-6xl lg:text-7xl">
            Reliable Dumpster Rental, Junk Removal & Demolition
          </h1>

          <p className="max-w-2xl text-lg text-gray-200 md:text-xl">
            We’re a local, family-run team serving the Denver metro with dependable
            dumpster rentals, fast junk removal, and clean demolition services.
          </p>

          {/* <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-6 py-3 font-semibold text-white transition hover:bg-brand-primary-hover"
            >
              Get a Quote
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Learn More
            </a>
          </div> */}
        </div>
      </Hero>
      <main className="">
        <MissionSection />
        <ValueSection />
        {/* <HistorySection /> */}
        {/* <TeamSection /> */}
        {/* <Testimonials /> */}
        <GetAQuoteTodaySection />
      </main>
    </div>
  );
}
