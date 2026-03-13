"use client";

import Image from "next/image";
import Link from "next/link";
import METADATA from "@/data/data";

export default function AboutSection() {
  const title = "WHY " + METADATA.shortTitle.toUpperCase();
  const since = "DOING RIGHT BY OUR NEIGHBORS SINCE 2014";

  return (
    <section className="flex flex-row flex-wrap-reverse justify-between gap-10 py-16 lg:py-30">
      <div className="max-w-xl mx-auto space-y-12 px-5 pl-10 xl:pl-20">
        <div className="flex flex-row h-full items-center gap-3 py-1 h-max">
          <div className="w-8 h-0.5 bg-brand-primary" />
          <h3 className="text-gray-700 font-bold">{title}</h3>
        </div>

        <div className="flex flex-col gap-5">
          <h4 className="text-3xl text-brand-text-primary font-semibold">
            {since}
          </h4>

          <span className="text-lg text-gray-700 font-semibold">
            {METADATA.aboutSection.subheading}
          </span>

          <p className="text-gray-600">{METADATA.aboutSection.p1}</p>

          <p className="text-gray-600">{METADATA.aboutSection.p2}</p>

          <Link
            href="/about"
            className="flex justify-center w-52 items-center py-4 bg-brand-primary hover:bg-brand-primary-hover rounded-lg shadow-lg font-semibold text-white"
          >
            ABOUT US
          </Link>
        </div>
      </div>

      <div className="flex w-full xl:w-max justify-center">
        <Image
          src="/assets/about/mission.jpg"
          alt="About Iron Peak Services"
          width={600}
          height={600}
          className="object-cover px-5 md:px-0"
        />
      </div>
    </section>
  );
}
