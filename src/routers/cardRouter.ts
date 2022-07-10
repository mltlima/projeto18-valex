import { Router } from 'express';

import schemas from '../schemas/index.js';
import * as cardController from '../controllers/cardController.js';
import validateApiKey from '../middlewares/validateApiKeyMiddleware.js';
import { validateSchema } from '../middlewares/schemasMiddleware.js';

const cardRouter = Router();
//todo: schema
cardRouter.post("/card", validateApiKey, validateSchema(schemas.createCardSchema), cardController.createCard);

export default cardRouter;