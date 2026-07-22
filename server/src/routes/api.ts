import express from "express";

import { Router } from "express";
// import { publicRouter } from './public/public.routes.js';
import BookingsRouter from "./bookings/bookings.routes.js";
import InventoryRouter from "./inventory/inventory.routes.js";
import AuthRouter from "./auth/auth.router.ts";
import StripeRouter from "./stripe/stripe.router.ts";
// import { customerAccessRouter } from './customer-access/customerAccess.routes.js';

const router = Router();

// router.use('/public', express.json(),publicRouter);
router.use("/auth", AuthRouter);
router.use("/bookings", express.json(), BookingsRouter);
router.use("/inventory", express.json(), InventoryRouter);
router.use("/stripe", StripeRouter);
// router.use('/customer-access', express.json(),customerAccessRouter);

export default router;
