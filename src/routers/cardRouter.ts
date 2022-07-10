import { Router } from 'express';

import schemas from '../schemas/index.js';

import * as cardController from '../controllers/cardController.js';
import validateApiKey from '../middlewares/validateApiKeyMiddleware.js';

const cardRouter = Router();
//todo: schema
cardRouter.post("/card", validateApiKey, cardController.createCard);

export default cardRouter;