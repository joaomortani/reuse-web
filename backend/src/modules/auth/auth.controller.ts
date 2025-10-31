import type { Request, Response } from 'express';
import { ZodError } from 'zod';

import { loginSchema, refreshTokenSchema } from './auth.dto';
import {
  NotFoundError,
  UnauthorizedError,
  getUserProfile,
  login as loginService,
  refreshAccessToken,
} from './auth.service';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const result = await loginService(email, password);

    res.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: 'Validation failed',
        errors: error.flatten().fieldErrors,
      });
      return;
    }

    if (error instanceof UnauthorizedError) {
      res.status(401).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    const accessToken = await refreshAccessToken(refreshToken);

    res.json({ accessToken });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: 'Validation failed',
        errors: error.flatten().fieldErrors,
      });
      return;
    }

    if (error instanceof UnauthorizedError) {
      res.status(401).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

export const me = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const user = await getUserProfile(req.user.id);

    res.json(user);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};
