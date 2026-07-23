import express from "express";
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
} from "./inventory.controller.js";

const InventoryRouter = express.Router();

// Dumpster routes
// GET /api/v1/admin/inventory/dumpsters
InventoryRouter.get("/dumpsters", HttpGetDumpsters);

// POST /api/v1/admin/inventory/dumpsters
InventoryRouter.post("/dumpsters", HttpCreateDumpster);

// GET /api/v1/admin/inventory/dumpsters/available?deliveryDate=2024-10-01&pickupDate=2024-10-05`
InventoryRouter.get("/dumpsters/available", HttpGetAvailableDumpstersByDates);

// GET /api/v1/admin/inventory/dumpsters/:id
InventoryRouter.get("/dumpsters/:id", HttpGetDumpsterById);

// PUT /api/v1/admin/inventory/dumpsters/:id
InventoryRouter.put("/dumpsters/:id", HttpUpdateDumpster);

// // DELETE /api/v1/admin/inventory/dumpsters/:id
// InventoryRouter.delete('/dumpsters/:id', HttpDeleteDumpster);

// // Addon routes
// GET /api/v1/admin/inventory/addons
InventoryRouter.get("/addons", HttpGetAddons);

// // POST /api/v1/admin/inventory/addons
// InventoryRouter.post('/addons', HttpCreateAddon);

// // GET /api/v1/admin/inventory/addons/:id
// InventoryRouter.get('/addons/:id', HttpGetAddonById);

// // PUT /api/v1/admin/inventory/addons/:id
// InventoryRouter.put('/addons/:id', HttpUpdateAddon);

// // DELETE /api/v1/admin/inventory/addons/:id
// InventoryRouter.delete('/addons/:id', HttpDeleteAddon);

export default InventoryRouter;
