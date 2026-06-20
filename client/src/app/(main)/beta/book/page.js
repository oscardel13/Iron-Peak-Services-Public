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

function hasValue(value) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function getNestedValue(obj, path) {
  return path.split(".").reduce((current, key) => current?.[key], obj);
}

export default function BookPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingForm, setBookingForm] = useState(INITIAL_BOOKING_FORM);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [dumpsters, setDumpsters] = useState(null);
  const [addons, setAddons] = useState(null);
  const [formErrors, setFormErrors] = useState({});

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

  useEffect(() => {
    const firstScroll = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
    }, 0);

    const secondScroll = setTimeout(() => {
      window.scrollTo({
        top: 450,
        behavior: "smooth",
      });
    }, 120);

    return () => {
      clearTimeout(firstScroll);
      clearTimeout(secondScroll);
    };
  }, [currentStep]);

  const availableProducts = dumpsters ?? [];

  function clearError(path) {
    setFormErrors((prev) => {
      if (!prev[path]) return prev;

      const nextErrors = { ...prev };
      delete nextErrors[path];
      return nextErrors;
    });
  }

  function clearErrors(paths) {
    setFormErrors((prev) => {
      let changed = false;
      const nextErrors = { ...prev };

      paths.forEach((path) => {
        if (nextErrors[path]) {
          delete nextErrors[path];
          changed = true;
        }
      });

      return changed ? nextErrors : prev;
    });
  }

  function validateStep(stepId, form) {
    const errors = {};

    if (stepId === 1) {
      if (!hasValue(form.address.address1)) {
        errors["address.address1"] = "Address is required.";
      }

      if (!hasValue(form.address.city)) {
        errors["address.city"] = "City is required.";
      }

      if (!hasValue(form.address.state)) {
        errors["address.state"] = "State is required.";
      }

      if (!hasValue(form.address.zip)) {
        errors["address.zip"] = "ZIP is required.";
      }

      if (!hasValue(form.address.projectType)) {
        errors["address.projectType"] = "Project type is required.";
      }
    }

    if (stepId === 2) {
      if (!hasValue(form.schedule.deliveryDate)) {
        errors["schedule.deliveryDate"] = "Delivery date is required.";
      }

      if (!form.schedule.unknownPickup && !hasValue(form.schedule.pickupDate)) {
        errors["schedule.pickupDate"] = "Pickup date is required.";
      }

      if (
        hasValue(form.schedule.deliveryDate) &&
        hasValue(form.schedule.pickupDate) &&
        form.schedule.pickupDate < form.schedule.deliveryDate
      ) {
        errors["schedule.pickupDate"] =
          "Pickup date cannot be before delivery date.";
      }
    }

    if (stepId === 3) {
      if (!hasValue(form.dumpster.material)) {
        errors["dumpster.material"] = "Material is required.";
      }

      if (!hasValue(form.dumpster.productId)) {
        errors["dumpster.productId"] = "Please select a dumpster.";
      }
    }

    if (stepId === 4) {
      if (!hasValue(form.location.placement)) {
        errors["location.placement"] = "Placement is required.";
      }
    }

    if (stepId === 5) {
      if (!hasValue(form.customer.firstName)) {
        errors["customer.firstName"] = "First name is required.";
      }

      if (!hasValue(form.customer.lastName)) {
        errors["customer.lastName"] = "Last name is required.";
      }

      if (!hasValue(form.customer.phone)) {
        errors["customer.phone"] = "Phone number is required.";
      }

      if (!hasValue(form.customer.email)) {
        errors["customer.email"] = "Email is required.";
      }
    }

    return errors;
  }

  function validateAllSteps(form) {
    return BOOKING_STEPS.reduce((allErrors, step) => {
      return {
        ...allErrors,
        ...validateStep(step.id, form),
      };
    }, {});
  }

  function getFirstInvalidStep(form) {
    for (const step of BOOKING_STEPS) {
      const stepErrors = validateStep(step.id, form);

      if (Object.keys(stepErrors).length > 0) {
        return {
          stepId: step.id,
          errors: stepErrors,
        };
      }
    }

    return null;
  }

  function goToStep(stepId) {
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
      setMobileSummaryOpen(false);
      return;
    }

    const stepErrors = validateStep(currentStep, bookingForm);

    if (Object.keys(stepErrors).length > 0) {
      setFormErrors(stepErrors);
      setMobileSummaryOpen(false);
      return;
    }

    setFormErrors({});
    setCurrentStep(stepId);
    setMobileSummaryOpen(false);
  }

  function goToNextStep() {
    const stepErrors = validateStep(currentStep, bookingForm);

    if (Object.keys(stepErrors).length > 0) {
      setFormErrors(stepErrors);
      return;
    }

    setFormErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, BOOKING_STEPS.length));
  }

  function goToPreviousStep() {
    setFormErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }

  function updateBookingForm(path, value) {
    clearError(path);

    setBookingForm((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let current = next;

      for (let i = 0; i < keys.length - 1; i += 1) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;

      if (path === "pricing.mileageFee") {
        next.pricing.total = calculateBookingTotal(next);
      }

      if (path === "dumpster.material") {
        next.pricing.materialSurcharge =
          value === "concrete" ? Number(next.dumpster.concretePrice || 0) : 0;

        next.pricing.total = calculateBookingTotal(next);
      }

      return next;
    });
  }

  function setSelectedProduct(product) {
    clearErrors(["dumpster.productId"]);

    setBookingForm((prev) => {
      const next = structuredClone(prev);

      next.dumpster.productId = product.id;
      next.dumpster.productLabel = product.label;
      next.dumpster.size = product.size;
      next.dumpster.basePrice = Number(product.basePrice || 0);
      next.dumpster.concretePrice = Number(product.concretePrice || 0);
      next.dumpster.includedWeightText = product.includedWeightText;

      next.pricing.basePrice = Number(product.basePrice || 0);
      next.pricing.materialSurcharge =
        next.dumpster.material === "concrete"
          ? Number(product.concretePrice || 0)
          : 0;

      next.pricing.total = calculateBookingTotal(next);

      return next;
    });
  }

  function toggleAddon(key, checked) {
    setBookingForm((prev) => {
      const next = structuredClone(prev);

      next.addons[key] = checked;

      const selectedAddon = addons?.find((addon) => addon.code === key);

      if (key === "drivewayProtection") {
        next.pricing.drivewayProtectionFee =
          checked && selectedAddon ? Number(selectedAddon.price) : 0;
      }

      if (key === "priorityDelivery") {
        next.pricing.priorityDeliveryFee =
          checked && selectedAddon ? Number(selectedAddon.price) : 0;
      }

      next.pricing.total = calculateBookingTotal(next);

      return next;
    });
  }

  function updateScheduleField(path, value) {
    clearError(path);

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
            next.schedule.pickupDate,
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
    const invalidStep = getFirstInvalidStep(bookingForm);

    if (invalidStep) {
      setFormErrors(invalidStep.errors);
      setCurrentStep(invalidStep.stepId);
      return;
    }

    const allErrors = validateAllSteps(bookingForm);

    if (Object.keys(allErrors).length > 0) {
      setFormErrors(allErrors);
      return;
    }

    try {
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
        projectType: bookingForm.address.projectType || null,

        customerName,
        customerPhone: bookingForm.customer.phone,
        customerEmail: bookingForm.customer.email || null,

        address1: bookingForm.address.address1,
        address2: bookingForm.address.address2 || null,
        city: bookingForm.address.city,
        state: bookingForm.address.state,
        zip: bookingForm.address.zip,
        latitude: bookingForm.address.latitude,
        longitude: bookingForm.address.longitude,

        placement: bookingForm.location.placement || null,
        instructions: bookingForm.location.instructions || null,
        customerNotes: bookingForm.customer.notes || null,

        locationVerified: Boolean(bookingForm.location?.verified),
        locationVerificationNote:
          bookingForm.location?.verificationNote || null,

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
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to submit booking");
      }

      const data = await response.json();

      console.log("Booking created:", data);

      setCurrentStep(1);
      setBookingForm(INITIAL_BOOKING_FORM);

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
            formErrors={formErrors}
          />
        );

      case 2:
        return (
          <StepSchedule
            bookingForm={bookingForm}
            updateScheduleField={updateScheduleField}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
            formErrors={formErrors}
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
            formErrors={formErrors}
          />
        );

      case 4:
        return (
          <StepVerifyLocation
            bookingForm={bookingForm}
            updateBookingForm={updateBookingForm}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
            formErrors={formErrors}
          />
        );

      case 5:
        return (
          <StepCustomerPayment
            bookingForm={bookingForm}
            updateBookingForm={updateBookingForm}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
            formErrors={formErrors}
          />
        );

      case 6:
        return (
          <StepReviewSubmit
            bookingForm={bookingForm}
            goToPreviousStep={goToPreviousStep}
            goToStep={goToStep}
            formErrors={formErrors}
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
