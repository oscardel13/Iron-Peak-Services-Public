"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

/**
 * Drop these two sections under your Hero.
 * - "Estimate" section: interactive quick estimator (client-side only)
 * - "Get a Quote Today" section: CTA band
 *
 * Uses your theme tokens:
 * bg-graphite / bg-charcoal etc assume you have Tailwind wired to your CSS vars.
 * If not, swap classes to bg-[#292929] etc.
 */

const MATERIALS = [
  { key: "household", label: "Household Junk", lbsPerYd: 250 },
  { key: "yard", label: "Yard Waste", lbsPerYd: 350 },
  { key: "construction", label: "Construction Debris", lbsPerYd: 500 },
  { key: "roofing", label: "Roofing Shingles", lbsPerYd: 750 },
  { key: "concrete", label: "Concrete / Dirt / Brick", lbsPerYd: 2200 },
];

const SIZES = [7, 10, 15, 20, 25, 30, 40];

function getRecommendedSize(yards) {
  // Recommend the smallest size that fits (simple heuristic)
  return SIZES.find((s) => yards <= s) ?? 40;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function DumpsterEstimateSection() {
  const [material, setMaterial] = useState(MATERIALS[0].key);
  const [yards, setYards] = useState(10);

  const selectedMaterial = useMemo(
    () => MATERIALS.find((m) => m.key === material) ?? MATERIALS[0],
    [material],
  );

  const estimate = useMemo(() => {
    const estLbs = Math.round(yards * selectedMaterial.lbsPerYd);
    const estTons = Number((estLbs / 2000).toFixed(2));
    const recommended = getRecommendedSize(yards);
    return { estLbs, estTons, recommended };
  }, [yards, selectedMaterial]);

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <span className="text-sm tracking-[0.28em] uppercase text-brand-secondary/70">
            ESTIMATE
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-graphite">
            Estimate Your Dumpster Weight
          </h2>
          <p className="max-w-2xl text-lg text-brand-secondary/80">
            Get a quick estimate of your load weight and a recommended dumpster
            size. Actual weights can vary—this is meant as a planning tool.
          </p>
        </div>

        {/* Card */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: inputs */}
          <div className="rounded-2xl border border-alabaster-grey bg-white p-6 lg:p-8 shadow-sm">
            <div className="flex flex-col gap-6">
              {/* Material */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-graphite">
                  What are you throwing away?
                </label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full rounded-xl border border-alabaster-grey bg-white px-4 py-3 text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  {MATERIALS.map((m) => (
                    <option key={m.key} value={m.key}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-brand-secondary/70">
                  Typical weight:{" "}
                  <span className="font-semibold text-graphite">
                    {selectedMaterial.lbsPerYd} lbs / cubic yard
                  </span>
                </p>
              </div>

              {/* Yards */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-graphite">
                  Estimated volume (cubic yards)
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setYards((v) => clamp(v - 1, 1, 40))}
                    className="rounded-xl border border-alabaster-grey px-4 py-3 font-semibold text-graphite hover:bg-alabaster-grey/40"
                    aria-label="Decrease yards"
                  >
                    −
                  </button>

                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={yards}
                    onChange={(e) =>
                      setYards(clamp(Number(e.target.value || 0), 1, 40))
                    }
                    className="w-full rounded-xl border border-alabaster-grey bg-white px-4 py-3 text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />

                  <button
                    type="button"
                    onClick={() => setYards((v) => clamp(v + 1, 1, 40))}
                    className="rounded-xl border border-alabaster-grey px-4 py-3 font-semibold text-graphite hover:bg-alabaster-grey/40"
                    aria-label="Increase yards"
                  >
                    +
                  </button>
                </div>

                <input
                  type="range"
                  min={1}
                  max={40}
                  value={yards}
                  onChange={(e) => setYards(Number(e.target.value))}
                  className="w-full accent-[color:var(--color-brand-primary)]"
                />

                <p className="text-sm text-brand-secondary/70">
                  Tip: If you’re unsure, round up a little to avoid overflow.
                </p>
              </div>

              {/* CTA row */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white hover:bg-brand-primary-hover transition"
                >
                  Book Online
                </Link>
                {/* <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-brand-primary px-6 py-3 font-semibold text-brand-primary hover:bg-alabaster-grey/40 transition"
                >
                  Get a Quote
                </Link> */}
              </div>
            </div>
          </div>

          {/* Right: results */}
          <div className="rounded-2xl bg-graphite p-6 lg:p-8 text-white shadow-sm">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-sm tracking-[0.28em] uppercase text-white/70">
                  Your Estimate
                </span>
                <h3 className="text-3xl font-bold">
                  Recommended: {estimate.recommended} Yard Dumpster
                </h3>
                <p className="text-white/80">
                  Based on{" "}
                  <span className="font-semibold text-white">{yards} yd³</span>{" "}
                  of{" "}
                  <span className="font-semibold text-white">
                    {selectedMaterial.label}
                  </span>
                  .
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-charcoal/40 p-5 border border-white/10">
                  <p className="text-white/70 text-sm">Estimated Weight</p>
                  <p className="text-3xl font-bold">{estimate.estLbs} lbs</p>
                </div>
                <div className="rounded-2xl bg-charcoal/40 p-5 border border-white/10">
                  <p className="text-white/70 text-sm">Estimated Tons</p>
                  <p className="text-3xl font-bold">{estimate.estTons} tons</p>
                </div>
              </div>

              <div className="rounded-2xl bg-charcoal/25 p-5 border border-white/10">
                <p className="font-semibold">Heads up</p>
                <ul className="mt-3 space-y-2 text-white/80 list-disc list-inside">
                  <li>
                    Heavy materials (concrete/dirt/brick) can exceed weight
                    limits quickly.
                  </li>
                  <li>
                    Don’t stack above the rim—overfilled dumpsters may require
                    unloading.
                  </li>
                  <li>
                    If you’re on the edge, choose the next size up to be safe.
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/dumpster-rental`}
                  className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white hover:bg-brand-primary-hover transition"
                >
                  View Dumpster Sizes
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
                >
                  Talk to a Human
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-sm text-brand-secondary/70">
          Disclaimer: This calculator provides an estimate only. Final weight
          depends on material type, moisture, density, and how the dumpster is
          loaded.
        </p>
      </div>
    </section>
  );
}
