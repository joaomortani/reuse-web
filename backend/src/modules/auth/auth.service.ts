import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

import env from '../../config/env';
import prisma from '../../lib/prisma';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginResult {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

function parseExpiresInToMilliseconds(expiresIn: string): number {
  const trimmed = expiresIn.trim();

  if (!trimmed) {
    throw new Error('Expiration value cannot be empty');
  }

  const match = trimmed.match(/^(\d+)(ms|s|m|h|d|w|y)?$/i);

  if (!match) {
    throw new Error(`Unsupported expiration format: ${expiresIn}`);
  }

  const value = Number(match[1]);
  const unit = match[2]?.toLowerCase();

  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
    y: 365.25 * 24 * 60 * 60 * 1000,
  };

  if (!unit) {
    return value * multipliers.s;
  }

  const multiplier = multipliers[unit];

  if (!multiplier) {
    throw new Error(`Unsupported expiration unit: ${unit}`);
  }

  return value * multiplier;
}

export const login = async (email: string, password: string): Promise<LoginResult> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const accessToken = jwt.sign({ sub: user.id }, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn,
  });

  const refreshToken = randomBytes(48).toString('hex');
  const expiresInMs = parseExpiresInToMilliseconds(env.jwtRefreshExpiresIn);
  const expiresAt = new Date(Date.now() + expiresInMs);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!storedToken) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  if (storedToken.expiresAt.getTime() <= Date.now()) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw new UnauthorizedError('Refresh token expired');
  }

  const user = await prisma.user.findUnique({
    where: { id: storedToken.userId },
    select: { id: true },
  });

  if (!user) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw new UnauthorizedError('Invalid refresh token');
  }

  const accessToken = jwt.sign({ sub: user.id }, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn,
  });

  return accessToken;
};

export const logout = async (refreshToken: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
};

export const getUserProfile = async (userId: string): Promise<AuthUser> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};
