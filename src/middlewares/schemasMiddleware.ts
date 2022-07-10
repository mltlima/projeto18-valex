import { NextFunction, Request, Response } from 'express';
import { AnySchema } from 'joi';

export function validateSchema(schema: AnySchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            throw new Error(error.message);
        }
        next();
    }
}