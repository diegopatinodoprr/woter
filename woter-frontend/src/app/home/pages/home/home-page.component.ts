import { Component } from '@angular/core';
import { AuthenticationApiService } from '../../../services/authentication.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  standalone: false
})
export class HomePageComponent {
  protected readonly quickActions = ['Connexion', 'Inscription', 'Aide'];
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
      const response = await this.authenticationService.login({
        email: this.loginValue,
        password: this.passwordValue
      });

      localStorage.setItem('woter_access_token', response.tokens.accessToken);
      if (response.tokens.refreshToken) {
        localStorage.setItem('woter_refresh_token', response.tokens.refreshToken);
      }

      this.passwordValue = '';
      this.closeLoginModal();
    } catch {
      this.loginError = 'Connexion impossible, verifie tes identifiants.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
