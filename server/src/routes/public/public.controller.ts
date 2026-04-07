import type { Request, Response } from 'express';
const {
  getAvailableDumpsters,
  getAddons,
  createQuote,
  getQuoteById,
} = require('../../services/public.service.js');

export const httpGetAvailableDumpsters = async (req: Request, res: Response) => {
  try {
    const dumpsters = await getAvailableDumpsters(req.query);
    res.json(dumpsters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available dumpsters' });
  }
};

export const httpGetAddons = async (req: Request, res: Response) => {
  try {
    const addons = await getAddons();
    res.json(addons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch addons' });
  }
};

export const httpCreateQuote = async (req: Request, res: Response) => {
  try {
    const quote = await createQuote(req.body);
    res.status(201).json(quote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create quote' });
  }
};

export const httpGetQuoteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Quote ID is required' });
    }
    const quote = await getQuoteById(id as string);
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    res.json(quote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
};