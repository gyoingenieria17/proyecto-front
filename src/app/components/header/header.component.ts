import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username: string | null = '';

  constructor(private authService: AuthService, private router: Router, private filterService: FilterService) {}

  ngOnInit() {
    this.username = localStorage.getItem('username');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onFilterChange(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterService.setFilter(filterValue);
  }
}