import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';
import { userRepository } from '../persistence/repositories/user.repository';
import { refreshTokenRepository } from '../persistence/repositories/refreshToken.repository';
import { env } from '../config/env';
import { AppError } from '../utils/errors';

export const authService = {
  async register(name: string, email: string, password: string) {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError('User already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Access token (short-lived, 15m)
    const token = jwt.sign({ userId: user.id, role: user.role }, env.JWT_SECRET, {
      expiresIn: '15m',
    });

    // Refresh token (long-lived, 7d)
    const refreshToken = randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await refreshTokenRepository.create(refreshToken, user.id, expiresAt);

    return { token, refreshToken };
  },

  async refresh(token: string) {
    const storedToken = await refreshTokenRepository.findByToken(token);

    if (!storedToken) {
      throw new AppError('Invalid refresh token', 401);
    }

    if (storedToken.expiresAt < new Date()) {
      await refreshTokenRepository.deleteByToken(token);
      throw new AppError('Refresh token expired', 401);
    }

    // Generate new Access Token
    const accessToken = jwt.sign(
      { userId: storedToken.user.id, role: storedToken.user.role },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return { token: accessToken };
  },

  async logout(token: string) {
    try {
      await refreshTokenRepository.deleteByToken(token);
    } catch (error) {
      // Ignore if token not found
    }
  }
};
