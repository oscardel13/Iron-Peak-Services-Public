import express from "express";
import {
  HttpGetBookings,
  HttpGetBookingById,
  HttpCreateBooking,
  // HttpUpdateBooking,
  HttpDeleteBooking,
  HttpPatchBooking,
  HttpCreateCheckoutDraftBooking,
  HttpUpdateCheckoutDraftBooking,
  // HttpGetBookingHistory,
  // HttpGetBookingNotes,
  // HttpAddBookingNote,
  // HttpGetBookingAddons,
  // HttpAddBookingAddon,
  // HttpRemoveBookingAddon,
} from "./bookings.controller.ts";

const BookingsRouter = express.Router();

// GET /api/v1/admin/bookings
// need admin auth for this route
BookingsRouter.get("/", HttpGetBookings);

// POST /api/v1/admin/bookings
BookingsRouter.post("/", HttpCreateBooking);

BookingsRouter.post("/checkout-draft", HttpCreateCheckoutDraftBooking);

BookingsRouter.put("/:id/checkout-draft", HttpUpdateCheckoutDraftBooking);

// // GET /api/v1/admin/bookings/:id/history
// BookingsRouter.get('/history', HttpGetBookingHistory);

// GET /api/v1/admin/bookings/:id
// need admin auth for this route
BookingsRouter.get("/:id", HttpGetBookingById);

// PATCH /api/v1/admin/bookings/:id
// need admin auth for this route
BookingsRouter.patch("/:id", HttpPatchBooking);

// DELETE /api/v1/admin/bookings/:id
// need admin auth for this route
BookingsRouter.delete("/:id", HttpDeleteBooking);

// // GET /api/v1/admin/bookings/:id/notes
// BookingsRouter.get('/:id/notes', HttpGetBookingNotes);

// // POST /api/v1/admin/bookings/:id/notes
// BookingsRouter.post('/:id/notes', HttpAddBookingNote);

// // GET /api/v1/admin/bookings/:id/addons
// BookingsRouter.get('/:id/addons', HttpGetBookingAddons);

// // POST /api/v1/admin/bookings/:id/addons
// BookingsRouter.post('/:id/addons', HttpAddBookingAddon);

// // DELETE /api/v1/admin/bookings/:id/addons/:addonId
// BookingsRouter.delete('/:id/addons/:addonId', HttpRemoveBookingAddon);

export default BookingsRouter;
