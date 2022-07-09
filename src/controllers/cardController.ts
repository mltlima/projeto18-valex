import { Request, Response } from 'express';

import * as cardService from '../services/cardService.js';

export async function createCard(req: Request, res: Response) {
    const { cardType } = req.body;
    const card = await cardService.createCard({ title, content });
    res.status(201).json(card);
}