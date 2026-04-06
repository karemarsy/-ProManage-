import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly API = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getByProject(projectId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API}/projects/${projectId}/tasks`, { withCredentials: true });
  }

  getById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.API}/tasks/${id}`, { withCredentials: true });
  }

  create(projectId: string, data: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${this.API}/projects/${projectId}/tasks`, data, { withCredentials: true });
  }

  update(id: string, data: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.API}/tasks/${id}`, data, { withCredentials: true });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/tasks/${id}`, { withCredentials: true });
  }

  addComment(taskId: string, content: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.API}/tasks/${taskId}/comments`, { content }, { withCredentials: true });
  }
}