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

export default cardRouter;