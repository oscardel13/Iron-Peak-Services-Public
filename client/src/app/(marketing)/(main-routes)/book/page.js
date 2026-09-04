import BookingFlow from "../../../../features/client-book/components/booking-flow/booking-flow.component";
import Hero from "../../components/hero/hero.component";

export default function BookPage() {
  return (
    <main className="bg-[#f3f3f3]">
      <Hero>
        <div className="relative mx-auto max-w-3xl space-y-3 px-4 text-center md:space-y-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-gray-200 md:text-sm md:tracking-[0.28em]">
            Online Booking
          </p>

          <h1 className="text-3xl font-bold text-white md:text-5xl">
            Book a Dumpster in Minutes!
          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-6 text-gray-200 md:text-base">
            Choose your dumpster, schedule delivery and pickup, verify
            placement, and checkout online.
          </p>
        </div>
      </Hero>

      <BookingFlow mode="page" source="marketing" />
    </main>
  );
}
