import express from 'express';
import {
  getAvailableDumpsters,
  getAddons,
  createQuote,
  getQuoteById,
} from './public.controller.js';

const router = express.Router();

// GET /api/v1/public/dumpsters
router.get('/dumpsters', getAvailableDumpsters);

// GET /api/v1/public/addons
router.get('/addons', getAddons);

// POST /api/v1/public/quotes
router.post('/quotes', createQuote);

// GET /api/v1/public/quotes/:id
router.get('/quotes/:id', getQuoteById);

export { router as publicRouter };
