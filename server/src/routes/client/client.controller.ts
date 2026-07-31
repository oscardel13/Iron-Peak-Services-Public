// routes/client/client.controller.ts
import type { Request, Response } from "express";

function getHttpErrorStatus(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return error.statusCode;
  }

  return 500;
}

function getHttpErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function getRequestUser(req: Request) {
  return req.user as any;
}

// GET /client/me
export async function HttpGetClientMe(req: Request, res: Response) {
  try {
    const user = getRequestUser(req);

    res.status(200).json({
      user,
      client: user?.client ?? null,
    });
  } catch (error) {
    console.error("Error getting client me:", error);

    res.status(getHttpErrorStatus(error)).json({
      error: getHttpErrorMessage(error, "Failed to get client profile."),
    });
  }
}

// GET /client/bookings
export async function HttpGetClientBookings(req: Request, res: Response) {
  try {
    const user = getRequestUser(req);

    res.status(200).json({
      message: "Client bookings route working.",
      clientId: user?.client?.id ?? null,
      bookings: [],
    });
  } catch (error) {
    console.error("Error getting client bookings:", error);

    res.status(getHttpErrorStatus(error)).json({
      error: getHttpErrorMessage(error, "Failed to get client bookings."),
    });
  }
}

// GET /client/bookings/:id
export async function HttpGetClientBookingById(req: Request, res: Response) {
  try {
    const user = getRequestUser(req);
    const { id } = req.params;

    res.status(200).json({
      message: "Client booking detail route working.",
      clientId: user?.client?.id ?? null,
      bookingId: id,
      booking: null,
    });
  } catch (error) {
    console.error("Error getting client booking:", error);

    res.status(getHttpErrorStatus(error)).json({
      error: getHttpErrorMessage(error, "Failed to get client booking."),
    });
  }
}

// POST /client/bookings/:id/notes
export async function HttpCreateClientBookingNote(req: Request, res: Response) {
  try {
    const user = getRequestUser(req);
    const { id } = req.params;
    const { body } = req.body;

    res.status(201).json({
      message: "Client booking note route working.",
      clientId: user?.client?.id ?? null,
      bookingId: id,
      note: {
        body: body ?? null,
      },
    });
  } catch (error) {
    console.error("Error creating client booking note:", error);

    res.status(getHttpErrorStatus(error)).json({
      error: getHttpErrorMessage(error, "Failed to create booking note."),
    });
  }
}

// POST /client/bookings/:id/change-request
export async function HttpCreateClientBookingChangeRequest(
  req: Request,
  res: Response,
) {
  try {
    const user = getRequestUser(req);
    const { id } = req.params;

    res.status(201).json({
      message: "Client booking change request route working.",
      clientId: user?.client?.id ?? null,
      bookingId: id,
      changeRequest: {
        type: req.body?.type ?? null,
        message: req.body?.message ?? null,
        requestedDeliveryDate: req.body?.requestedDeliveryDate ?? null,
        requestedPickupDate: req.body?.requestedPickupDate ?? null,
      },
    });
  } catch (error) {
    console.error("Error creating client booking change request:", error);

    res.status(getHttpErrorStatus(error)).json({
      error: getHttpErrorMessage(
        error,
        "Failed to create booking change request.",
      ),
    });
  }
}

// GET /client/:id
export async function HttpGetClientById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    res.status(200).json({
      message: "Admin client detail route working.",
      clientId: id,
      client: null,
    });
  } catch (error) {
    console.error("Error getting client by id:", error);

    res.status(getHttpErrorStatus(error)).json({
      error: getHttpErrorMessage(error, "Failed to get client."),
    });
  }
}
