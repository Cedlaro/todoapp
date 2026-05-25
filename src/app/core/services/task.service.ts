import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, CreateTaskDto, UpdateTaskDto, TaskFilters } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);

  getAll(filters: TaskFilters = {}): Observable<Task[]> {
    let params = new HttpParams();
    if (filters.status) params = params.set('status', filters.status);
    if (filters.priority) params = params.set('priority', filters.priority);
    if (filters.search) params = params.set('search', filters.search);
    return this.http.get<Task[]>('/api/tasks', { params, withCredentials: true });
  }

  create(dto: CreateTaskDto): Observable<{ id: number }> {
    return this.http.post<{ id: number }>('/api/tasks', dto, { withCredentials: true });
  }

  update(id: number, dto: UpdateTaskDto): Observable<void> {
    return this.http.patch<void>(`/api/tasks/${id}`, dto, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/tasks/${id}`, { withCredentials: true });
  }
}
