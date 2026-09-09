"use client";

import { useMemo, useState } from "react";
import StepShell from "../step-shell/step-shell.component";

import ScheduleDatePicker from "./components/schedule-date-picker.component";
import ScheduleDateFields from "./components/schedule-date-fields.component";
import ScheduleSummaryCards from "./components/schedule-summary-cards.component";
import ScheduleAvailabilityNotice from "./components/schedule-availability-notice.component";

import {
  addDaysToDateInputValue,
  getRentalDays,
  getTomorrowDateInputValue,
  getUpcomingDateOptions,
} from "./utils/schedule-date.utils";

import { getDateAvailability } from "./utils/schedule-availability.utils";

export default function StepSchedule({
  bookingForm,
  updateScheduleField,
  availableProducts = [],
  dumpsters = [],
  bookings = [],
  goToNextStep,
  goToPreviousStep,
  formErrors = {},
}) {
  const [localError, setLocalError] = useState("");

  const hasExtraDaysFee = bookingForm.schedule.extraDays > 0;
  const minDate = getTomorrowDateInputValue();
  const rentableItems = dumpsters.length > 0 ? dumpsters : availableProducts;

  const dateOptions = useMemo(() => getUpcomingDateOptions(21), []);

  const availabilityByDate = useMemo(() => {
    return dateOptions.reduce((map, option) => {
      map[option.value] = getDateAvailability({
        items: rentableItems,
        bookings,
        dateValue: option.value,
      });

      return map;
    }, {});
  }, [dateOptions, rentableItems, bookings]);

  const selectedDeliveryAvailability = bookingForm.schedule.deliveryDate
    ? getDateAvailability({
        items: rentableItems,
        bookings,
        dateValue: bookingForm.schedule.deliveryDate,
      })
    : null;

  function handleDeliveryDateChange(value) {
    const availability = getDateAvailability({
      items: rentableItems,
      bookings,
      dateValue: value,
    });

    if (!availability.isAvailable) {
      setLocalError("No rentals are available for that delivery date.");
      updateScheduleField("schedule.deliveryDate", "");
      updateScheduleField("schedule.pickupDate", "");
      return;
    }

    setLocalError("");
    updateScheduleField("schedule.deliveryDate", value);

    if (!bookingForm.schedule.unknownPickup && value) {
      const defaultPickupDate = addDaysToDateInputValue(
        value,
        availability.defaultRentalDays,
      );

      updateScheduleField("schedule.pickupDate", defaultPickupDate);
    }
  }

  function handlePickupDateChange(value) {
    const deliveryDate = bookingForm.schedule.deliveryDate;

    if (!deliveryDate) {
      setLocalError("Please select a delivery date first.");
      return;
    }

    const availability = getDateAvailability({
      items: rentableItems,
      bookings,
      dateValue: deliveryDate,
    });

    const rentalDays = getRentalDays(deliveryDate, value);

    if (
      availability.maxAvailableDays &&
      rentalDays > availability.maxAvailableDays
    ) {
      setLocalError(
        `Only ${availability.maxAvailableDays} day${
          availability.maxAvailableDays === 1 ? "" : "s"
        } are available from this delivery date.`,
      );

      updateScheduleField(
        "schedule.pickupDate",
        addDaysToDateInputValue(deliveryDate, availability.maxAvailableDays),
      );

      return;
    }

    setLocalError("");
    updateScheduleField("schedule.pickupDate", value);
  }

  function handleNext() {
    const deliveryDate = bookingForm.schedule.deliveryDate;
    const pickupDate = bookingForm.schedule.pickupDate;

    if (!deliveryDate) {
      setLocalError("Please select a delivery date.");
      return;
    }

    const availability = getDateAvailability({
      items: rentableItems,
      bookings,
      dateValue: deliveryDate,
    });

    if (!availability.isAvailable) {
      setLocalError("No rentals are available for that delivery date.");
      return;
    }

    if (!bookingForm.schedule.unknownPickup) {
      if (!pickupDate) {
        setLocalError("Please select a pickup date.");
        return;
      }

      const rentalDays = getRentalDays(deliveryDate, pickupDate);

      if (rentalDays <= 0) {
        setLocalError("Pickup date must be after the delivery date.");
        return;
      }

      if (
        availability.maxAvailableDays &&
        rentalDays > availability.maxAvailableDays
      ) {
        setLocalError(
          `Only ${availability.maxAvailableDays} day${
            availability.maxAvailableDays === 1 ? "" : "s"
          } are available from this delivery date.`,
        );
        return;
      }
    }

    setLocalError("");
    goToNextStep();
  }

  return (
    <StepShell
      title="Choose your dates"
      description="Pick your delivery date and expected pickup date."
      onNext={handleNext}
      onBack={goToPreviousStep}
      errors={formErrors}
    >
      <div className="space-y-6">
        <ScheduleDatePicker
          dateOptions={dateOptions}
          availabilityByDate={availabilityByDate}
          selectedDate={bookingForm.schedule.deliveryDate}
          onSelectDate={handleDeliveryDateChange}
        />

        <ScheduleAvailabilityNotice
          selectedDeliveryAvailability={selectedDeliveryAvailability}
          hasExtraDaysFee={hasExtraDaysFee}
          unknownPickup={bookingForm.schedule.unknownPickup}
        />

        <ScheduleDateFields
          bookingForm={bookingForm}
          minDate={minDate}
          selectedDeliveryAvailability={selectedDeliveryAvailability}
          onDeliveryDateChange={handleDeliveryDateChange}
          onPickupDateChange={handlePickupDateChange}
        />

        <ScheduleSummaryCards bookingForm={bookingForm} />

        {localError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {localError}
          </div>
        ) : null}
      </div>
    </StepShell>
  );
}
