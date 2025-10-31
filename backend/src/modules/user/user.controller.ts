import { Request, Response } from 'express';
import { ZodError } from 'zod';

import { registerUserSchema } from './user.dto';
import { ConflictError, createUser } from './user.service';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = registerUserSchema.parse(req.body);

    const user = await createUser(data);

    res.status(201).json(user);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: 'Validation failed',
        errors: error.flatten().fieldErrors,
      });
      return;
    }

    if (error instanceof ConflictError) {
      res.status(409).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};
