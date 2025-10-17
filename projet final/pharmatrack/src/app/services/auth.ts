import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../Interfaces/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'http://localhost:3000';
  private _currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    // On interroge l'API pour trouver un utilisateur avec ce username/password
    return this.http.get<User[]>(`${this.base}/users?username=${username}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          const user = users[0];
          // On crée un token factice et on le stocke
          this._currentUser.set(user);
          const token = `${user.id}:${user.role}`;
          localStorage.setItem('token', token);
          return true; // Connexion réussie
        }
        return false; // Connexion échouée
      })
    );
  }

  logout() {
    this._currentUser.set(null);
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole(): 'admin' | 'user' | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    // Le token est sous la forme "id:role", on récupère la deuxième partie.
    return token.split(':')[1] as 'admin' | 'user';
  }

  currentUser() {
    return this._currentUser.asReadonly();
  }

  isAdmin(): boolean {
    return this._currentUser()?.role === 'admin';
  }
}
