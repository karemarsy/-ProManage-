import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly API = 'http://localhost:3000/api/projects';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(this.API, { withCredentials: true });
  }

  getById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.API}/${id}`, { withCredentials: true });
  }

  create(data: { name: string; description?: string }): Observable<Project> {
    return this.http.post<Project>(this.API, data, { withCredentials: true });
  }

  update(id: string, data: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.API}/${id}`, data, { withCredentials: true });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`, { withCredentials: true });
  }

  addMember(projectId: string, userId: string): Observable<void> {
    return this.http.post<void>(`${this.API}/${projectId}/members`, { userId }, { withCredentials: true });
  }
}