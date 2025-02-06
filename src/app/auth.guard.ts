import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('Verificando autenticación en AuthGuard...');

    if (this.authService.isLoggedIn()) {
      console.log('Usuario autenticado, acceso permitido');
      return true;
    } else {
      console.log('Usuario no autenticado, redirigiendo a /login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
