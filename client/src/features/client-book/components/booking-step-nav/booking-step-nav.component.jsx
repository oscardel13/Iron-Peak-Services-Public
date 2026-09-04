"use client";

export default function BookingStepNav({ steps, currentStep, goToStep }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-2 shadow-sm md:rounded-2xl md:p-3">
      <div className="flex min-w-max gap-2">
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isComplete = step.id < currentStep;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => goToStep(step.id)}
              className={`min-w-[84px] rounded-xl px-3 py-2 text-left transition md:min-w-0 md:rounded-2xl md:px-4 md:py-3 ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : isComplete
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <p className="text-xs font-medium uppercase tracking-wide">
                Step {step.id}
              </p>
              <p className="text-sm font-semibold md:mt-1">
                {step.shortTitle}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}