"use client";

import { useEffect, useState } from "react";

import Hero from "@/components/hero/hero.component";
import AboutSection from "@/components/about-section/about-section.component";
import GetAQuoteTodaySection from "@/components/get-a-quote-today-section/get-a-quote-today-section.component";
import ServicesSection from "@/components/services-section-2/services-section.component";
// import ProjectSection from "@/components/project-section/project-section.component";
import Testimonials from "@/components/testimonials-section/testimonials-section.component";
import GallerySection from "@/components/gallery-slide-section/gallery-slide-section.component";
import LocalBusinessJsonLd from "@/components/seo/LocalBusinessJsonLd";

import METADATA from "@/data/data";
import DumpsterSection from "../components/dumpter-section/dumpter-section.component";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [typingStarted, setTypingStarted] = useState(false);

  const startTyping = () => {
    setTypingStarted(true);
  };
  const slogan = METADATA.slogan;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!typingStarted) return; // wait for video to start

    let timeout;
    let step = 0;
    const totalCycleTime = 25100;
    const waitTime = 18500;
    const deleteTime = 3000;
    const typeTime = totalCycleTime - waitTime - deleteTime;
    const charDelay = typeTime / slogan.length;

    const typeText = () => {
      if (step < slogan.length) {
        setDisplayedText(slogan.slice(0, step + 1));
        step++;
        timeout = setTimeout(typeText, charDelay);
      } else {
        timeout = setTimeout(deleteText, waitTime);
      }
    };

    const deleteText = () => {
      if (step > 0) {
        setDisplayedText(slogan.slice(0, step - 1));
        step--;
        const deleteCharDelay = deleteTime / slogan.length;
        timeout = setTimeout(deleteText, deleteCharDelay);
      } else {
        timeout = setTimeout(typeText, 6000);
      }
    };

    typeText();

    return () => clearTimeout(timeout);
  }, [typingStarted]);

  const videoSrc = isMobile ? "/assets/hero-mobile.mp4" : "/assets/hero.mp4";

  return (
    <div className="flex flex-col">
      <LocalBusinessJsonLd />
      <main>
        <Hero display="/assets/landing/hero.jpg">
          <div className="relative flex flex-col items-center text-center px-4 py-20 gap-6 max-w-4xl mx-auto">

            <span className="text-sm tracking-[0.28em] uppercase text-gray-200">
              Dumpster Rental • Junk Removal • Demolition
            </span>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white font-serif leading-tight">
              {slogan}
            </h1>

            <p className="max-w-2xl text-lg md:text-xl text-gray-200">
              Reliable dumpster rentals, fast junk removal, and safe demolition
              services across the Denver metro area. Simple scheduling, fair pricing,
              and service you can count on.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">

              {/* <a
                href={`${METADATA.clickablePhone}`}
                className="px-8 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary-hover transition"
              >
                Get a Quote
              </a> */}

              <a
                href={METADATA.clickablePhone}
                className="px-6 py-3 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary-hover transition"
              >
                Call {METADATA.phone}
              </a>

              <a
                href="/dumpster-rental"
                className="px-8 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
              >
                View Dumpster Sizes
              </a>

            </div>

          </div>
        </Hero>
        <AboutSection />
        <DumpsterSection />
        <ServicesSection />
        {/* <SpecialtySection /> */}
        {/* <Testimonials /> */}
        {/* <WhyChooseUsSection /> */}
        <GetAQuoteTodaySection />
      </main>
    </div>
  );
}
