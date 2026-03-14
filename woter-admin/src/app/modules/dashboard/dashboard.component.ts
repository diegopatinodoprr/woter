import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import type { Type } from '@angular/core';
import { GENERATED_MODULES } from '../../generated/registry';
import { AuthApiService } from '../../services/auth.service';
import { GlobalViewComponent } from '../global-view/global-view.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, NgComponentOutlet, DividerModule, ButtonModule, InputTextModule, GlobalViewComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  protected readonly modules = GENERATED_MODULES;
  protected selectedModuleKey = '';
  protected selectedComponent: Type<unknown> | null = null;
  protected readonly logoPath = 'assets/images/water.png';
  protected readonly connectedUserName: string;
  private readonly authService = new AuthApiService();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.connectedUserName = this.authService.getConnectedUserName();
    this.route.queryParamMap.subscribe((params) => {
      const requested = params.get('module');
      const selected = requested ? this.modules.find((item) => item.key === requested) : undefined;
      this.selectedModuleKey = selected?.key ?? '';
      this.selectedComponent = selected?.component ?? null;
    });
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

  protected logout(): void {
    this.authService.clearTokens();
    void this.router.navigateByUrl('/login');
  }
}
