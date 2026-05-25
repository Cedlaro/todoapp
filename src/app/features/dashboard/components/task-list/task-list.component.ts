import { Component, input, output } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { Task } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-list',
  imports: [SlicePipe],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent {
  readonly tasks = input.required<Task[]>();
  readonly loading = input(false);

  readonly toggleStatus = output<Task>();
  readonly editTask = output<Task>();
  readonly deleteTask = output<Task>();

  priorityClass(priority: string): string {
    return (
      {
        high: 'border-red-500 bg-red-50',
        medium: 'border-yellow-500 bg-yellow-50',
        low: 'border-green-500 bg-green-50',
      }[priority] ?? ''
    );
  }

  priorityBadge(priority: string): string {
    return (
      {
        high: 'bg-red-100 text-red-700',
        medium: 'bg-yellow-100 text-yellow-700',
        low: 'bg-green-100 text-green-700',
      }[priority] ?? ''
    );
  }

  isOverdue(task: Task): boolean {
    if (!task.due_date || task.status === 'completed') return false;
    return new Date(task.due_date) < new Date(new Date().toDateString());
  }
}
