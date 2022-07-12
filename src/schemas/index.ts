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

const getCardSchema = Joi.object({
    cardId: Joi.string().required(),
    password: Joi.number().integer().required(),
});

const balanceSchema = Joi.object({
    cardId: Joi.string().required(),
});

const blockCardSchema = Joi.object({
    cardId: Joi.string().required(),
    password: Joi.string().required(),
});

const rechargeSchema = Joi.object({
    cardId: Joi.string().required(),
    amount: Joi.number().integer().greater(0).required(),
});

const paymentSchema = Joi.object({
    cardId: Joi.string().required(),
    amount: Joi.number().integer().greater(0).required(),
    password: Joi.string().required(),
    businessId: Joi.string().required()
});

const schemas = {
    createCardSchema,
    activateCardSchema,
    getCardSchema,
    balanceSchema,
    blockCardSchema,
    rechargeSchema,
    paymentSchema
}

export default schemas;