import express from 'express';
import {
  HttpGetDumpsters,
  HttpGetDumpsterById,
  HttpCreateDumpster,
  HttpUpdateDumpster,
  HttpGetAvailableDumpstersByDates,
  // HttpDeleteDumpster,
  HttpGetAddons,
  // HttpGetAddonById,
  // HttpCreateAddon,
  // HttpUpdateAddon,
  // HttpDeleteAddon,
} from './inventory.controller.js';

const router = express.Router();

// Dumpster routes
// GET /api/v1/admin/inventory/dumpsters
router.get('/dumpsters', HttpGetDumpsters);

// POST /api/v1/admin/inventory/dumpsters
router.post('/dumpsters', HttpCreateDumpster);

// GET /api/v1/admin/inventory/dumpsters/available?deliveryDate=2024-10-01&pickupDate=2024-10-05`
router.get('/dumpsters/available', HttpGetAvailableDumpstersByDates);

// GET /api/v1/admin/inventory/dumpsters/:id
router.get('/dumpsters/:id', HttpGetDumpsterById);

// PUT /api/v1/admin/inventory/dumpsters/:id
router.put('/dumpsters/:id', HttpUpdateDumpster);

// // DELETE /api/v1/admin/inventory/dumpsters/:id
// router.delete('/dumpsters/:id', HttpDeleteDumpster);

// // Addon routes
// GET /api/v1/admin/inventory/addons
router.get('/addons', HttpGetAddons);

// // POST /api/v1/admin/inventory/addons
// router.post('/addons', HttpCreateAddon);

// // GET /api/v1/admin/inventory/addons/:id
// router.get('/addons/:id', HttpGetAddonById);

// // PUT /api/v1/admin/inventory/addons/:id
// router.put('/addons/:id', HttpUpdateAddon);

// // DELETE /api/v1/admin/inventory/addons/:id
// router.delete('/addons/:id', HttpDeleteAddon);

export { router as inventoryRouter };