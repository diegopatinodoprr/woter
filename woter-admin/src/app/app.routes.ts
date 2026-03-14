import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LoginComponent } from './modules/login/login.component';
import { AuthApiService } from './services/auth.service';

const loginGuard: CanActivateFn = () => {
  const authService = new AuthApiService();
  if (authService.hasAccessToken()) {
    return inject(Router).createUrlTree(['/dashboard']);
  }
  return true;
};

const dashboardGuard: CanActivateFn = () => {
  const authService = new AuthApiService();
  if (!authService.hasAccessToken()) {
    return inject(Router).createUrlTree(['/login']);
  }
  return true;
};

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [dashboardGuard] },
  { path: '**', redirectTo: 'login' }
];
