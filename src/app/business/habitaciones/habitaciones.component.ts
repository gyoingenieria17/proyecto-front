import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IntegrationService } from '../../services/integration.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatAccordion, MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { Observable } from 'rxjs';
import { FilterService } from '../../services/filter.service';
import { TipoHabitacion } from '../../models/tipo-habitacion';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-habitaciones',
  imports: [
    MatAccordion,
    MatExpansionModule,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    MatPaginator
  ],
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css']
})
export class HabitacionesComponent implements OnInit {
  @ViewChild('accordion') accordion!: MatAccordion;
  @ViewChild('registerPanel') registerPanel!: MatExpansionPanel;
  @ViewChild('hotelPanel') hotelPanel!: MatExpansionPanel;
  @ViewChild('disponibilidadPanel') disponibilidadPanel!: MatExpansionPanel;

  habitacionForm: FormGroup;
  idHotel: number = 0;
  tiposHabitacion: any[] = [];
  habitaciones: any[] = [];
  paginatedHabitaciones: any[] = [];
  filteredHabitaciones: any[] = [];
  cantidadesPorTipo: any[] = [];
  paginatedCantidadesPorTipo: any[] = [];
  pageSize = 10;
  currentPage = 0;
  filterText: string = '';

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

    this.loadTiposHabitacion();
    this.loadCantidadesPorTipo();

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
    //console.log('Cargando habitaciones...');
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

  loadCantidadesPorTipo(): void {
    const fecha = new Date().toISOString().split('T')[0];
    this.integrationService.getDisponibilidadPorTipo(1, fecha, fecha).subscribe({
      next: (data: TipoHabitacion[]) => {
        this.cantidadesPorTipo = data
          .filter((tipo: TipoHabitacion) => tipo.idHotel === this.idHotel)
          .map((tipo: TipoHabitacion) => ({
            nombre: tipo.tipo,
            disponibles: tipo.disponibles,
            noDisponibles: tipo.noDisponibles,
            total: tipo.disponibles + tipo.noDisponibles
          }));
        this.paginateCantidadesPorTipo();
      },
      error: error => {
        console.error('Error al cargar las cantidades por tipo:', error);
      }
    });
  }

  paginateHabitaciones(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedHabitaciones = this.filteredHabitaciones.slice(startIndex, endIndex);
    //console.log('Habitaciones paginadas:', this.paginatedHabitaciones);
  }

  paginateCantidadesPorTipo(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCantidadesPorTipo = this.cantidadesPorTipo.slice(startIndex, endIndex);
    //console.log('Cantidades por tipo paginadas:', this.paginatedCantidadesPorTipo);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateHabitaciones();
  }

  onPageChangeDisponibilidad(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateCantidadesPorTipo();
  }

  onSubmit(): void {
    if (this.habitacionForm.valid) {
      const habitacionData = this.habitacionForm.value;
      habitacionData.estado = true;
      this.integrationService.doRegisterHabitacion(habitacionData).subscribe({
        next: response => {
          //console.log('Registro Exitoso:', response);
          this.habitacionForm.reset();
          this.habitacionForm.get('hotel.idHotel')?.setValue(this.idHotel);
          this.loadHabitaciones();
          this.registerPanel.close();
          setTimeout(() => {
            this.hotelPanel.open();
          }, 1000);
        },
        error: error => {
          console.error('Error al registrar la habitación:', error);
        }
      });
    } else {
      this.habitacionForm.markAllAsTouched();
    }
  }

  toggleEstado(habitacion: any): void {
    habitacion.estado = !habitacion.estado;
    this.integrationService.doUpdateHabitacion(habitacion.idHabitacion, habitacion.estado).subscribe({
      next: response => {
        //console.log('Estado actualizado:', response);
        this.loadHabitaciones();
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