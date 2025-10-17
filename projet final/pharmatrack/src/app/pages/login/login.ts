import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true, // Important: on passe le composant en standalone
  imports: [
    CommonModule, // Pour utiliser ngIf, ngFor, etc.
    FormsModule, // Pour gérer le formulaire avec [(ngModel)]
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  // On injecte les services dont on a besoin
  private authSvc = inject(AuthService);
  private router = inject(Router);

  // Propriétés pour stocker les valeurs des champs du formulaire
  username = '';
  password = '';
  error = '';

  onLogin() {
    this.authSvc.login(this.username, this.password).subscribe(success => {
      if (success) {
        // Si la connexion réussit, on navigue vers le dashboard
        this.router.navigate(['/dashboard']);
      } else {
        // Sinon, on affiche un message d'erreur
        this.error = 'Nom d\'utilisateur ou mot de passe incorrect.';
      }
    });
  }
}
