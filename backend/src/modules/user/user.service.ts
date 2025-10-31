import type { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

import prisma from '../../lib/prisma';
import type { RegisterUserDTO } from './user.dto';

export type PublicUser = Omit<User, 'passwordHash'>;

export class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

export const createUser = async (data: RegisterUserDTO): Promise<PublicUser> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
    },
  });

  const { passwordHash: _passwordHash, ...userWithoutPassword } = user;

  return userWithoutPassword;
};
