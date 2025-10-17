import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authSvc = inject(AuthService);
  const router = inject(Router);

  // On vérifie si l'utilisateur a bien le rôle 'admin'
  if (authSvc.getUserRole() === 'admin') {
    return true; // Accès autorisé
  }

  // Si ce n'est pas un admin, on le redirige (par exemple vers le dashboard)
  router.navigate(['/dashboard']);
  return false; // Accès refusé
};
