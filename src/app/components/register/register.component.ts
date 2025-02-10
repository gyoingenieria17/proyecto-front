import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IntegrationService } from '../../services/integration.service';
import { RegisterRequest } from '../../models/register-request';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null; // Mensaje de éxito
  userExists: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private integrationService: IntegrationService,
    private router: Router // Importar el servicio Router
  ) {
    this.registerForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      usuario: ['', [Validators.required]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      confirmarClave: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const request: RegisterRequest = {
        nombre: this.registerForm.get('nombre')?.value,
        email: this.registerForm.get('email')?.value,
        telefono: this.registerForm.get('telefono')?.value,
        usuario: this.registerForm.get('usuario')?.value,
        clave: this.registerForm.get('clave')?.value,
        estado: true,
        rol: {
          id: 2 // Asignar el rol correspondiente
        }
      };

      this.integrationService.doRegister(request).subscribe(
        response => {
          console.log('Registro exitoso:', response);
          this.errorMessage = null;
          this.userExists = false;
          this.successMessage = 'Registro exitoso. Redirigiendo al inicio de sesión...';
          // Redirigir al usuario a la página de inicio de sesión después de 3 segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error => {
          console.log('Error en el registro:', error);
          if (error.status === 400) {
            this.errorMessage = 'El usuario ya existe. No se puede registrar.';
            this.userExists = true;
          } else {
            this.errorMessage = 'Ocurrió un error en el registro. Inténtalo de nuevo.';
            this.userExists = false;
          }
        }
      );
    } else {
      this.registerForm.markAllAsTouched(); // Marcar todos los campos como tocados
      console.log('Formulario no válido');
    }
  }

  // Método para verificar si las claves coinciden
  get passwordsMatch(): boolean {
    return this.registerForm.get('clave')?.value === this.registerForm.get('confirmarClave')?.value;
  }
}