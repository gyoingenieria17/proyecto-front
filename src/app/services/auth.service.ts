import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isLoggedIn(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    const token = localStorage.getItem('authToken');
    console.log('Token detectado en isLoggedIn:', token);
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem('authToken');
  }

  login(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('authToken', token);
      console.log('Token almacenado en localStorage:', token);
    }
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  private isTokenExpired(token: string | null): boolean {
    if (!token) {
      return true;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el JWT
      const expiration = payload.exp * 1000; // Convierte a milisegundos
      console.log('Fecha de expiración del token:', new Date(expiration));
      return Date.now() > expiration; // Verifica si está expirado
    } catch (e) {
      console.error('Error verificando el token:', e);
      return true; // Si hay un error, asumimos que el token es inválido
    }
  }
}