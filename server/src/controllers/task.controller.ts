import { Response } from 'express';
import { validationResult } from 'express-validator';
import { TaskService } from '../services/task.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { TaskPriority, TaskStatus } from '../types';

const taskService = new TaskService();

export async function getTasks(req: AuthRequest, res: Response): Promise<void> {
  const { status, priority, search } = req.query as {
    status?: TaskStatus;
    priority?: TaskPriority;
    search?: string;
  };
  const tasks = await taskService.getAll(req.userId!, { status, priority, search });
  res.json(tasks);
}

export async function getTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    const task = await taskService.getOne(Number(req.params['id']), req.userId!);
    res.json(task);
  } catch {
    res.status(404).json({ message: 'Task not found' });
  }
}

export async function createTask(req: AuthRequest, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  const { title, description = null, priority = 'medium', due_date = null } = req.body as {
    title: string;
    description?: string;
    priority?: TaskPriority;
    due_date?: string;
  };

  const result = await taskService.create(req.userId!, title, description, priority, due_date);
  res.status(201).json(result);
}

export async function updateTask(req: AuthRequest, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  try {
    await taskService.update(Number(req.params['id']), req.userId!, req.body);
    res.json({ message: 'Updated' });
  } catch {
    res.status(404).json({ message: 'Task not found' });
  }
}

export async function deleteTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    await taskService.remove(Number(req.params['id']), req.userId!);
    res.json({ message: 'Deleted' });
  } catch {
    res.status(404).json({ message: 'Task not found' });
  }
}
