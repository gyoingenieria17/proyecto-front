import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginRequest } from '../models/login-request';
import { RegisterRequest } from '../models/register-request';
import { catchError, Observable } from 'rxjs';
import { LoginResponse } from '../models/login-response';

const API_URL_LOGIN = 'http://localhost:8081/api/v1/usuario/login';
const API_URL_REGISTER = 'http://localhost:8081/api/v1/usuario/insertar';
const API_URL_REGISTERHOTEL ='http://localhost:8082/api/v1/rabbitmq/send';
const API_URL_GETHOTEL = 'http://localhost:8082/api/v1/rabbitmq/hoteles';
const API_URL_REGISTERHABITACION='http://localhost:8084/api/v1/habitacion/rabbitmq/send';
const API_URL_GETHABITACION = 'http://localhost:8084/api/v1/habitaciones';
const API_URL_UPDATEHABITACION = 'http://localhost:8084/api/v1/habitacion/rabbitmq';

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {

  constructor(private http: HttpClient) { }

  doLogin(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_URL_LOGIN, request); // Usar la constante API_URL
  }
  
  doRegister(request: RegisterRequest): Observable<RegisterRequest> {
    return this.http.post<RegisterRequest>(API_URL_REGISTER, request); // Usar la constante API_URL
  }

  doRegisterHotel(request: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(API_URL_REGISTERHOTEL, request, { headers, responseType: 'text' }).pipe(
      catchError(error => {
        console.error('Error al registrar el hotel:', error);
        throw error;
      })
    );
  }

  doGetHotel(): Observable<any> {
    return this.http.get(API_URL_GETHOTEL); // Usar la constante API_URL
  }

  updateHotelStatus(idHotel: number, estado: boolean): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      operation: 'UPDATE',
      idHotel,
      estado
    };
    return this.http.post(API_URL_REGISTERHOTEL, body, { headers, responseType: 'text' }).pipe(
      catchError(error => {
        console.error('Error al actualizar el estado del hotel:', error);
        throw error;
      })
    );
  }

  doRegisterHabitacion(request: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(API_URL_REGISTERHABITACION, request, { headers, responseType: 'text' }).pipe(
      catchError(error => {
        console.error('Error al registrar la habitación:', error);
        throw error;
      })
    );
  }

  getHabitacionesByHotel(idHotel: number): Observable<any> {
    return this.http.get(`${API_URL_GETHABITACION}/${idHotel}`).pipe(
      catchError(error => {
        console.error('Error al obtener las habitaciones del hotel:', error);
        throw error;
      })
    );
  }

  doUpdateHabitacion(idHabitacion: number, estado: boolean): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { estado };
    const url = `${API_URL_UPDATEHABITACION}/${idHabitacion}`;
    return this.http.put(url, body, { headers, responseType: 'text' }).pipe(
      catchError(error => {
        console.error('Error al actualizar el estado de la habitación:', error);
        throw error;
      })
    );
  }
}