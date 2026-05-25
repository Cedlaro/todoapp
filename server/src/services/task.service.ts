import { TaskRepository, TaskFilters, TaskUpdate } from '../repositories/task.repository';
import { Task, TaskPriority } from '../types';

const taskRepo = new TaskRepository();

export class TaskService {
  async getAll(userId: number, filters: TaskFilters): Promise<Task[]> {
    return taskRepo.findAllByUser(userId, filters);
  }

  async getOne(id: number, userId: number): Promise<Task> {
    const task = await taskRepo.findById(id, userId);
    if (!task) throw new Error('Task not found');
    return task;
  }

  async create(
    userId: number,
    title: string,
    description: string | null,
    priority: TaskPriority,
    dueDate: string | null
  ): Promise<{ id: number }> {
    const id = await taskRepo.create(userId, title, description, priority, dueDate);
    return { id };
  }

  async update(id: number, userId: number, data: TaskUpdate): Promise<void> {
    const updated = await taskRepo.update(id, userId, data);
    if (!updated) throw new Error('Task not found');
  }

  async remove(id: number, userId: number): Promise<void> {
    const deleted = await taskRepo.delete(id, userId);
    if (!deleted) throw new Error('Task not found');
  }
}
