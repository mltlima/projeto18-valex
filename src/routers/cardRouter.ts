import { Router } from 'express';

import schemas from '../schemas/index.js';
import * as cardController from '../controllers/cardController.js';
import validateApiKey from '../middlewares/validateApiKeyMiddleware.js';
import { validateSchema } from '../middlewares/schemasMiddleware.js';
import { validateEmployee } from '../middlewares/employeeMiddleware.js';

const cardRouter = Router();

cardRouter.post("/card", validateApiKey, validateSchema(schemas.createCardSchema),
                validateEmployee, cardController.createCard);
cardRouter.post("/card/activate", validateSchema(schemas.activateCardSchema),
                cardController.activateCard);
cardRouter.post("/card/cardInfo", validateSchema(schemas.getCardSchema), cardController.getCard);
cardRouter.get("/card/balance/:cardId", cardController.balanceCard);
cardRouter.post("/card/block", validateSchema(schemas.blockCardSchema), cardController.blockCard);
cardRouter.post("/card/unblock", validateSchema(schemas.blockCardSchema), cardController.unblockCard);
cardRouter.post("/card/recharge", validateApiKey, validateSchema(schemas.rechargeSchema), 
                cardController.rechargeCard);
cardRouter.post("/card/payment", validateSchema(schemas.paymentSchema), cardController.payment);
export default cardRouter;