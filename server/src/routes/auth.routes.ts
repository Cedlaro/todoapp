import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { register, login, logout, getMe } from '../controllers/auth.controller';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many requests, please try again later' },
});

const emailAndPasswordRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

router.get('/me', getMe);
router.post('/register', authLimiter, emailAndPasswordRules, register);
router.post('/login', authLimiter, emailAndPasswordRules, login);
router.post('/logout', logout);

export default router;
