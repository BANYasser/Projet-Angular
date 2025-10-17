import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Récupère le token depuis le localStorage
  const token = localStorage.getItem('token');

  // Si le token existe, on clone la requête pour y ajouter le header d'autorisation
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` 
      }
    });
    // On passe la requête clonée (avec le token) à la suite
    return next(clonedReq);
  }

  // Si pas de token, on laisse passer la requête originale 
  return next(req);
};
