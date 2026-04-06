import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="flex items-center justify-between px-8 h-14 bg-slate-800 text-white">
      <a routerLink="/dashboard" class="text-lg font-bold text-white no-underline">
        ProManage
      </a>
      <div class="flex items-center gap-6">
        <a routerLink="/dashboard" class="text-slate-400 text-sm hover:text-white transition-colors no-underline">
          Dashboard
        </a>
        <span class="text-slate-300 text-sm">{{ auth.user()?.name }}</span>
        <button
          (click)="auth.logout()"
          class="bg-red-500 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-red-600 transition-colors border-none cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}
}