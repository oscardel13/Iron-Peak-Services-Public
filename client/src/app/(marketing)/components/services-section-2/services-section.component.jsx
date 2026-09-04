import Image from "next/image";
import Link from "next/link";

export default function ServiceHighlightsSection() {
  return (
    <section className="w-full bg-white py-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4">
        {/* Top Feature Card */}
        <div className="grid grid-cols-1 items-center gap-8 rounded-[2rem] border border-gray-300 bg-[#efefef] px-6 py-8 lg:grid-cols-2 lg:px-8 lg:py-6">
          <div className="flex flex-col gap-5">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-primary">
              WE SERVICE IT ALL
            </span>

            <h2 className="max-w-xl text-xl font-bold leading-tight text-graphite lg:text-3xl">
              Dumpster Rentals For All Your Needs
            </h2>

            <p className="max-w-2xl text-lg leading-relaxed text-brand-secondary">
              We provide dumpster rentals for home cleanouts, remodeling
              projects, construction debris, junk removal, and demolition
              cleanup. Whatever the job looks like, we have a solution that
              makes disposal simple.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <Image
              src="/assets/services/rental-card.png"
              alt="Iron Peak dumpster truck"
              width={700}
              height={450}
              className="h-auto w-full max-w-[650px] object-contain"
            />
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ServiceCard
            title="Junk Removal"
            description="Looking to remove junk from your property? Iron Peak Services has you covered."
            image="/assets/services/junk-removal.jpg"
            href="/services/junk-removal"
          />

          <ServiceCard
            title="Demolition"
            description="Need tear-out, structure removal, or demolition cleanup? We make the process simple and efficient."
            image="/assets/services/demolition.jpg"
            href="/services/demolition"
          />
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ title, description, image, href }) {
  return (
    <Link
      href={href}
      className="group relative block min-h-[420px] overflow-hidden rounded-[2rem]"
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 lg:p-8">
        <div className="max-w-xl text-white">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-3 text-md leading-relaxed text-white/90">
            {description}
          </p>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition group-hover:bg-brand-primary">
          <span className="text-4xl leading-none">→</span>
        </div>
      </div>
    </Link>
  );
}