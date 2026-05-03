import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();

router.get('/protected', authMiddleware, (req: AuthRequest, res) => {
  res.json({
    message: 'Access granted',
    userId: req.userId,
  });
});

export default router;
