import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:3000/api/auth';

  private _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);
  readonly isAdmin = computed(() => this._user()?.role === 'ADMIN');

  constructor(private http: HttpClient, private router: Router) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    this.http.get<{ user: User }>(`${this.API}/me`, { withCredentials: true })
      .subscribe({
        next: ({ user }) => this._user.set(user),
        error: () => this._user.set(null),
      });
  }

  register(data: { email: string; name: string; password: string }): Observable<{ user: User }> {
    return this.http.post<{ user: User }>(`${this.API}/register`, data, { withCredentials: true })
      .pipe(tap(({ user }) => this._user.set(user)));
  }

  login(data: { email: string; password: string }): Observable<{ user: User }> {
    return this.http.post<{ user: User }>(`${this.API}/login`, data, { withCredentials: true })
      .pipe(tap(({ user }) => this._user.set(user)));
  }

  logout(): void {
    this.http.post(`${this.API}/logout`, {}, { withCredentials: true })
      .subscribe(() => {
        this._user.set(null);
        this.router.navigate(['/login']);
      });
  }
}