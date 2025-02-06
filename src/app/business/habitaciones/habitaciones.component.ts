import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IntegrationService } from '../../services/integration.service';
import { PageEvent } from '@angular/material/paginator';
import { MatExpansionModule, MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatExpansionModule, MatPaginatorModule, RouterModule],
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css']
})
export class HabitacionesComponent implements OnInit {
  @ViewChild('accordion') accordion!: MatAccordion;
  @ViewChild('registerPanel') registerPanel!: MatExpansionPanel;
  @ViewChild('hotelPanel') hotelPanel!: MatExpansionPanel;

  habitacionForm: FormGroup;
  idHotel: number = 0; // Inicializar con un valor predeterminado
  tiposHabitacion: any[] = []; // Lista de tipos de habitación
  habitaciones: any[] = []; // Lista de habitaciones del hotel
  paginatedHabitaciones: any[] = []; // Lista de habitaciones paginadas
  filteredHabitaciones: any[] = []; // Lista de habitaciones filtradas
  pageSize = 10; // Tamaño de la página
  currentPage = 0; // Página actual
  filterText: string = ''; // Texto del filtro

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private integrationService: IntegrationService,
    private filterService: FilterService
  ) {
    this.habitacionForm = this.fb.group({
      numeroHabitacion: ['', Validators.required],
      descripcion: ['', Validators.required],
      capacidad: [null, [Validators.required, Validators.min(1)]],
      precioBase: [null, [Validators.required, Validators.min(0)]],
      tipoHabitacion: this.fb.group({
        idTipoHabitacion: [null, Validators.required]
      }),
      hotel: this.fb.group({
        idHotel: [null, Validators.required]
      })
    });
  }

  ngOnInit(): void {
    const idHotelParam = this.route.snapshot.paramMap.get('idHotel');
    if (idHotelParam !== null) {
      this.idHotel = +idHotelParam;
      this.habitacionForm.get('hotel.idHotel')?.setValue(this.idHotel);
      this.loadHabitaciones();
    }

    // Cargar los tipos de habitación (esto es solo un ejemplo, ajusta según tu implementación)
    this.loadTiposHabitacion();

    // Suscribirse al filtro
    this.filterService.filter$.subscribe(filterText => {
      this.filterText = filterText;
      this.applyFilter();
    });
  }

  loadTiposHabitacion(): void {
    this.tiposHabitacion = [
      { idTipoHabitacion: 1, nombre: 'Simple' },
      { idTipoHabitacion: 2, nombre: 'Doble' },
      { idTipoHabitacion: 3, nombre: 'Suite' }
    ];
  }

  loadHabitaciones(): void {
   // console.log('Cargando habitaciones...');
    this.habitaciones = [];
    this.filteredHabitaciones = [];
    this.paginatedHabitaciones = [];
    this.integrationService.getHabitacionesByHotel(this.idHotel).subscribe({
      next: data => {
        //console.log('Habitaciones cargadas:', data);
        this.habitaciones = data;
        this.filteredHabitaciones = data;
        this.paginateHabitaciones();
      },
      error: error => {
        console.error('Error al cargar las habitaciones:', error);
      }
    });
  }

  paginateHabitaciones(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedHabitaciones = this.filteredHabitaciones.slice(startIndex, endIndex);
    console.log('Habitaciones paginadas:', this.paginatedHabitaciones);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateHabitaciones();
  }

  onSubmit(): void {
    if (this.habitacionForm.valid) {
      const habitacionData = this.habitacionForm.value;
      habitacionData.estado = true; // Establecer el estado como true
      this.integrationService.doRegisterHabitacion(habitacionData).subscribe({
        next: response => {
          //console.log('Registro Exitoso:', response);
          this.habitacionForm.reset();
          this.habitacionForm.get('hotel.idHotel')?.setValue(this.idHotel); // Mantener el idHotel después de resetear el formulario
          this.integrationService.getHabitacionesByHotel(this.idHotel).subscribe({
            next: data => {
              //console.log('Habitaciones cargadas:', data);
              this.habitaciones = data;
              this.filteredHabitaciones = data;
              this.paginateHabitaciones();
              this.registerPanel.close(); // Cerrar el panel de registro
              this.hotelPanel.open(); // Abrir el panel de habitaciones del hotel
            },
            error: error => {
              console.error('Error al cargar las habitaciones:', error);
            }
          });
        },
        error: error => {
          console.error('Error al registrar la habitación:', error);
        }
      });
    } else {
      this.habitacionForm.markAllAsTouched(); // Marcar todos los campos como tocados para mostrar los errores
    }
  }

  toggleEstado(habitacion: any): void {
    habitacion.estado = !habitacion.estado;
    this.integrationService.doUpdateHabitacion(habitacion.idHabitacion, habitacion.estado).subscribe({
      next: response => {
        console.log('Estado actualizado:', response);
        this.loadHabitaciones(); // Recargar las habitaciones después de actualizar el estado
      },
      error: error => {
        console.error('Error al actualizar el estado de la habitación:', error);
      }
    });
  }

  applyFilter(): void {
    const filterValue = this.filterText.toLowerCase();
    this.filteredHabitaciones = this.habitaciones.filter(habitacion =>
      habitacion.numeroHabitacion.toLowerCase().includes(filterValue) ||
      habitacion.descripcion.toLowerCase().includes(filterValue) ||
      habitacion.capacidad.toString().includes(filterValue) ||
      habitacion.precioBase.toString().includes(filterValue) ||
      habitacion.tipoHabitacion?.nombre.toLowerCase().includes(filterValue)
    );
    this.paginateHabitaciones();
  }
}