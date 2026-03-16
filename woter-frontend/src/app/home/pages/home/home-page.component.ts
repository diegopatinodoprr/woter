import { Component, HostListener, ViewChild } from '@angular/core';
import { AuthenticationApiService } from '../../../services/authentication.service';
import { HomeMapComponent } from '../../components/map/map.component';

type WaterStatus = 'Excellente' | 'Stable' | 'Dégradée';

interface WaterZone {
  label: string;
  city: string;
  status: WaterStatus;
  quality: number;
}

interface NominatimSearchResult {
  lat: string;
  lon: string;
  display_name: string;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  standalone: false
})
export class HomePageComponent {
  @ViewChild(HomeMapComponent)
  private homeMapComponent?: HomeMapComponent;

  protected readonly quickActions = [
    { label: 'Connexion', icon: 'pi pi-user' },
    { label: 'Inscription', icon: 'pi pi-user-plus' },
    { label: 'Aide', icon: 'pi pi-question-circle' }
  ];
  protected searchQuery = '';
  protected isSearching = false;
  protected searchError = '';
  protected isMobileView = this.computeIsMobileView();
  protected showMobileMenu = false;
  protected headerWaveX = 0;
  protected headerWaveY = 0;
  protected headerWaveTilt = 0;
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
  private searchAbortController: AbortController | null = null;

  protected onQuickActionClick(action: string): void {
    if (action === 'Connexion') {
      this.openLoginModal();
    }
  }

  protected toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  protected closeMobileMenu(): void {
    this.showMobileMenu = false;
  }

  protected onMobileActionClick(action: string): void {
    this.onQuickActionClick(action);
    this.closeMobileMenu();
  }

  protected async startSearch(): Promise<void> {
    const trimmedQuery = this.searchQuery.trim();
    if (!trimmedQuery) {
      this.searchError = 'Saisissez un lieu pour lancer la recherche.';
      return;
    }

    this.searchError = '';
    this.isSearching = true;
    this.searchAbortController?.abort();
    this.searchAbortController = new AbortController();

    try {
      const queryParams = new URLSearchParams({
        q: trimmedQuery,
        format: 'jsonv2',
        limit: '1'
      });

      const response = await fetch(`https://nominatim.openstreetmap.org/search?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        },
        signal: this.searchAbortController.signal
      });

      if (!response.ok) {
        throw new Error('search_failed');
      }

      const results = (await response.json()) as NominatimSearchResult[];
      if (!results.length) {
        this.searchError = 'Aucun resultat trouve pour cette recherche.';
        return;
      }

      const firstResult = results[0];
      const latitude = Number(firstResult.lat);
      const longitude = Number(firstResult.lon);

      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        this.searchError = 'Resultat invalide recu depuis le service de recherche.';
        return;
      }

      this.homeMapComponent?.centerOnCoordinates(latitude, longitude, firstResult.display_name);
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return;
      }

      this.searchError = 'Recherche indisponible pour le moment. Reessayez dans un instant.';
    } finally {
      this.isSearching = false;
    }
  }

  protected useMyPosition(): void {
    this.searchError = '';
    this.homeMapComponent?.requestUserLocation();
  }

  protected onHeaderMouseMove(event: MouseEvent): void {
    if (this.isMobileView) {
      return;
    }

    const currentTarget = event.currentTarget as HTMLElement | null;
    if (!currentTarget) {
      return;
    }

    const rect = currentTarget.getBoundingClientRect();
    const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;

    this.headerWaveX = normalizedX * 28;
    this.headerWaveY = normalizedY * 12;
    this.headerWaveTilt = normalizedX * 3;
  }

  protected resetHeaderWave(): void {
    this.headerWaveX = 0;
    this.headerWaveY = 0;
    this.headerWaveTilt = 0;
  }

  @HostListener('window:resize')
  protected onWindowResize(): void {
    this.isMobileView = this.computeIsMobileView();
    if (!this.isMobileView) {
      this.showMobileMenu = false;
      return;
    }

    this.resetHeaderWave();
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

  private computeIsMobileView(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia('(max-width: 768px)').matches;
  }
}
