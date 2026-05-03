import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;

      const user = await authService.register(name, email, password);

      // Remover password del response
      const { password: _password, ...userSafe } = user;

      res.status(201).json(userSafe);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const { token, refreshToken } = await authService.login(email, password);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ token });
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token not found' });
        return;
      }

      const { token } = await authService.refresh(refreshToken);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (refreshToken) {
        await authService.logout(refreshToken);
        res.clearCookie('refreshToken');
      }

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  },
};
