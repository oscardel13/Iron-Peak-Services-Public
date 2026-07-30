import express from "express";
import {} from "./client.controller.ts";

const ClientRouter = express.Router();

// client middleware
// ClientRouter.get("/me");
// ClientRouter.patch("/:id");

// admin middleware
// ClientRouter.get("/:id"); MIGHT BE MOVED TO ADMIN ROUTES

// Client Booking routes
// ClientRouter.get("/bookings");
// ClientRouter.get("/bookings/:id");
// ClientRouter.post("/bookings/:id/note");
// ClientRouter.post("/bookings/:id/change-request");

// ClientRouter.patch("/bookings/:id");

export default ClientRouter;
