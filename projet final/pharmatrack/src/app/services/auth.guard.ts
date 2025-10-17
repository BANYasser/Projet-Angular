import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authSvc = inject(AuthService);
  const router = inject(Router);

  if (authSvc.isLoggedIn()) {
    // L'utilisateur est connecté, on l'autorise à accéder à la page
    return true;
  }

  // L'utilisateur n'est pas connecté, on le redirige vers la page de login
  router.navigate(['/login']);
  return false;
};
