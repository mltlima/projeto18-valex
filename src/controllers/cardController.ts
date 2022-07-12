import { Request, Response } from 'express';
import Cryptr from 'cryptr';

import * as cardService from '../services/cardService.js';

const cryptr = new Cryptr(process.env.SECRET_KEY!);

export async function createCard(req: Request, res: Response) {
    const { cardType } = req.body;
    const { employee } = res.locals;
    
    await cardService.createCard(employee, cardType);
    res.sendStatus(201);
}

export async function activateCard(req: Request, res: Response) {
    const { password, securityCode, cardId } = req.body;
    
    if (password.toString().length != 4) {
        throw new Error('password must have 4 digits');
    }

    await cardService.activateCard(cardId, password, securityCode);

    res.sendStatus(200);
}

export async function balanceCard(req: Request, res: Response) {
    const { cardId } = req.params;
    const card = await cardService.getCardBalance(Number(cardId));
    //console.log(card);
    res.status(200).send(card);
}

export async function blockCard(req: Request, res: Response) {
    const { cardId, password } = req.body;
    await cardService.blockCard(Number(cardId), password);
    res.sendStatus(200);
}

export async function unblockCard(req: Request, res: Response) {
    const { cardId, password } = req.body;
    await cardService.unblockCard(Number(cardId), password);
    res.sendStatus(200);
}

export async function rechargeCard(req: Request, res: Response) {
    const { cardId, amount } = req.body;
    await cardService.rechargeCard(Number(cardId), Number(amount));
    res.sendStatus(200);
}

export async function getCard(req: Request, res: Response) {
    //const { cardId } = req.params;
    const { cardId, password } = req.body;

    const card = await cardService.getCard(Number(cardId), password);
    ['id', 'employeeId', 'password', 'isVirtual', 'originalCardId', 'isBlocked', 'type'].forEach(prop => delete card[prop])
    card.securityCode = cryptr.decrypt(card.securityCode);

    res.status(200).send(card);
}