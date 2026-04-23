import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../persistence/repositories/user.repository';
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

    // mensaje genérico (no revelar si existe o no)
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return { token };
  },
};
