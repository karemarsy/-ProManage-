import { Task } from './task.model';

export interface ProjectMember {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string };
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  archived: boolean;
  createdAt: string;
  members: ProjectMember[];
  tasks: Task[];
  _count?: { tasks: number };
}