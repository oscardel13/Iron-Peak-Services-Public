"use client";

import { useState } from "react";
import Link from "next/link";

import NorthEastIcon from "@mui/icons-material/NorthEast";
import METADATA from "@/data/data";

export default function ServicesSection() {
  const [hovered, setHovered] = useState(null);
  const services = METADATA.services;

  return (
    <section className="relative flex w-full min-h-[80vh] text-white">
      {/* Section background for large screens with fade transition */}
      <div className="hidden lg:block absolute inset-0">
        {services.map((step, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-center bg-cover transition-opacity duration-700 ease-in-out ${
              hovered === index || (hovered === null && index === 0)
                ? "opacity-100"
                : "opacity-0"
            }`}
            style={{ backgroundImage: `url("${step.image}")` }}
          />
        ))}
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Steps */}
      <div className="relative z-10 flex flex-1 flex-col lg:flex-row">
        {services.map((step, index) => (
          <Link
            key={index}
            href={{
              pathname: "/services",
              query: { index: index },
            }}
            className="flex-1 flex items-center justify-center relative cursor-pointer border-r border-white/20 last:border-none h-72 lg:h-auto"
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Small screen background for each step */}
            <div
              className="absolute inset-0 lg:hidden bg-center bg-cover"
              style={{ backgroundImage: `url("${step.image}")` }}
            />

            {/* Overlay on small screens */}
            <div className="absolute inset-0 bg-black/50 lg:hidden" />

            {/* Content */}
            <div className="relative z-10 flex flex-row lg:flex-col items-center justify-center text-center px-4 w-full h-full">
              <div className="w-1/6 lg:h-1/6"></div>
              <div className="w-4/6 lg:h-4/6 flex flex-col w-full h-full justify-center items-center">
                <h3 className="text-2xl font-bold">{step.title}</h3>

                {/* Show description only if hovered */}
                {hovered === index && (
                  <div>
                    <p className="mt-4 text-sm max-w-xs mx-auto opacity-90">
                      {step.shortDescription}
                    </p>
                  </div>
                )}
              </div>
              <div className="w-1/6 lg:h-1/6">
                {hovered === index && (
                  <span className="flex h-14 w-14 items-center justify-center text-white bg-brand-primary rounded-full shadow-lg hover:rotate-45 transition-transform duration-300 hover:bg-brand-secondary">
                    <NorthEastIcon className="scale-120 " />
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
