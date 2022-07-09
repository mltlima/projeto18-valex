import * as employeeRepository from '../repositories/employeeRepository.js';
import { isValid } from '../utils/validate.js';

export async function getEmployee(id : number) {
    const employees = await employeeRepository.findById(id);
    isValid(employees, 'Employee not found');
    return employees;
}