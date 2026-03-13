import Hero from "@/components/hero/hero.component";
import DumpsterEstimateSection from "../../components/dumpster-estimate-section/dumpster-estimate-section.component";
import GetAQuoteTodaySection from "../../components/get-a-quote-today-section/get-a-quote-today-section.component";

export default function DumpsterWeightCalculator() {
  return (
    <div className="flex flex-col">
      <Hero display="/assets/rentals/hero2.jpg">
        <div className="flex flex-col items-center gap-10 max-w-3xl">
          <span className="text-sm tracking-[0.28em] text-gray-200 uppercase">
            ROLL OFF DUMPSTERS
          </span>
          <h1 className="text-7xl font-bold text-white">
            Dumpster Weight Calculator
          </h1>
          <span className="text-lg text-gray-300">
            Estimate how much trash you will need to dispose of and see our
            recommended dumpster size.
          </span>
          <button className="px-6 py-3 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary-hover transition max-w-md">
            Book Online
          </button>
        </div>
      </Hero>
      <DumpsterEstimateSection />
      <GetAQuoteTodaySection />
    </div>
  );
}
