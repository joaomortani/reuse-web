import express from 'express';

import { authMiddleware } from '../../middleware/authMiddleware';
import { create, list, listNearby, listTop, listMine, getById } from './item.controller';

const router = express.Router();

router.get('/nearby', listNearby);
router.get('/', list);
router.get('/top', listTop);
router.post('/', authMiddleware, create);
router.get('/items/mine', authMiddleware, listMine);
router.get('/:id', authMiddleware, getById);

export default router;
