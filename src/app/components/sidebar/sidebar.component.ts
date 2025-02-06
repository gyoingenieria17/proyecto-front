import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isSidebarHidden = true;

  constructor(private authService: AuthService, private router: Router) {}

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}