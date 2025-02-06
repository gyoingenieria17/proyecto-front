import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IntegrationService } from '../../services/integration.service';
import { FilterService } from '../../services/filter.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-hotels',
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './list-hotels.component.html',
  styleUrls: ['./list-hotels.component.css']
})
export class ListHotelsComponent implements OnInit, OnDestroy {
  hotels: any[] = [];
  filteredHotels: any[] = [];
  paginatedHotels: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  filterSubscription: Subscription = new Subscription();

  constructor(private integrationService: IntegrationService, private filterService: FilterService, private router: Router) { }

  ngOnInit(): void {
    this.loadHotels();
    this.filterSubscription = this.filterService.filter$.subscribe(filter => {
      this.applyFilter(filter);
    });
  }

  ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
  }

  loadHotels(): void {
    this.integrationService.doGetHotel().subscribe(data => {
      this.hotels = data;
      this.filteredHotels = this.hotels;
      this.totalItems = this.filteredHotels.length;
      this.paginateHotels();
    });
  }

  applyFilter(filter: string): void {
    this.filteredHotels = this.hotels.filter(hotel => 
      hotel.nombre.toLowerCase().includes(filter.toLowerCase()) ||
      hotel.nit.toLowerCase().includes(filter.toLowerCase()) ||
      hotel.rnt.toLowerCase().includes(filter.toLowerCase()) ||
      hotel.direccion.toLowerCase().includes(filter.toLowerCase()) ||
      hotel.nombreRepLegal.toLowerCase().includes(filter.toLowerCase()) ||
      hotel.telefono.toLowerCase().includes(filter.toLowerCase())
    );
    this.totalItems = this.filteredHotels.length;
    this.currentPage = 1;
    this.paginateHotels();
  }

  paginateHotels(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedHotels = this.filteredHotels.slice(startIndex, endIndex);
  }

  toggleHotelStatus(hotel: any): void {
    hotel.estado = !hotel.estado;
    this.integrationService.updateHotelStatus(hotel.idHotel, hotel.estado).subscribe(
      response => {
        console.log(`Hotel ID: ${hotel.idHotel} actualizado exitosamente. Nuevo Estado: ${hotel.estado}`);
      },
      error => {
        console.error('Error al actualizar el estado del hotel:', error);
        hotel.estado = !hotel.estado;
      }
    );
  }

  viewRooms(hotel: any): void {
    this.router.navigate(['/layout/habitaciones', hotel.idHotel]);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.paginateHotels();
  }
}