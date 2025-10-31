import express from 'express';

import { authMiddleware } from '../../middleware/authMiddleware';
import { create, list } from './category.controller';

const router = express.Router();

router.get('/', list);
router.post('/', authMiddleware, create);

export default router;
