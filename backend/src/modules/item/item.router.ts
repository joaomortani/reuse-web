import express from 'express';

import { authMiddleware } from '../../middleware/authMiddleware';
import { createItem, getMyItems } from './item.controller';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createItem);
router.get('/', getMyItems);

export default router;
