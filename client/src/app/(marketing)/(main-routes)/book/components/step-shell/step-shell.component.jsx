"use client";

export default function StepShell({
  title,
  description,
  children,
  onNext,
  onBack,
  nextLabel = "Next Step",
  backLabel = "Back",
  hideBack = false,
  hideNext = false,
  errorMessage = "",
  errors = {},
}) {
  const errorList = Object.values(errors || {}).filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        ) : null}
      </div>

      {errorMessage || errorList.length > 0 ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-800">
            {errorMessage ||
              "Please complete the required fields before continuing."}
          </p>

          {errorList.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
              {errorList.map((error, index) => (
                <li key={`${error}-${index}`}>{error}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <div>{children}</div>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-between">
        <div>
          {!hideBack && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-2xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
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
              className="rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              {nextLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
