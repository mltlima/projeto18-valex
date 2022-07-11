import Joi from 'joi';

const createCardSchema = Joi.object({
    cardType: Joi.string().required(),
    employeeId: Joi.string().required(),
});

const activateCardSchema = Joi.object({
    cardId: Joi.string().required(),
    password: Joi.number().integer().required(),
    securityCode: Joi.number().integer().required(),
});

const schemas = {
    createCardSchema,
    activateCardSchema,
}

export default schemas;