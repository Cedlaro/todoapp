import { Component, output, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskFilters, TaskPriority, TaskStatus } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-filter',
  imports: [FormsModule],
  templateUrl: './task-filter.component.html',
})
export class TaskFilterComponent {
  readonly filtersChange = output<TaskFilters>();

  search = '';
  status: TaskStatus | '' = '';
  priority: TaskPriority | '' = '';

  emit(): void {
    this.filtersChange.emit({
      search: this.search || undefined,
      status: (this.status as TaskStatus) || undefined,
      priority: (this.priority as TaskPriority) || undefined,
    });
  }

  clear(): void {
    this.search = '';
    this.status = '';
    this.priority = '';
    this.emit();
  }
}
