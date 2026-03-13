import Link from "next/link";

export default function GetConnectedSection() {
  return (
    <section
      className="relative h-max flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/assets/contact/get-connected-2.jpg')` }}
    >
      {/* dark overlay behind content */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* content above overlay */}
      <div className="relative z-10 flex flex-col gap-5 items-center justify-center text-white text-center py-40">
        <h5 className="text-xl sm:text-3xl font-semibold">
          GET CONNECTED WITH US
        </h5>
        <Link
          href="/contact"
          className="bg-brand-primary hover:bg-brand-primary-hover p-3 px-10 font-semibold rounded-lg shadow-lg cursor-pointer"
        >
          LET&apos;S CHAT
        </Link>
      </div>
    </section>
  );
}
