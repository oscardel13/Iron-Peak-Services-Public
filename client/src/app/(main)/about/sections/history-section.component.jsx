import Image from "next/image";

export default function HistorySection() {
  return (
    <section className="w-screen py-32 bg-[#28282b] text-white">
      <div className="flex flex-row flex-wrap justify-between">
        {/* Left side image */}
        <div className="flex w-full xl:w-max p-3 lg:p-0 justify-center">
          <Image
            src="/assets/about/history.jpg"
            alt="Our History"
            width={700}
            height={600}
            className="object-cover shadow-lg"
          />
        </div>

        {/* Right side content */}
        <div className="max-w-xl mx-auto space-y-12 xl:pl-0 lg:px-10 px-5">
          {/* Our History Timeline */}
          <div className="pt-12">
            <div className="flex flex-row h-full items-center gap-3 pb-10">
              <div className="w-10 h-0.5 bg-brand-text-primary" />
              <h3 className="text-gray-100 font-bold">OUR HISTORY</h3>
            </div>

            {/* Highlighted Story */}
            <div className="space-y-4 pb-10">
              <h4 className="text-xl font-semibold">Rooted in Hard Work</h4>
              <p className="text-lg leading-relaxed text-gray-300">
                Our story began in 2014, working hands-on in the concrete trade
                across Colorado. From early mornings on job sites to learning
                every detail of prep, forming, and finishing — our approach has
                always been the same: put in honest work and treat people right.
                Over the years, that dedication turned into Iron Peak Services —
                a family-run company built on pride, craftsmanship, and
                community trust.
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-600" />

              {/* Years */}
              <div className="flex justify-between relative z-10">
                <span className="text-sm font-medium">2014</span>
                <span className="text-sm font-medium">2020</span>
                <span className="text-sm font-medium text-brand-primary">
                  Today
                </span>
              </div>

              {/* Markers */}
              <div className="flex justify-between mt-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <div className="w-3 h-3 rounded-full bg-brand-primary"></div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-6">What Sets Us Apart</h2>
            <p className="text-lg leading-relaxed mb-6">
              We’re not a big corporate crew — we’re local, family-run, and
              focused on doing right by the people we serve. We take the time to
              communicate, prep properly, finish cleanly, and leave your home or
              jobsite better than we found it.
            </p>
            <p className="text-lg leading-relaxed">
              Whether it’s a driveway, patio, walkway, or foundation, we handle
              every pour with care and respect. Quality work, friendly service,
              and results that hold up — that’s the Iron Peak Services way.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
