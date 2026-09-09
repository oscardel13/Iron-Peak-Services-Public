export default function ScheduleDatePicker({
  dateOptions,
  availabilityByDate,
  selectedDate,
  onSelectDate,
}) {
  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Select delivery date
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Dates with no availability are disabled.
          </p>
        </div>

        <div className="hidden items-center gap-2 text-[11px] text-gray-500 sm:flex">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          7+ days
          <span className="ml-2 h-2.5 w-2.5 rounded-full bg-amber-400" />
          Limited
          <span className="ml-2 h-2.5 w-2.5 rounded-full bg-gray-300" />
          Unavailable
        </div>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
        {dateOptions.map((option) => {
          const availability = availabilityByDate[option.value];
          console.log(availability);
          const isSelected = selectedDate === option.value;
          const isDisabled = !availability?.isAvailable;
          const isLimited = availability?.isLimited;

          return (
            <button
              key={option.value}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectDate(option.value)}
              className={`w-[112px] shrink-0 rounded-2xl border p-3 text-left transition sm:w-[118px] md:w-[124px] lg:w-[112px] xl:w-[118px] ${
                isSelected
                  ? "border-gray-950 bg-gray-950 text-white"
                  : isDisabled
                    ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                    : isLimited
                      ? "border-amber-200 bg-amber-50 text-gray-900 hover:border-amber-300"
                      : "border-green-200 bg-green-50 text-gray-900 hover:border-green-300"
              }`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide opacity-75">
                {option.weekday}
              </p>

              <p className="mt-1 text-sm font-bold leading-tight">
                {option.monthDay}
              </p>

              <p className="mt-2 text-xs font-medium leading-snug">
                {isDisabled
                  ? "Unavailable"
                  : `${availability.availableCount} available`}
              </p>

              {!isDisabled ? (
                <p
                  className={`mt-1 text-[11px] leading-snug ${
                    isSelected ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  {availability.hasSevenDayAvailability
                    ? "7+ days"
                    : `Max ${availability.maxAvailableDays} day${
                        availability.maxAvailableDays === 1 ? "" : "s"
                      }`}
                </p>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
