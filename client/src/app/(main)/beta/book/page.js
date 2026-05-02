"use client";

import { useState, useEffect } from "react";
import BookingShell from "./components/booking-shell/booking-shell.component";
import StepStartAddress from "./components/step-start-address/step-start-address.component";
import StepDumpsterDetails from "./components/step-dumpster-details/step-dumpster-details.component";
import StepSchedule from "./components/step-schedule/step-schedule.component";
import StepVerifyLocation from "./components/step-verify-location/step-verify-location.component";
import StepCustomerPayment from "./components/step-customer-payment/step-customer-payment.component";
import StepReviewSubmit from "./components/step-review-submit/step-review-submit.component";

import { INITIAL_BOOKING_FORM } from "./utils/booking-form";

import { getAPI } from "@/utils/api";

import {
  calculateBookingTotal,
  calculateExtraDaysFee,
  calculateRentalDays,
  getMaterialSurcharge,
} from "./utils/booking-helpers";

const BOOKING_STEPS = [
  { id: 1, key: "address", title: "Start Address", shortTitle: "Address" },
  { id: 2, key: "schedule", title: "Schedule", shortTitle: "Date" },
  { id: 3, key: "dumpster", title: "Dumpster Details", shortTitle: "Dumpster" },
  { id: 4, key: "location", title: "Verify Location", shortTitle: "Location" },
  { id: 5, key: "customer", title: "Customer & Payment", shortTitle: "Info" },
  { id: 6, key: "review", title: "Review & Submit", shortTitle: "Review" },
];

export default function BookPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingForm, setBookingForm] = useState(INITIAL_BOOKING_FORM);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [dumpsters, setDumpsters] = useState(null);
  const [addons, setAddons] = useState(null);

  useEffect(() => {
    const fetchDumpsters = async () => {
      try {
        const response = await getAPI("/inventory/dumpsters");
        setDumpsters(response.data);
      } catch (error) {
        console.error("Failed to fetch dumpsters:", error);
      }
    };

    const fetchAddons = async () => {
      try {
        const response = await getAPI("/inventory/addons");
        setAddons(response.data);
      } catch (error) {
        console.error("Failed to fetch addons:", error);
      }
    };

    fetchDumpsters();
    fetchAddons();
  }, []);

  const availableProducts = dumpsters ?? [];

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

      if (path === "dumpster.material") {
        next.pricing.materialSurcharge = getMaterialSurcharge(value);
        next.pricing.total = calculateBookingTotal(next);
      }

      return next;
    });
  }

  function setSelectedProduct(product) {
    setBookingForm((prev) => {
      const next = structuredClone(prev);
      const materialSurcharge = getMaterialSurcharge(next.dumpster.material);

      next.dumpster.productId = product.id;
      next.dumpster.productLabel = product.label;
      next.dumpster.size = product.size;
      next.dumpster.basePrice = product.basePrice;
      next.dumpster.includedWeightText = product.includedWeightText;

      next.pricing.basePrice = product.basePrice;
      next.pricing.materialSurcharge = product.concretePrice || materialSurcharge;
      next.pricing.total = calculateBookingTotal(next);

      return next;
    });
  }

  function toggleAddon(key, checked) {
    setBookingForm((prev) => {
      const next = structuredClone(prev);

      next.addons[key] = checked;
      const selectedAddons = addons.find((addon) => addon.code === key);
      console.log("addons in toggleAddon:", selectedAddons, "key:", key, "checked:", checked);

      

      if (key === "drivewayProtection") {
        next.pricing.drivewayProtectionFee = checked
          ? Number(selectedAddons.price)
          : 0;
      }

      if (key === "priorityDelivery") {
        next.pricing.priorityDeliveryFee = checked
          ? Number(selectedAddons.price)
          : 0;
      }

      next.pricing.total = calculateBookingTotal(next);
      console.log("Updated booking form in toggleAddon:", next);

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

  async function submitBooking() {
    try {
      console.log("Submitting booking:", bookingForm);

      const customerName = [
        bookingForm.customer.firstName,
        bookingForm.customer.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .trim();

      const payload = {
        dumpsterId: bookingForm.dumpster.productId || null,
        dumpsterSize: Number(bookingForm.dumpster.size),
        dumpsterLabel: bookingForm.dumpster.productLabel || null,
        material: bookingForm.dumpster.material || null,
        productCode: bookingForm.dumpster.productCode || null,

        serviceType: "DUMPSTER_RENTAL",
        projectType: bookingForm.projectType || null,

        customerName,
        customerPhone: bookingForm.customer.phone,
        customerEmail: bookingForm.customer.email || null,

        address1: bookingForm.address.address1,
        address2: bookingForm.address.address2 || null,
        city: bookingForm.address.city,
        state: bookingForm.address.state,
        zip: bookingForm.address.zip,
        projectType: bookingForm.address.projectType || null,
        placement: bookingForm.location.placement || null,
        instructions: bookingForm.location.instructions || null,
        customerNotes: bookingForm.customer.notes || null,

        locationVerified: Boolean(bookingForm.location?.verified),
        locationVerificationNote: bookingForm.location?.verificationNote || null,

        deliveryDate: bookingForm.schedule.deliveryDate,
        pickupDate: bookingForm.schedule.unknownPickup
          ? null
          : bookingForm.schedule.pickupDate,
        pickupDateUnknown: Boolean(bookingForm.schedule.unknownPickup),
        rentalDaysIncluded: 7,

        bookingStatus: "QUOTE",
        paymentStatus: "UNPAID",

        concretePrice: bookingForm.dumpster.concretePrice,
        rentalDays: bookingForm.schedule.rentalDays,

        basePrice: Number(bookingForm.pricing.basePrice || 0),
        deliveryFee: Number(bookingForm.pricing.deliveryFee || 0),
        mileageFee: Number(bookingForm.pricing.mileageFee || 0),
        extraDaysFee: Number(bookingForm.pricing.extraDaysFee || 0),
        overageFee: Number(bookingForm.pricing.overageFee || 0),
        addons: {
          drivewayProtection: bookingForm.addons.drivewayProtection,
          priorityDelivery: bookingForm.addons.priorityDelivery,
        },
        total: Number(bookingForm.pricing.total || 0),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to submit booking");
      }

      const data = await response.json();

      console.log("Booking created:", data);

      // setCurrentStep(1);
      // setBookingForm(INITIAL_BOOKING_FORM);

      alert("Booking submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong submitting the booking.");
    }
  }

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
          <StepSchedule
            bookingForm={bookingForm}
            updateScheduleField={updateScheduleField}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
          />
        );

      case 3:
        return (
          <StepDumpsterDetails
            bookingForm={bookingForm}
            updateBookingForm={updateBookingForm}
            setSelectedProduct={setSelectedProduct}
            toggleAddon={toggleAddon}
            availableProducts={availableProducts}
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
            onSubmit={submitBooking} 
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