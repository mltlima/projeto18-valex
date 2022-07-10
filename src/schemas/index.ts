import Joi from 'joi';

const createCardSchema = Joi.object({
    cardType: Joi.string().required(),
    employeeId: Joi.string().required(),
});

const activateCardSchema = Joi.object({
    cardId: Joi.string().required(),
    password: Joi.number().integer().greater(3).less(5).required(),
    securityCode: Joi.string().required(),
});

const schemas = {
    createCardSchema,
    activateCardSchema,
}

export default schemas;