import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { GENERATED_MODULES } from '../../generated/registry';
import { AuthApiService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, RouterOutlet, DividerModule, ButtonModule, InputTextModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  protected readonly modules = GENERATED_MODULES;
  protected selectedModuleKey = '';
  protected currentAction: 'list' | 'new' | 'edit' = 'list';
  protected currentEditId = '';
  protected readonly logoPath = 'assets/images/water.png';
  protected readonly connectedUserName: string;
  private readonly authService = new AuthApiService();

  constructor(
    private readonly router: Router
  ) {
    this.connectedUserName = this.authService.getConnectedUserName();
    this.updateFromUrl(this.router.url);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.updateFromUrl(this.router.url));
  }

  protected isActiveModule(key: string): boolean {
    return this.selectedModuleKey === key;
  }

  protected getSelectedModuleLabel(): string {
    const selected = this.modules.find((item) => item.key === this.selectedModuleKey);
    return selected?.label ?? 'Global View';
  }

  protected hasSelectedModule(): boolean {
    return this.selectedModuleKey.length > 0;
  }

  protected hasActionCrumb(): boolean {
    return this.currentAction === 'new' || this.currentAction === 'edit';
  }

  protected getActionLabel(): string {
    if (this.currentAction === 'new') {
      return 'New';
    }
    if (this.currentAction === 'edit') {
      return this.currentEditId ? `Edit (${this.currentEditId})` : 'Edit';
    }
    return '';
  }

  private updateFromUrl(url: string): void {
    const [path] = url.split('?');
    const segments = path.split('/').filter(Boolean);
    const dashboardIndex = segments.findIndex((segment) => segment === 'dashboard');
    const moduleKey = dashboardIndex >= 0 ? segments[dashboardIndex + 1] ?? '' : '';
    const action = dashboardIndex >= 0 ? segments[dashboardIndex + 2] ?? '' : '';
    const editId = dashboardIndex >= 0 ? segments[dashboardIndex + 3] ?? '' : '';

    const hasModule = this.modules.some((item) => item.key === moduleKey);
    this.selectedModuleKey = hasModule ? moduleKey : '';
    this.currentEditId = this.selectedModuleKey ? editId : '';

    if (!this.selectedModuleKey) {
      this.currentAction = 'list';
      return;
    }

    if (action === 'new') {
      this.currentAction = 'new';
      return;
    }

    if (action === 'edit') {
      this.currentAction = 'edit';
      return;
    }

    this.currentAction = 'list';
  }

  protected logout(): void {
    this.authService.clearTokens();
    void this.router.navigateByUrl('/login');
  }
}
