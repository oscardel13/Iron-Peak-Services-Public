import express from 'express';
import {
  HttpGetBookings,
  HttpGetBookingById,
  HttpCreateBooking,
  // HttpUpdateBooking,
  HttpDeleteBooking,
  HttpPatchBooking,
  // HttpGetBookingHistory,
  // HttpGetBookingNotes,
  // HttpAddBookingNote,
  // HttpGetBookingAddons,
  // HttpAddBookingAddon,
  // HttpRemoveBookingAddon,
}  from './bookings.controller.ts';

const router = express.Router();

// GET /api/v1/admin/bookings
// need admin auth for this route
router.get('/', HttpGetBookings);

// POST /api/v1/admin/bookings
router.post('/', HttpCreateBooking);

// // GET /api/v1/admin/bookings/:id/history
// router.get('/history', HttpGetBookingHistory);

// GET /api/v1/admin/bookings/:id
// need admin auth for this route
router.get('/:id', HttpGetBookingById);

// PATCH /api/v1/admin/bookings/:id
// need admin auth for this route
router.patch('/:id', HttpPatchBooking);

// DELETE /api/v1/admin/bookings/:id
// need admin auth for this route
router.delete('/:id', HttpDeleteBooking);

// // GET /api/v1/admin/bookings/:id/notes
// router.get('/:id/notes', HttpGetBookingNotes);

// // POST /api/v1/admin/bookings/:id/notes
// router.post('/:id/notes', HttpAddBookingNote);

// // GET /api/v1/admin/bookings/:id/addons
// router.get('/:id/addons', HttpGetBookingAddons);

// // POST /api/v1/admin/bookings/:id/addons
// router.post('/:id/addons', HttpAddBookingAddon);

// // DELETE /api/v1/admin/bookings/:id/addons/:addonId
// router.delete('/:id/addons/:addonId', HttpRemoveBookingAddon);

export { router as bookingsRouter };