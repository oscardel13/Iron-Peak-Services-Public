"use client";

import DumpsterCard from "../dumpster-size-card/dumpster-size-card.component";

import METADATA from "@/data/data";

export default function DumpsterSection() {
  return (
    <section className="w-full flex justify-center py-16 lg:py-30 bg-white">
  <div className="w-full max-w-5xl flex flex-col gap-12 px-4">

    <span className="text-yellow-700">SIZES</span>

    <h3 className="text-2xl font-bold text-brand-text-primary">
      Our Dumpsters
    </h3>

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

      <p className="max-w-md text-gray-500">
        We provide an array of dumpster sizes, so you can rent the size
        you need for your project or work site. Take a look at the options
        and estimate the size you might need.
      </p>

      <button className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary-hover transition">
        See All Dumpsters →
      </button>

    </div>

   <div className="flex w-full flex-col sm:grid sm:grid-cols-2  lg:grid-cols-3 overflow-x-auto lg:overflow-visible gap-4 snap-x snap-mandatory lg:snap-none">
  {METADATA.rentals.map((rental, index) => (
      <DumpsterCard
        key={index}
        size={rental.name}
        description={rental.longDescription}
        path={`/dumpster-rental/${rental.slug}`}
        buttonText={`${rental.size} Dumpster`}
        image={rental.image}
      />
  ))}
</div>

  </div>
</section>
  );
}
