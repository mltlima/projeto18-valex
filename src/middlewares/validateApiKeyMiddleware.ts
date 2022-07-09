import { Request, Response, NextFunction } from 'express';
import * as companiesService from '../services/companiesService.js';
import { isValid } from '../utils/validate.js';

export default async function validateApiKey(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'] as string;
    console.log(apiKey);
    isValid(apiKey, 'Invalid api key');

    const company = await companiesService.getCompany(apiKey);
    isValid(company, 'Invalid api key');

    res.locals.company = company;
    next();
}