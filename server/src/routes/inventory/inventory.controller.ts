import type { Request, Response } from "express";

import {
  getDumpsters,
  getDumpsterById,
  createDumpster,
  updateDumpster,
  getDumpstersFilteredByDates,
  deleteDumpster,
  getAddons,
  getAddonById,
  createAddon,
  updateAddon,
  deleteAddon,
} from "../../services/inventory.service.js";

export const HttpGetDumpsters = async (req: Request, res: Response) => {
  try {
    const dumpsters = await getDumpsters(req.query);
    res.json(dumpsters);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dumpsters" });
  }
};

export const HttpGetAvailableDumpstersByDates = async (
  req: Request,
  res: Response,
) => {
  try {
    const dumpsters = await getDumpstersFilteredByDates(req.query);
    res.json(dumpsters);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch available dumpsters" });
  }
};

export const HttpGetDumpsterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Dumpster ID is required" });
    }

    const dumpster = await getDumpsterById(id as string);
    if (!dumpster) {
      return res.status(404).json({ error: "Dumpster not found" });
    }

    res.json(dumpster);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dumpster" });
  }
};

export const HttpCreateDumpster = async (req: Request, res: Response) => {
  try {
    const dumpster = await createDumpster(req.body);
    res.status(201).json(dumpster);
  } catch (error) {
    res.status(500).json({ error: "Failed to create dumpster" });
  }
};

export const HttpUpdateDumpster = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Dumpster ID is required" });
    }

    const dumpster = await updateDumpster(id as string, req.body);
    if (!dumpster) {
      return res.status(404).json({ error: "Dumpster not found" });
    }

    res.json(dumpster);
  } catch (error) {
    res.status(500).json({ error: "Failed to update dumpster" });
  }
};

export const HttpDeleteDumpster = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Dumpster ID is required" });
    }

    const success = await deleteDumpster(id as string);
    if (!success) {
      return res.status(404).json({ error: "Dumpster not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete dumpster" });
  }
};

export const HttpGetAddons = async (req: Request, res: Response) => {
  try {
    const addons = await getAddons(req.query);
    res.json(addons);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch addons" });
  }
};

export const HttpGetAddonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Addon ID is required" });
    }

    const addon = await getAddonById(id as string);
    if (!addon) {
      return res.status(404).json({ error: "Addon not found" });
    }

    res.json(addon);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch addon" });
  }
};

export const HttpCreateAddon = async (req: Request, res: Response) => {
  try {
    const addon = await createAddon(req.body);
    res.status(201).json(addon);
  } catch (error) {
    res.status(500).json({ error: "Failed to create addon" });
  }
};

export const HttpUpdateAddon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Addon ID is required" });
    }

    const addon = await updateAddon(id as string, req.body);
    if (!addon) {
      return res.status(404).json({ error: "Addon not found" });
    }

    res.json(addon);
  } catch (error) {
    res.status(500).json({ error: "Failed to update addon" });
  }
};

export const HttpDeleteAddon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Addon ID is required" });
    }

    const success = await deleteAddon(id as string);
    if (!success) {
      return res.status(404).json({ error: "Addon not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete addon" });
  }
};
