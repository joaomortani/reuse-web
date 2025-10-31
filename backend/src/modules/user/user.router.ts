import express from 'express';

import { register } from './user.controller';

const router = express.Router();

router.post('/register', register);

export default router;
