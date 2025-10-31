import express from 'express';

import { register, updateMe } from './user.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.put('/me', authMiddleware, updateMe);

export default router;
