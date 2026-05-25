import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function register(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  try {
    const { email, password } = req.body as { email: string; password: string };
    const { token, userId } = await authService.register(email, password);
    res
      .cookie('token', token, COOKIE_OPTIONS)
      .status(201)
      .json({ user: { id: userId, email } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    res.status(409).json({ message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  try {
    const { email, password } = req.body as { email: string; password: string };
    const { token, userId } = await authService.login(email, password);
    res
      .cookie('token', token, COOKIE_OPTIONS)
      .json({ user: { id: userId, email } });
  } catch {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie('token').json({ message: 'Logged out' });
}

export function getMe(req: Request, res: Response): void {
  const token = req.cookies?.token as string | undefined;
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  try {
    const payload = AuthService.verifyToken(token);
    res.json({ id: payload.userId, email: payload.email });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}
