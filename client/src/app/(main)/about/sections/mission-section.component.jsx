import Image from "next/image";
import METADATA from "@/data/data";

export default function MissionSection() {
  return (
    <section className="w-full py-24 bg-graphite">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16 px-6">

        {/* Text */}
        <div className="max-w-xl space-y-10 text-white">

          <div>
            <h2 className="text-3xl font-bold text-brand-primary mb-4">
              OUR MISSION
            </h2>
            <p className="text-base leading-relaxed text-alabaster-grey">
              {METADATA.mission}
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-brand-primary mb-4">
              OUR VISION
            </h2>
            <p className="text-base leading-relaxed text-alabaster-grey">
              {METADATA.vision}
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-brand-primary mb-4">
              OUR CULTURE
            </h2>
            <p className="text-base leading-relaxed text-alabaster-grey">
              {METADATA.culture}
            </p>
          </div>

        </div>

        {/* Image */}
        <div className="w-full max-w-lg">
          <Image
            src="/assets/about/mission.jpg"
            alt="Iron Peak Services team"
            width={600}
            height={600}
            className="rounded-2xl object-cover shadow-lg"
          />
        </div>

      </div>
    </section>
  );
}