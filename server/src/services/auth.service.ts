import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { JwtPayload } from '../types';

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET ?? 'change-me-in-production';
const JWT_EXPIRES_IN = '7d';

const userRepo = new UserRepository();

export class AuthService {
  async register(email: string, password: string): Promise<{ token: string; userId: number }> {
    const existing = await userRepo.findByEmail(email);
    if (existing) throw new Error('Email already in use');

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const userId = await userRepo.create(email, passwordHash);

    const token = this.signToken({ userId, email });
    return { token, userId };
  }

  async login(email: string, password: string): Promise<{ token: string; userId: number }> {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) throw new Error('Invalid credentials');

    const token = this.signToken({ userId: user.id, email: user.email });
    return { token, userId: user.id };
  }

  private signToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  }
}
