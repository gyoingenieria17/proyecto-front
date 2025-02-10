import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './business/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard'; // Importa el guardia de autenticación
import { TableComponent } from './business/table/table.component';
import { ListHotelsComponent } from './business/list-hotels/list-hotels.component';
import { SolicitudesComponent } from './business/solicitudes/solicitudes.component';
import { HabitacionesComponent } from './business/habitaciones/habitaciones.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'layout',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'table', component: TableComponent },
      { path: 'list-hotels', component: ListHotelsComponent },
      { path: 'solicitudes', component: SolicitudesComponent },
      { path: 'habitaciones/:idHotel', component: HabitacionesComponent } // Actualizar la ruta para aceptar idHotel
    ]
  },
  { path: '**', redirectTo: 'login' }  // Redirección en caso de rutas no encontradas
];