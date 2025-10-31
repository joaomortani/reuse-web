import express from 'express';

import { authMiddleware } from '../../middleware/authMiddleware';
import { create, list, listNearby } from './item.controller';

const router = express.Router();

router.get('/nearby', listNearby);
router.get('/', list);
router.post('/', authMiddleware, create);

export default router;
