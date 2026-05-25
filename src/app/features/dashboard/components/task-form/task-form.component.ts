import { Component, inject, input, output, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TaskService } from '../../../../core/services/task.service';
import { Task } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);

  readonly task = input<Task | null>(null);
  readonly saved = output<void>();
  readonly cancelled = output<void>();

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
    priority: ['medium' as 'low' | 'medium' | 'high'],
    due_date: [''],
  });

  readonly loading = signal(false);
  readonly error = signal('');

  get isEdit(): boolean {
    return this.task() !== null;
  }

  ngOnInit(): void {
    const t = this.task();
    if (t) {
      this.form.patchValue({
        title: t.title,
        description: t.description ?? '',
        priority: t.priority,
        due_date: t.due_date ? t.due_date.substring(0, 10) : '',
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const raw = this.form.getRawValue();
    const dto = {
      title: raw.title,
      description: raw.description || undefined,
      priority: raw.priority,
      due_date: raw.due_date || undefined,
    };

    const t = this.task();
    const op$: Observable<unknown> = t
      ? this.taskService.update(t.id, dto)
      : this.taskService.create(dto);

    op$.subscribe({
      next: () => this.saved.emit(),
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err?.error?.message ?? 'Failed to save task');
        this.loading.set(false);
      },
    });
  }
}
