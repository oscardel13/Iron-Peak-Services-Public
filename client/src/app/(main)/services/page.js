"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import Hero from "@/components/hero/hero.component";
import GetAQuoteTodaySection from "@/components/get-a-quote-today-section/get-a-quote-today-section.component";
import METADATA from "@/data/data";

function ServicesContent() {
  const searchParams = useSearchParams();
  const index = Number(searchParams.get("index"));
  const [activeIndex, setActiveIndex] = useState(index ? index : 0);

  const services = METADATA.services;

  return (
    <>
      <Hero>
        <h1 className="relative text-5xl md:text-6xl font-bold text-white">
          Services
        </h1>
      </Hero>

      <section className="w-full pt-10 ">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Tabs */}
          <div className="flex flex-wrap gap-6 justify-center lg:justify-between border-b pb-4">
            {services.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`pb-2 text-sm md:text-base font-semibold hover:cursor-pointer ${
                  activeIndex === idx
                    ? "text-gray-900 border-b-2 border-brand-primary"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {step.title}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mt-10">
            {/* Text */}
            <div className="order-2 lg:order-1">
              <h3 className="text-3xl font-bold text-brand-text-primary mb-4">
                {services[activeIndex].title}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                {services[activeIndex].longDescription}
              </p>
              <Link
                href={`/services/${services[activeIndex].slug}`}
                className="bg-brand-primary hover:bg-[#fa9f31] text-white px-6 py-3 rounded-md font-semibold"
              >
                Learn More
              </Link>
            </div>

            {/* Image */}
            <div className="relative hidden lg:block w-full h-80 rounded-lg overflow-hidden shadow-md order-1 lg:order-2">
              <Image
                src={services[activeIndex].image}
                alt={services[activeIndex].title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<div className="p-10">Loading services...</div>}>
        <ServicesContent />
      </Suspense>
      <GetAQuoteTodaySection />
    </div>
  );
}
