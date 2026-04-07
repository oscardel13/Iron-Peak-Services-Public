import express from 'express';
const {
  getBookingByToken,
  updateBookingByToken,
  addNoteByToken,
} = require('./customerAccess.controller.js');

const router = express.Router();

// GET /api/v1/customer-access/bookings/:token
router.get('/bookings/:token', getBookingByToken);

// PUT /api/v1/customer-access/bookings/:token
router.put('/bookings/:token', updateBookingByToken);

// POST /api/v1/customer-access/bookings/:token/notes
router.post('/bookings/:token/notes', addNoteByToken);

export { router as customerAccessRouter };