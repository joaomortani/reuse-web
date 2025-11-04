import express from 'express';

import { authMiddleware } from '../../middleware/authMiddleware';
import { create, list, listMine, listNearby, listTop, show, update } from './item.controller';

const router = express.Router();

router.get('/nearby', listNearby);
router.get('/top', listTop);
router.get('/mine', authMiddleware, listMine);
router.get('/', list);
router.post('/', authMiddleware, create);
router.get('/:id', show);
router.put('/:id', authMiddleware, update);

export default router;
