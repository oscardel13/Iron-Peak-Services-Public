"use client";

export default function BookingBottomBar({
  currentStep,
  onBack,
  onOpenSummary,
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={currentStep === 1}
          className="rounded-2xl border border-indigo-400 px-4 py-3 text-base font-semibold text-indigo-600 disabled:opacity-40"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onOpenSummary}
          className="rounded-2xl bg-indigo-100 px-4 py-3 text-base font-semibold text-indigo-600"
        >
          Summary
        </button>
      </div>
    </div>
  );
}