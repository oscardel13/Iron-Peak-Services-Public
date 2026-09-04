"use client";

export default function BookingStepShell({
  title,
  description,
  children,
  onNext,
  onBack,
  nextLabel = "Next Step",
  backLabel = "Back",
  hideBack = false,
  hideNext = false,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        ) : null}
      </div>

      <div>{children}</div>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-between">
        <div>
          {!hideBack && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
            >
              {backLabel}
            </button>
          )}
        </div>

        <div>
          {!hideNext && (
            <button
              type="button"
              onClick={onNext}
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
            >
              {nextLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}