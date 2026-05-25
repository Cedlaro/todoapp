import { Component, inject, signal, OnInit } from '@angular/core';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { Task, TaskFilters } from '../../core/models/task.model';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskFilterComponent } from './components/task-filter/task-filter.component';

@Component({
  selector: 'app-dashboard',
  imports: [TaskListComponent, TaskFormComponent, TaskFilterComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  readonly auth = inject(AuthService);

  readonly tasks = signal<Task[]>([]);
  readonly loading = signal(false);
  readonly showForm = signal(false);
  readonly editingTask = signal<Task | null>(null);
  private currentFilters: TaskFilters = {};

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading.set(true);
    this.taskService.getAll(this.currentFilters).subscribe({
      next: (tasks) => { this.tasks.set(tasks); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  onFiltersChange(filters: TaskFilters): void {
    this.currentFilters = filters;
    this.loadTasks();
  }

  openCreate(): void {
    this.editingTask.set(null);
    this.showForm.set(true);
  }

  openEdit(task: Task): void {
    this.editingTask.set(task);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingTask.set(null);
  }

  onSaved(): void {
    this.closeForm();
    this.loadTasks();
  }

  onToggleStatus(task: Task): void {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    this.taskService.update(task.id, { status: newStatus }).subscribe(() => this.loadTasks());
  }

  onDelete(task: Task): void {
    if (!confirm(`Delete "${task.title}"?`)) return;
    this.taskService.delete(task.id).subscribe(() => this.loadTasks());
  }
}
