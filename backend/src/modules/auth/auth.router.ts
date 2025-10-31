import express from 'express';

import { authMiddleware } from '../../middleware/authMiddleware';
import { login, me, refresh } from './auth.controller';

const router = express.Router();

router.post('/login', login);
router.post('/refresh', refresh);
router.get('/me', authMiddleware, me);

export default router;
