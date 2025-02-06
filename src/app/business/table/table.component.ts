import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IntegrationService } from '../../services/integration.service';
import { Hotel } from '../../models/hotel';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  hotelForm: FormGroup;
  successMessage: string | null = null; // Corregir el nombre de la propiedad
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private integrationService: IntegrationService) {
    this.hotelForm = this.fb.group({
      operation: ['INSERT'],
      nombre: ['', Validators.required],
      nit: ['', Validators.required],
      rnt: ['', Validators.required],
      matriculaMercantil: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      nombreRepLegal: ['', Validators.required],
      telefonoRepLegal: ['', Validators.required],
      emailRepLegal: ['', [Validators.required, Validators.email]],
      nombreContacto: ['', Validators.required],
      telefonoContacto: ['', Validators.required],
      idMunicipio: [1]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.hotelForm.valid) {
      const hotelData: Hotel = this.hotelForm.value;
      this.integrationService.doRegisterHotel(hotelData).subscribe(response => {
        this.successMessage = 'Registro Exitoso'; // Corregir el nombre de la propiedad
        this.errorMessage = null;
        this.hotelForm.reset(); // Limpiar el formulario después de un registro exitoso
        setTimeout(() => {
          this.successMessage = null; // Corregir el nombre de la propiedad
        }, 3000); // Ocultar el mensaje después de 3 segundos
      }, error => {
        console.error('Error al registrar el hotel:', error);
        this.errorMessage = 'Error al registrar el hotel';
        this.successMessage = null; // Corregir el nombre de la propiedad
      });
    } else {
      this.hotelForm.markAllAsTouched(); // Marcar todos los campos como tocados para mostrar los errores
      console.log('Formulario inválido');
      console.log('Estado del formulario:', this.hotelForm); // Log para ver el estado del formulario
    }
  }
}