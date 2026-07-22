import type { Request, Response } from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  createCheckoutDraftBooking,
  updateCheckoutDraftBooking,
  //updateBooking,
  deleteBooking,
  getBookingHistory,
  patchBooking,
  // getBookingNotes,
  // addBookingNote,
  // getBookingAddons,
  // addBookingAddon,
  // removeBookingAddon,
} from "../../services/bookings.service.ts";

import {
  validateCreateBookingInput,
  validatePatchBookingInput,
  getHttpErrorStatus,
  getHttpErrorMessage,
} from "../../helpers/bookings.helper.ts";

import { sendBookingConfirmationEmail } from "../../emails/templates/booking-confirmation.template.ts";

// TODO: Add validation, error handling, pagination, etc.
// Consider using a library like Joi or Yup for request validation (research this)
// Should be admin-only
export const HttpGetBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await getBookings(req.query);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// TODO: Add validation, error handling, etc.
// Should be accessible by admin and customer only.
export const HttpGetBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Booking ID is required" });
    }
    const booking = await getBookingById(id as string);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch booking" });
  }
};

// TODO: Add validation, error handling, etc.
export const HttpCreateBooking = async (req: Request, res: Response) => {
  try {
    const bookingInput = validateCreateBookingInput(req.body);

    const booking = await createBooking(bookingInput);

    await sendBookingConfirmationEmail(booking);

    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);

    const statusCode = getHttpErrorStatus(error);

    res.status(statusCode === 500 ? 500 : statusCode).json({
      error: getHttpErrorMessage(error, "Failed to create booking"),
    });
  }
};

// TODO: Add validation, error handling, etc.
// Should be accessible by admin and customer only (with restrictions on what can be updated).
// Consider implementing optimistic locking or versioning to handle concurrent updates (research this).
// or having 2 separate endpoints for admin and customer updates with different allowed fields.
export const HttpPatchBooking = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id) {
      return res.status(400).json({
        error: "Booking ID is required",
      });
    }

    const bookingInput = await validatePatchBookingInput(id, req.body);

    const booking = await patchBooking(id, bookingInput);

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found",
      });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error patching booking:", error);

    const statusCode = getHttpErrorStatus(error);

    res.status(statusCode === 500 ? 500 : statusCode).json({
      error: getHttpErrorMessage(error, "Failed to update booking"),
    });
  }
};

export const HttpCreateCheckoutDraftBooking = async (
  req: Request,
  res: Response,
) => {
  try {
    const bookingInput = validateCreateBookingInput(req.body);
    console.log("Creating checkout draft booking with input:", bookingInput);

    const checkoutDraft = await createCheckoutDraftBooking(bookingInput);
    console.log("Created checkout draft booking:", checkoutDraft);

    res.status(201).json(checkoutDraft);
  } catch (error) {
    console.error("Error creating checkout draft booking:", error);

    const statusCode = getHttpErrorStatus(error);

    res.status(statusCode === 500 ? 500 : statusCode).json({
      error: getHttpErrorMessage(error, "Failed to create checkout draft"),
    });
  }
};

export const HttpUpdateCheckoutDraftBooking = async (
  req: Request,
  res: Response,
) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id) {
      return res.status(400).json({
        error: "Booking ID is required",
      });
    }

    const bookingInput = await validatePatchBookingInput(id, req.body);

    const checkoutDraft = await updateCheckoutDraftBooking(id, bookingInput);

    res.json(checkoutDraft);
  } catch (error) {
    console.error("Error updating checkout draft booking:", error);

    const statusCode = getHttpErrorStatus(error);

    res.status(statusCode === 500 ? 500 : statusCode).json({
      error: getHttpErrorMessage(error, "Failed to update checkout draft"),
    });
  }
};

// TODO: Add validation, error handling, etc.
// Should be admin-only. Consider implementing soft delete or checking constraints before deletion.
export const HttpDeleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Booking ID is required" });
    }
    const success = await deleteBooking(id as string);
    if (!success) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete booking" });
  }
};

// TODO: Add validation, error handling, etc.
// Should be accessible by admin and customer only (with restrictions on what can be viewed).
// Ordered by delivery date (client can reorder if they like). Consider implementing pagination if history can be large.
export const HttpGetBookingHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Booking ID is required" });
    }
    const history = await getBookingHistory();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch booking history" });
  }
};

// export const HttpGetBookingNotes = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       return res.status(400).json({ error: 'Booking ID is required' });
//     }
//     const notes = await getBookingNotes(id as string);
//     res.json(notes);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch booking notes' });
//   }
// };

// export const HttpAddBookingNote = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       return res.status(400).json({ error: 'Booking ID is required' });
//     }
//     const note = await addBookingNote(id as string, req.body);
//     res.status(201).json(note);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to add booking note' });
//   }
// };

// export const HttpGetBookingAddons = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       return res.status(400).json({ error: 'Booking ID is required' });
//     }
//     const addons = await getBookingAddons(id as string);
//     res.json(addons);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch booking addons' });
//   }
// };

// export const HttpAddBookingAddon = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       return res.status(400).json({ error: 'Booking ID is required' });
//     }
//     const addon = await addBookingAddon(id as string, req.body);
//     res.status(201).json(addon);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to add booking addon' });
//   }
// };

// export const HttpRemoveBookingAddon = async (req: Request, res: Response) => {
//   try {
//     const { id, addonId } = req.params;
//     if (!id || !addonId) {
//       return res.status(400).json({ error: 'Booking ID and Addon ID are required' });
//     }
//     const success = await removeBookingAddon(id as string, addonId as string);
//     if (!success) {
//       return res.status(404).json({ error: 'Booking addon not found' });
//     }
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to remove booking addon' });
//   }
// };
