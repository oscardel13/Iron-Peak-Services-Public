"use client";

import Hero from "@/components/hero/hero.component"
import BookingStepNav from "../booking-step-nav/booking-step-nav.component";

export default function BookingLayout({
  steps,
  currentStep,
  activeStep,
  goToStep,
  children,
}) {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
        <Hero>
        <div className="relative max-w-3xl mx-auto text-center space-y-6 px-4">
          <p className="text-sm tracking-[0.28em] text-gray-200 uppercase">
            Online Booking
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Booking Coming Soon
          </h1>
        </div>
      </Hero>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-10">

        <BookingStepNav
          steps={steps}
          currentStep={currentStep}
          goToStep={goToStep}
        />

        <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <div className="mb-6 border-b border-gray-200 pb-4">
            <p className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-gray-900">
              {activeStep?.title}
            </h2>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}