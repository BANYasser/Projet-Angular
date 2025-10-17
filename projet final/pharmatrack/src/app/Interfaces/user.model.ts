export interface User {
  id: number;
  username: string;
  password?: string; // Le mot de passe est optionnel dans le modèle, on ne le manipule pas partout
  role: 'admin' | 'user';
}
