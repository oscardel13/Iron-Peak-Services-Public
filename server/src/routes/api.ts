import express from 'express';

import { Router } from 'express';
// import { publicRouter } from './public/public.routes.js';
import { bookingsRouter } from './bookings/bookings.routes.js';
import { inventoryRouter } from './inventory/inventory.routes.js';
import { authRouter } from './auth/auth.router.ts';
// import { customerAccessRouter } from './customer-access/customerAccess.routes.js';

const router = Router();

// router.use('/public', express.json(),publicRouter);
router.use('/auth', authRouter);
router.use('/bookings', express.json(),bookingsRouter);
router.use('/inventory', express.json(),inventoryRouter);
// router.use('/customer-access', express.json(),customerAccessRouter);

export default router;
