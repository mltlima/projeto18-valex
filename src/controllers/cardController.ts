import { Request, Response } from 'express';

import * as cardService from '../services/cardService.js';

export async function createCard(req: Request, res: Response) {
    const { cardType } = req.body;
    const { employee } = res.locals;
    
    const card = await cardService.createCard(employee, cardType);
    res.status(201).json(card);
}