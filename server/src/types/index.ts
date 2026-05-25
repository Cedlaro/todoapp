export interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
}

export type TaskStatus = 'pending' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface JwtPayload {
  userId: number;
  email: string;
}
