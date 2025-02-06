import { Component } from '@angular/core';
import { IntegrationService } from '../../services/integration.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginRequest } from '../../models/login-request';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  request: LoginRequest = new LoginRequest();

  constructor(private integration: IntegrationService, private router: Router, private authService: AuthService) {}

  userForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  doLogin() {
    const formValue = this.userForm.value;

    if (this.userForm.invalid) {
      alert('Error de Credenciales');
      this.userForm.markAllAsTouched(); // Marcar todos los campos como tocados
      return;
    }

    this.request.usuario = formValue.username;
    this.request.clave = formValue.password;

    this.integration.doLogin(this.request).subscribe({
      next: (res) => {
        console.log("Recibido:", res); // Imprimir el objeto completo

        // Verificar si la respuesta contiene el token y el nombre de usuario
        if (res && res.token && res.username) {
          localStorage.setItem('authToken', res.token); // Almacenar el token de autenticación
          localStorage.setItem('username', res.username); // Almacenar el nombre de usuario
          this.router.navigate(['/layout/dashboard']); // Redirigir al componente Layout
        } else {
          alert('Error en el inicio de sesión: Token o nombre de usuario no encontrado');
        }
      },
      error: (err) => {
        console.log("Error:", err); // Imprimir el objeto de error completo
        alert('Error en el inicio de sesión');
      }
    });
  }
}