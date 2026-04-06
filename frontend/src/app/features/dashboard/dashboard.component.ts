import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../core/services/project.service';
import { AuthService } from '../../core/services/auth.service';
import { Project } from '../../core/models/project.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto p-8">

      <div class="flex justify-between items-start mb-8">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 mb-1">
            Welcome, {{ auth.user()?.name }}
          </h1>
          <p class="text-slate-500">Here's an overview of your projects</p>
        </div>
        <button
          (click)="showCreateForm.set(true)"
          class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + New Project
        </button>
      </div>

      @if (showCreateForm()) {
        <div class="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-100">
          <h3 class="text-slate-800 font-semibold mb-4">Create new project</h3>
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Project name</label>
            <input
              [(ngModel)]="newName" placeholder="e.g. Website Redesign"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              [(ngModel)]="newDesc" placeholder="Optional description"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div class="flex gap-3">
            <button
              (click)="createProject()"
              class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Create
            </button>
            <button
              (click)="showCreateForm.set(false)"
              class="bg-white text-slate-700 px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      }

      <div class="flex gap-4 mb-8">
        <div class="bg-white rounded-xl shadow-sm p-5 min-w-36 border border-slate-100">
          <div class="text-3xl font-bold text-indigo-600">{{ projects().length }}</div>
          <div class="text-sm text-slate-500 mt-1">Total projects</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5 min-w-36 border border-slate-100">
          <div class="text-3xl font-bold text-indigo-600">{{ totalTasks }}</div>
          <div class="text-sm text-slate-500 mt-1">Total tasks</div>
        </div>
      </div>

      <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        @for (project of projects(); track project.id) {
  
    [routerLink]="['/projects', project.id]"
    class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 no-underline text-inherit hover:-translate-y-0.5 hover:shadow-md transition-all block"
  >
    <div class="flex justify-between items-start mb-2">
      <h3 class="text-slate-800 font-semibold text-base m-0">{{ project.name }}</h3>
      <span class="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full font-medium">
        {{ project._count?.tasks ?? 0 }} tasks
      </span>
    </div>
    @if (project.description) {
      <p class="text-slate-500 text-sm mb-3 mt-0">{{ project.description }}</p>
    }
    <div class="text-xs text-slate-400">{{ project.members.length }} member(s)</div>
} @empty {
  <div class="col-span-full text-center py-12 bg-white rounded-xl text-slate-400">
    No projects yet. Create your first project!
  </div>
}
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  projects = signal<Project[]>([]);
  showCreateForm = signal(false);
  newName = '';
  newDesc = '';

  constructor(
    public auth: AuthService,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    this.projectService.getAll().subscribe((p) => this.projects.set(p));
  }

  get totalTasks(): number {
    return this.projects().reduce((sum, p) => sum + (p._count?.tasks ?? 0), 0);
  }

  createProject(): void {
    if (!this.newName.trim()) return;
    this.projectService.create({ name: this.newName, description: this.newDesc }).subscribe((p) => {
      this.projects.update((list) => [p, ...list]);
      this.newName = '';
      this.newDesc = '';
      this.showCreateForm.set(false);
    });
  }
}
