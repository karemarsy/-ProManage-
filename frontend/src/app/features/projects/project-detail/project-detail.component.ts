import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService } from '../../../core/services/task.service';
import { Project } from '../../../core/models/project.model';
import { Task, TaskStatus } from '../../../core/models/task.model';

export interface Column {
  id: TaskStatus;
  label: string;
  tasks: Task[];
}

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [DragDropModule, FormsModule, CommonModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 mb-1">{{ project()?.name }}</h1>
          <p class="text-slate-500 m-0">{{ project()?.description }}</p>
        </div>
        <button
          (click)="showTaskForm.set(true)"
          class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap"
        >
          + Add Task
        </button>
      </div>

      @if (showTaskForm()) {
        <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl">
            <h3 class="text-slate-800 font-semibold text-lg mb-5">Create new task</h3>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                [(ngModel)]="newTask.title" placeholder="Task title"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                [(ngModel)]="newTask.description" placeholder="Optional description"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  [(ngModel)]="newTask.priority"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Due date</label>
                <input
                  type="date" [(ngModel)]="newTask.dueDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div class="flex gap-3 mt-5">
              <button
                (click)="createTask()"
                class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Create task
              </button>
              <button
                (click)="showTaskForm.set(false)"
                class="bg-white text-slate-700 px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      }

      <div class="flex gap-4 overflow-x-auto pb-4 items-start" cdkDropListGroup>
        @for (column of columns(); track column.id) {
          <div class="bg-slate-100 rounded-xl p-4 min-w-[280px] w-[280px] shrink-0">
            <div class="flex justify-between items-center mb-3">
              <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {{ column.label }}
              </span>
              <span class="bg-slate-200 text-slate-500 text-xs px-2 py-0.5 rounded-full font-medium">
                {{ column.tasks.length }}
              </span>
            </div>
            <div
              class="min-h-[120px] flex flex-col gap-2.5"
              cdkDropList
              [id]="column.id"
              [cdkDropListData]="column.tasks"
              (cdkDropListDropped)="onDrop($event)"
            >
              @for (task of column.tasks; track task.id) {
                <div
                  class="bg-white rounded-lg p-3.5 shadow-sm cursor-grab hover:shadow-md transition-shadow"
                  cdkDrag
                >
                  <div class="flex justify-between items-start gap-2 mb-1.5">
                    <span class="text-sm font-medium text-slate-800 flex-1">{{ task.title }}</span>
                    <span [class]="priorityClass(task.priority)">{{ task.priority }}</span>
                  </div>
                  @if (task.description) {
                    <p class="text-xs text-slate-500 mb-2 mt-0">{{ task.description }}</p>
                  }
                  <div class="flex items-center gap-2 flex-wrap">
                    @if (task.assignee) {
                      <span class="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {{ task.assignee.name }}
                      </span>
                    }
                    @if (task.dueDate) {
                      <span class="text-xs text-slate-400">{{ task.dueDate | date:'MMM d' }}</span>
                    }
                    <button
                      (click)="deleteTask(task.id, column.id)"
                      class="ml-auto bg-transparent border-none text-slate-300 hover:text-red-500 cursor-pointer text-base leading-none p-0"
                    >
                      ×
                    </button>
                  </div>
                  @if (task.labels.length) {
                    <div class="flex flex-wrap gap-1.5 mt-2">
                      @for (label of task.labels; track label.id) {
                        <span
                          class="text-xs px-2 py-0.5 rounded-full font-medium"
                          [style.background]="label.color + '22'"
                          [style.color]="label.color"
                        >
                          {{ label.name }}
                        </span>
                      }
                    </div>
                  }
                </div>
              } @empty {
                <div class="text-center text-slate-400 text-xs py-6">Drop tasks here</div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class ProjectDetailComponent implements OnInit {
  project = signal<Project | null>(null);
  showTaskForm = signal(false);
  newTask: Partial<Task> = { priority: 'MEDIUM' };

  columns = signal<Column[]>([
    { id: 'TODO', label: 'To Do', tasks: [] },
    { id: 'IN_PROGRESS', label: 'In Progress', tasks: [] },
    { id: 'REVIEW', label: 'Review', tasks: [] },
    { id: 'DONE', label: 'Done', tasks: [] },
  ]);

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private taskService: TaskService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.projectService.getById(id).subscribe((project) => {
      this.project.set(project);
      this.distributeTasks(project.tasks);
    });
  }

  priorityClass(priority: string): string {
    const base = 'text-xs font-semibold px-2 py-0.5 rounded-full uppercase whitespace-nowrap';
    const map: Record<string, string> = {
      LOW: `${base} bg-green-100 text-green-700`,
      MEDIUM: `${base} bg-yellow-100 text-yellow-700`,
      HIGH: `${base} bg-red-100 text-red-700`,
    };
    return map[priority] ?? base;
  }

  private distributeTasks(tasks: Task[]): void {
    this.columns.update((cols) =>
      cols.map((col) => ({
        ...col,
        tasks: tasks.filter((t) => t.status === col.id),
      })),
    );
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const task = event.container.data[event.currentIndex];
      const newStatus = event.container.id as TaskStatus;
      this.taskService.update(task.id, { status: newStatus }).subscribe();
    }
  }

  createTask(): void {
    const projectId = this.project()!.id;
    if (!this.newTask.title?.trim()) return;
    this.taskService.create(projectId, this.newTask).subscribe((task) => {
      this.columns.update((cols) =>
        cols.map((col) =>
          col.id === 'TODO' ? { ...col, tasks: [task, ...col.tasks] } : col,
        ),
      );
      this.newTask = { priority: 'MEDIUM' };
      this.showTaskForm.set(false);
    });
  }

  deleteTask(taskId: string, columnId: TaskStatus): void {
    this.taskService.delete(taskId).subscribe(() => {
      this.columns.update((cols) =>
        cols.map((col) =>
          col.id === columnId
            ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
            : col,
        ),
      );
    });
  }
}