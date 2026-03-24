"use client";

import { useMemo, useState } from "react";
import BookingShell from "./components/booking-shell/booking-shell.component";
import StepStartAddress from "./components/step-start-address/step-start-address.component";
import StepDumpsterDetails from "./components/step-dumpster-details/step-dumpster-details.component";
import StepSchedule from "./components/step-schedule/step-schedule.component";
import StepVerifyLocation from "./components/step-verify-location/step-verify-location.component";
import StepCustomerPayment from "./components/step-customer-payment/step-customer-payment.component";
import StepReviewSubmit from "./components/step-review-submit/step-review-submit.component";

import { ADDON_PRICING, DUMPSTER_PRODUCTS } from "./utils/booking-data";
import {
  calculateBookingTotal,
  calculateExtraDaysFee,
  calculateRentalDays,
} from "./utils/booking-helpers";

const BOOKING_STEPS = [
  { id: 1, key: "address", title: "Start Address", shortTitle: "Address" },
  { id: 2, key: "dumpster", title: "Dumpster Details", shortTitle: "Dumpster" },
  { id: 3, key: "schedule", title: "Schedule", shortTitle: "Date" },
  { id: 4, key: "location", title: "Verify Location", shortTitle: "Location" },
  { id: 5, key: "customer", title: "Customer & Payment", shortTitle: "Info" },
  { id: 6, key: "review", title: "Review & Submit", shortTitle: "Review" },
];

const INITIAL_BOOKING_FORM = {
  address: {
    query: "",
    fullAddress: "",
    address1: "",
    city: "",
    state: "",
    zip: "",
    lat: null,
    lng: null,
  },
  dumpster: {
    material: "",
    size: "",
    productId: "",
    productLabel: "",
    basePrice: 0,
    includedWeightText: "",
  },
  addons: {
    drivewayProtection: false,
    priorityDelivery: false,
  },
  schedule: {
    deliveryDate: "",
    pickupDate: "",
    unknownPickup: false,
    rentalDays: 0,
    extraDays: 0,
    extraDaysFee: 0,
  },
  location: {
    placement: "",
    instructions: "",
    verified: false,
  },
  customer: {
    customerType: "home",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  },
  payment: {
    billingSameAsCustomer: true,
    status: "pending",
  },
  pricing: {
    basePrice: 0,
    drivewayProtectionFee: 0,
    priorityDeliveryFee: 0,
    extraDaysFee: 0,
    total: 0,
  },
};

export default function BookPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingForm, setBookingForm] = useState(INITIAL_BOOKING_FORM);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  function goToStep(stepId) {
    setCurrentStep(stepId);
    setMobileSummaryOpen(false);
  }

  function goToNextStep() {
    setCurrentStep((prev) => Math.min(prev + 1, BOOKING_STEPS.length));
  }

  function goToPreviousStep() {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }

  function updateBookingForm(path, value) {
    setBookingForm((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let current = next;

      for (let i = 0; i < keys.length - 1; i += 1) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return next;
    });
  }

  function setSelectedProduct(product) {
    setBookingForm((prev) => {
      const next = structuredClone(prev);

      next.dumpster.productId = product.id;
      next.dumpster.productLabel = product.label;
      next.dumpster.size = product.size;
      next.dumpster.basePrice = product.basePrice;
      next.dumpster.includedWeightText = product.includedWeightText;

      next.pricing.basePrice = product.basePrice;
      next.pricing.total = calculateBookingTotal(next);

      return next;
    });
  }

  function toggleAddon(key, checked) {
    setBookingForm((prev) => {
      const next = structuredClone(prev);

      next.addons[key] = checked;

      if (key === "drivewayProtection") {
        next.pricing.drivewayProtectionFee = checked
          ? ADDON_PRICING.drivewayProtection
          : 0;
      }

      if (key === "priorityDelivery") {
        next.pricing.priorityDeliveryFee = checked
          ? ADDON_PRICING.priorityDelivery
          : 0;
      }

      next.pricing.total = calculateBookingTotal(next);

      return next;
    });
  }

  function updateScheduleField(path, value) {
    setBookingForm((prev) => {
      const next = structuredClone(prev);

      const keys = path.split(".");
      let current = next;

      for (let i = 0; i < keys.length - 1; i += 1) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;

      const rentalDays = next.schedule.unknownPickup
        ? 0
        : calculateRentalDays(
            next.schedule.deliveryDate,
            next.schedule.pickupDate
          );

      const extraDays = rentalDays > 7 ? rentalDays - 7 : 0;
      const extraDaysFee = calculateExtraDaysFee(rentalDays);

      next.schedule.rentalDays = rentalDays;
      next.schedule.extraDays = extraDays;
      next.schedule.extraDaysFee = extraDaysFee;
      next.pricing.extraDaysFee = extraDaysFee;
      next.pricing.total = calculateBookingTotal(next);

      return next;
    });
  }

  const availableSizes = useMemo(() => {
    const sizes = DUMPSTER_PRODUCTS
      .filter((item) =>
        bookingForm.dumpster.material
          ? item.material === bookingForm.dumpster.material
          : true
      )
      .map((item) => item.size);

    return [...new Set(sizes)].sort((a, b) => a - b);
  }, [bookingForm.dumpster.material]);

  const availableProducts = useMemo(() => {
    return DUMPSTER_PRODUCTS.filter((item) => {
      const materialMatch = bookingForm.dumpster.material
        ? item.material === bookingForm.dumpster.material
        : true;

      const sizeMatch = bookingForm.dumpster.size
        ? item.size === Number(bookingForm.dumpster.size)
        : true;

      return materialMatch && sizeMatch;
    });
  }, [bookingForm.dumpster.material, bookingForm.dumpster.size]);

  function renderStep() {
    switch (currentStep) {
      case 1:
        return (
          <StepStartAddress
            bookingForm={bookingForm}
            updateBookingForm={updateBookingForm}
            goToNextStep={goToNextStep}
          />
        );
      case 2:
        return (
          <StepDumpsterDetails
            bookingForm={bookingForm}
            updateBookingForm={updateBookingForm}
            setSelectedProduct={setSelectedProduct}
            toggleAddon={toggleAddon}
            availableSizes={availableSizes}
            availableProducts={availableProducts}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
          />
        );
      case 3:
        return (
          <StepSchedule
            bookingForm={bookingForm}
            updateScheduleField={updateScheduleField}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
          />
        );
      case 4:
        return (
          <StepVerifyLocation
            bookingForm={bookingForm}
            updateBookingForm={updateBookingForm}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
          />
        );
      case 5:
        return (
          <StepCustomerPayment
            bookingForm={bookingForm}
            updateBookingForm={updateBookingForm}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
          />
        );
      case 6:
        return (
          <StepReviewSubmit
            bookingForm={bookingForm}
            goToPreviousStep={goToPreviousStep}
            goToStep={goToStep}
          />
        );
      default:
        return null;
    }
  }

  return (
    <BookingShell
      steps={BOOKING_STEPS}
      currentStep={currentStep}
      goToStep={goToStep}
      bookingForm={bookingForm}
      mobileSummaryOpen={mobileSummaryOpen}
      setMobileSummaryOpen={setMobileSummaryOpen}
      goToPreviousStep={goToPreviousStep}
    >
      {renderStep()}
    </BookingShell>
  );
}