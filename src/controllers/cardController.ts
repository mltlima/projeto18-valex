import { Request, Response } from 'express';

import * as cardService from '../services/cardService.js';

export async function createCard(req: Request, res: Response) {
    const { cardType } = req.body;
    const { company, employee } = res.locals;
    
    const card = await cardService.createCard(cardType, company, employee);
    res.status(201).json(card);
}