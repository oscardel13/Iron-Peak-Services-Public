"use client";

import Hero from "@/components/hero/hero.component";
import BookingStepNav from "../booking-step-nav/booking-step-nav.component";
import BookingSummaryCard from "../booking-summary-card/booking-summary-card.component";
import BookingBottomBar from "../booking-bottom-bar/booking-bottom-bar.component";
import BookingMobileSummarySheet from "../booking-mobile-summary-sheet/booking-mobile-summary-sheet.component";

export default function BookingShell({
  steps,
  currentStep,
  goToStep,
  bookingForm,
  mobileSummaryOpen,
  setMobileSummaryOpen,
  goToPreviousStep,
  children,
}) {
  return (
    <div className="min-h-screen bg-[#f3f3f3] pb-24 md:pb-8">
      <Hero>
        <div className="relative mx-auto max-w-3xl px-4 text-center space-y-3 md:space-y-6">
          <p className="text-[11px] tracking-[0.22em] text-gray-200 uppercase md:text-sm md:tracking-[0.28em]">
            Online Booking
          </p>

          <h1 className="text-3xl font-bold text-white md:text-5xl">
            Booking Coming Soon
          </h1>
        </div>
      </Hero>

      <div className="mx-auto w-full max-w-5xl px-3 py-4 md:px-6 md:py-6">
        <div className="grid gap-4 md:gap-6 lg:grid-cols-[minmax(0,2fr)_360px]">
          <div className="space-y-3 md:space-y-4 overflow-x-auto">
            <BookingStepNav
              steps={steps}
              currentStep={currentStep}
              goToStep={goToStep}
            />

            <div className="rounded-2xl border border-gray-300 bg-white p-4 shadow-sm md:rounded-[28px] md:p-7">
              {children}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-6">
              <BookingSummaryCard bookingForm={bookingForm} />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <BookingBottomBar
          currentStep={currentStep}
          onBack={goToPreviousStep}
          onOpenSummary={() => setMobileSummaryOpen(true)}
        />

        <BookingMobileSummarySheet
          open={mobileSummaryOpen}
          onClose={() => setMobileSummaryOpen(false)}
          bookingForm={bookingForm}
        />
      </div>
    </div>
  );
}