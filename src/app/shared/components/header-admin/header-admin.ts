import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header-admin',
  imports: [MatIconModule],
  templateUrl: './header-admin.html',
  styleUrl: './header-admin.css'
})
export class HeaderAdmin {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    // Redirigir al login o página principal
    this.router.navigate(['/login']);
  }
}