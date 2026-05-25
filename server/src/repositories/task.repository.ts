import { query } from '../db';
import { Task, TaskPriority, TaskStatus } from '../types';

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
}

export class TaskRepository {
  async findAllByUser(userId: number, filters: TaskFilters = {}): Promise<Task[]> {
    const conditions: string[] = ['user_id = ?'];
    const params: (string | number | null)[] = [userId];

    if (filters.status) {
      conditions.push('status = ?');
      params.push(filters.status);
    }
    if (filters.priority) {
      conditions.push('priority = ?');
      params.push(filters.priority);
    }
    if (filters.search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      const like = `%${filters.search}%`;
      params.push(like, like);
    }

    const sql = `SELECT * FROM tasks WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`;
    return query<Task[]>(sql, params);
  }

  async findById(id: number, userId: number): Promise<Task | null> {
    const rows = await query<Task[]>(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ? LIMIT 1',
      [id, userId]
    );
    return rows[0] ?? null;
  }

  async create(
    userId: number,
    title: string,
    description: string | null,
    priority: TaskPriority,
    dueDate: string | null
  ): Promise<number> {
    const result = await query<{ insertId: number }>(
      'INSERT INTO tasks (user_id, title, description, priority, due_date) VALUES (?, ?, ?, ?, ?)',
      [userId, title, description, priority, dueDate]
    );
    return result.insertId;
  }

  async update(id: number, userId: number, data: TaskUpdate): Promise<boolean> {
    const fields: string[] = [];
    const params: (string | number | null)[] = [];

    if (data.title !== undefined) { fields.push('title = ?'); params.push(data.title); }
    if (data.description !== undefined) { fields.push('description = ?'); params.push(data.description); }
    if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }
    if (data.priority !== undefined) { fields.push('priority = ?'); params.push(data.priority); }
    if (data.due_date !== undefined) { fields.push('due_date = ?'); params.push(data.due_date); }

    if (fields.length === 0) return false;

    params.push(id, userId);
    const result = await query<{ affectedRows: number }>(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      params
    );
    return result.affectedRows > 0;
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const result = await query<{ affectedRows: number }>(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }
}
