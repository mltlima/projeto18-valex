import { Request, Response, NextFunction } from 'express';
import  * as employeeService from '../services/employeeService.js';
import { isValid } from '../utils/validate.js';

export async function validateEmployee(req: Request, res: Response, next: NextFunction) {
    const { employeeId }: { employeeId: number } = req.body;
    const { company } = res.locals;

    const employee = await employeeService.getEmployee(employeeId);
    isValid(employee, 'Employee not found');
    res.locals.employee = employee;
    next();
}