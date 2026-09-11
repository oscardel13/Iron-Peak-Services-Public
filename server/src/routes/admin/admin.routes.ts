/* 

GET    /api/v1/public/inventory/items/available

GET    /api/v1/admin/inventory/items
GET    /api/v1/admin/inventory/items/:id
POST   /api/v1/admin/inventory/items
PATCH  /api/v1/admin/inventory/items/:id
DELETE /api/v1/admin/inventory/items/:id

GET    /api/v1/admin/inventory/addons
GET    /api/v1/admin/inventory/addons/:id
POST   /api/v1/admin/inventory/addons
PATCH  /api/v1/admin/inventory/addons/:id
DELETE /api/v1/admin/inventory/addons/:id

*/

import express from "express";

import AdminInventoryRouter from "./admin.inventory.router.js";
import AdminBookingRouter from "./admin.booking.router.js";
import AdminClientRouter from "./admin.client.router.js";

const AdminRouter = express.Router();

AdminRouter.use("/inventory", AdminInventoryRouter);
AdminRouter.use("/bookings", AdminBookingRouter);
AdminRouter.use("/clients", AdminClientRouter);

export default AdminRouter;
