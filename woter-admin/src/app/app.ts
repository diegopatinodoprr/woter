import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';

type CityStatus = 'Online' | 'Maintenance' | 'Offline';

interface DashboardCity {
  name: string;
  status: CityStatus;
  quality: number;
  alerts: number;
}

@Component({
  selector: 'app-root',
  imports: [CardModule, ButtonModule, TagModule, ProgressBarModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected isDarkMode = false;
  protected readonly cities: DashboardCity[] = [
    { name: 'Paris', status: 'Online', quality: 93, alerts: 1 },
    { name: 'Lyon', status: 'Maintenance', quality: 68, alerts: 4 },
    { name: 'Marseille', status: 'Online', quality: 89, alerts: 2 },
    { name: 'Bordeaux', status: 'Offline', quality: 0, alerts: 6 }
  ];

  protected getStatusSeverity(status: CityStatus): 'success' | 'warn' | 'danger' {
    if (status === 'Online') return 'success';
    if (status === 'Maintenance') return 'warn';
    return 'danger';
  }

  ngOnInit(): void {
    const savedTheme = this.getSavedTheme();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark;
    this.applyThemeClass();
  }

  protected toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('woter-admin-theme', this.isDarkMode ? 'dark' : 'light');
    this.applyThemeClass();
  }

  private applyThemeClass(): void {
    document.documentElement.classList.toggle('app-dark', this.isDarkMode);
  }

  private getSavedTheme(): 'light' | 'dark' | null {
    const value = localStorage.getItem('woter-admin-theme');
    if (value === 'light' || value === 'dark') return value;
    return null;
  }
}
