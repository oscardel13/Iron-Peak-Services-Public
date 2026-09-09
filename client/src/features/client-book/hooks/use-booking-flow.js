"use client";

import { useEffect, useRef, useState } from "react";

import { getAPI, postAPI, putAPI } from "@/utils/api";

import { buildCheckoutPayload } from "../utils/booking-checkout-payload";
import { INITIAL_BOOKING_FORM } from "../utils/booking-form";
import { BOOKING_STEPS } from "../utils/booking-steps";

import {
  calculateBookingTotal,
  calculateExtraDaysFee,
  calculateRentalDays,
} from "../utils/booking-helpers";

function hasValue(value) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function normalizeInventoryResponse(response) {
  if (Array.isArray(response?.data)) return response.data;

  return response?.data?.dumpsters || response?.data?.inventory || [];
}

function normalizeAddonsResponse(response) {
  if (Array.isArray(response?.data)) return response.data;

  return response?.data?.addons || response?.data?.inventory || [];
}

function normalizeClientResponse(response) {
  return (
    response?.data?.client ||
    response?.data?.user ||
    response?.data ||
    response?.client ||
    response?.user ||
    null
  );
}

function splitName(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
}

function getClientCustomerValues(client) {
  if (!client) return null;

  const fullName =
    client.name ||
    client.fullName ||
    `${client.firstName || ""} ${client.lastName || ""}`.trim();

  const split = splitName(fullName);

  return {
    firstName: client.firstName || split.firstName || "",
    lastName: client.lastName || split.lastName || "",
    phone: client.phone || client.phoneNumber || "",
    email: client.email || "",
  };
}

export default function useBookingFlow({
  initialForm = INITIAL_BOOKING_FORM,
  autoScroll = true,
} = {}) {
  const [signedInClient, setSignedInClient] = useState(null);
  const [customerPrefilled, setCustomerPrefilled] = useState(false);

  const [addons, setAddons] = useState(null);
  const [dumpsters, setDumpsters] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [formErrors, setFormErrors] = useState({});
  const [bookingId, setBookingId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const [clientSecret, setClientSecret] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [serverBooking, setServerBooking] = useState(null);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState(initialForm);
  const [isPreparingCheckout, setIsPreparingCheckout] = useState(false);

  const [loadingSetup, setLoadingSetup] = useState(true);
  const [setupError, setSetupError] = useState("");

  const bookingIdRef = useRef(null);
  const checkoutRequestInFlightRef = useRef(false);

  useEffect(() => {
    async function fetchSetupData() {
      try {
        const [
          dumpstersResponse,
          addonsResponse,
          bookingsResponse,
          clientResponse,
        ] = await Promise.all([
          getAPI("/inventory/dumpsters"),
          getAPI("/inventory/addons"),
          getAPI("/bookings"),
          getAPI("/client/me").catch(() => null),
        ]);

        setDumpsters(normalizeInventoryResponse(dumpstersResponse));
        setAddons(normalizeAddonsResponse(addonsResponse));

        setBookings(
          bookingsResponse?.data?.bookings ||
            bookingsResponse?.data?.data ||
            bookingsResponse?.bookings ||
            bookingsResponse?.data ||
            [],
        );

        const client = normalizeClientResponse(clientResponse);
        const customerValues = getClientCustomerValues(client);

        if (customerValues) {
          setSignedInClient(client);

          setBookingForm((prev) => {
            const next = structuredClone(prev);

            const shouldPrefill =
              !hasValue(next.customer.firstName) &&
              !hasValue(next.customer.lastName) &&
              !hasValue(next.customer.phone) &&
              !hasValue(next.customer.email);

            if (!shouldPrefill) return prev;

            next.customer.firstName = customerValues.firstName;
            next.customer.lastName = customerValues.lastName;
            next.customer.phone = customerValues.phone;
            next.customer.email = customerValues.email;

            return next;
          });

          setCustomerPrefilled(true);
        }
      } catch (error) {
        console.error("Failed to fetch booking setup data:", error);
        setSetupError("Failed to load booking options.");
      } finally {
        setLoadingSetup(false);
      }
    }

    fetchSetupData();
  }, []);

  useEffect(() => {
    if (!autoScroll) return;

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
  }, [currentStep, autoScroll]);

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

  function markCheckoutDirty() {
    setClientSecret("");
    setServerBooking(null);
    setCheckoutError("");
    setPaymentSucceeded(false);
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
    markCheckoutDirty();

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
    markCheckoutDirty();

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
    markCheckoutDirty();

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
    markCheckoutDirty();

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

  async function prepareCheckoutDraft() {
    if (checkoutRequestInFlightRef.current) return;

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
      checkoutRequestInFlightRef.current = true;
      setIsPreparingCheckout(true);
      setCheckoutError("");

      const payload = buildCheckoutPayload(bookingForm);
      const currentBookingId = bookingIdRef.current || bookingId;

      const response = currentBookingId
        ? await putAPI(`/bookings/${currentBookingId}/checkout-draft`, payload)
        : await postAPI("/bookings/checkout-draft", payload);

      const data = response.data;

      setBookingId(data.booking.id);
      bookingIdRef.current = data.booking.id;

      setServerBooking(data.booking);
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error(error);

      const apiMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong preparing checkout.";

      setCheckoutError(apiMessage);
    } finally {
      checkoutRequestInFlightRef.current = false;
      setIsPreparingCheckout(false);
    }
  }

  function handlePaymentSuccess(paymentIntent) {
    console.log("Payment succeeded:", paymentIntent);
    setPaymentSucceeded(true);
  }

  return {
    signedInClient,
    customerPrefilled,

    addons,
    dumpsters,
    bookings,
    availableProducts,

    formErrors,
    bookingId,
    currentStep,
    clientSecret,
    checkoutError,
    serverBooking,
    paymentSucceeded,
    mobileSummaryOpen,
    bookingForm,
    isPreparingCheckout,
    loadingSetup,
    setupError,

    setMobileSummaryOpen,

    goToStep,
    goToNextStep,
    goToPreviousStep,
    updateBookingForm,
    setSelectedProduct,
    toggleAddon,
    updateScheduleField,
    prepareCheckoutDraft,
    handlePaymentSuccess,
  };
}
