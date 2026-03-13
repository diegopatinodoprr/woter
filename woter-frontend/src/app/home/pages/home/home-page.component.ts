import { Component } from '@angular/core';
import { AuthenticationApiService } from '../../../services/authentication.service';

type WaterStatus = 'Excellente' | 'Stable' | 'Dégradée';

interface WaterZone {
  label: string;
  city: string;
  status: WaterStatus;
  quality: number;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  standalone: false
})
export class HomePageComponent {
  protected readonly quickActions = [
    { label: 'Connexion', icon: 'pi pi-user' },
    { label: 'Inscription', icon: 'pi pi-user-plus' },
    { label: 'Aide', icon: 'pi pi-question-circle' }
  ];
  protected readonly waterZones: WaterZone[] = [
    { label: 'Canal Saint-Martin', city: 'Paris', status: 'Excellente', quality: 95 },
    { label: 'Parc de la Tête d Or', city: 'Lyon', status: 'Stable', quality: 84 },
    { label: 'Vieux-Port', city: 'Marseille', status: 'Dégradée', quality: 61 }
  ];
  protected showLoginModal = false;
  protected loginValue = '';
  protected passwordValue = '';
  protected isSubmitting = false;
  protected loginError = '';

  private readonly authenticationService = new AuthenticationApiService();

  protected onQuickActionClick(action: string): void {
    if (action === 'Connexion') {
      this.openLoginModal();
    }
  }

  protected getStatusSeverity(status: WaterStatus): 'success' | 'warn' | 'danger' {
    if (status === 'Excellente') return 'success';
    if (status === 'Stable') return 'warn';
    return 'danger';
  }

  protected openLoginModal(): void {
    this.showLoginModal = true;
    this.loginError = '';
  }

  protected closeLoginModal(): void {
    this.showLoginModal = false;
    this.isSubmitting = false;
    this.loginError = '';
  }

  protected async submitLogin(): Promise<void> {
    if (!this.loginValue || !this.passwordValue) {
      this.loginError = 'Le login et le mot de passe sont obligatoires.';
      return;
    }

    this.isSubmitting = true;
    this.loginError = '';

    try {
      await this.authenticationService.login({
        email: this.loginValue,
        password: this.passwordValue
      });

      this.passwordValue = '';
      this.closeLoginModal();
    } catch {
      this.loginError = 'Connexion impossible, verifie tes identifiants.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
