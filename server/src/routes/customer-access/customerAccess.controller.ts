import type { Request, Response } from "express";

const {
  getBookingByToken,
  updateBookingByToken,
  addNoteByToken,
} = require("../../services/customerAccess.service.js");

export const HttpGetBookingByToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const booking = await getBookingByToken(token as string);
    if (!booking) {
      return res
        .status(404)
        .json({ error: "Booking not found or token invalid" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch booking" });
  }
};

export const HttpUpdateBookingByToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const booking = await updateBookingByToken(token as string, req.body);
    if (!booking) {
      return res
        .status(404)
        .json({ error: "Booking not found or token invalid" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: "Failed to update booking" });
  }
};

export const HttpAddNoteByToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const note = await addNoteByToken(token as string, req.body);
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: "Failed to add note" });
  }
};
