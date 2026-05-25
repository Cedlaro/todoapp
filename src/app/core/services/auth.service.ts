import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface CurrentUser {
  id: number;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _currentUser = signal<CurrentUser | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);

  init(): void {
    this.http
      .get<CurrentUser>('/api/auth/me', { withCredentials: true })
      .subscribe({
        next: (user) => this._currentUser.set(user),
        error: () => this._currentUser.set(null),
      });
  }

  register(email: string, password: string): Observable<{ user: CurrentUser }> {
    return this.http
      .post<{ user: CurrentUser }>('/api/auth/register', { email, password }, { withCredentials: true })
      .pipe(tap(({ user }) => this._currentUser.set(user)));
  }

  login(email: string, password: string): Observable<{ user: CurrentUser }> {
    return this.http
      .post<{ user: CurrentUser }>('/api/auth/login', { email, password }, { withCredentials: true })
      .pipe(tap(({ user }) => this._currentUser.set(user)));
  }

  logout(): void {
    this.http
      .post('/api/auth/logout', {}, { withCredentials: true })
      .subscribe(() => {
        this._currentUser.set(null);
        this.router.navigate(['/login']);
      });
  }
}
