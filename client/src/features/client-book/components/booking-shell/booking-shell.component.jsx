"use client";

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
  mode = "page",
}) {
  const isModal = mode === "modal";

  return (
    <div
      className={
        isModal ? "bg-white pb-24 lg:pb-0" : "bg-[#f3f3f3] pb-24 md:pb-8"
      }
    >
      <div
        className={
          isModal
            ? "mx-auto w-full max-w-5xl px-0 py-0"
            : "mx-auto w-full max-w-5xl px-3 py-4 md:px-6 md:py-6"
        }
      >
        <div className="grid gap-4 md:gap-6 lg:grid-cols-[minmax(0,2fr)_360px]">
          <div className="min-w-0 space-y-3 overflow-x-auto md:space-y-4">
            <BookingStepNav
              steps={steps}
              currentStep={currentStep}
              goToStep={goToStep}
            />

            <div
              className={
                isModal
                  ? "rounded-2xl border border-gray-200 bg-white p-4 md:rounded-[28px] md:p-6"
                  : "rounded-2xl border border-gray-300 bg-white p-4 shadow-sm md:rounded-[28px] md:p-7"
              }
            >
              {children}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className={isModal ? "sticky top-4" : "sticky top-6"}>
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
