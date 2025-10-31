import express from 'express';
import type { Request, Response } from 'express';

import authRouter from '../modules/auth/auth.router';
import itemRouter from '../modules/item/item.router';
import userRouter from '../modules/user/user.router';

const routes = express.Router();

routes.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

routes.use('/auth', authRouter);
routes.use('/users', userRouter);
routes.use('/items', itemRouter);

export default routes;
