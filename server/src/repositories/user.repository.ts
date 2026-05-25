import { query } from '../db';
import { User } from '../types';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const rows = await query<User[]>('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    return rows[0] ?? null;
  }

  async findById(id: number): Promise<User | null> {
    const rows = await query<User[]>('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    return rows[0] ?? null;
  }

  async create(email: string, passwordHash: string): Promise<number> {
    const result = await query<{ insertId: number }>(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, passwordHash]
    );
    return result.insertId;
  }
}
