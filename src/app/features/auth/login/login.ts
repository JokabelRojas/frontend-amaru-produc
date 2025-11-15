import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';
  emailCliente = '';
  
  showRegisterModal = false;
  showLoginClienteModal = false;
  
  clienteData = {
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    telefono: '',
    direccion: ''
  };

  constructor(private router: Router, private authService: AuthService) {}

  // Login normal
  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/panel/panel-administracion']); // Redirige a la página principal
      },
      error: () => {
        alert('Login failed');
      }
    });
  }

  // Abrir modal de registro
  openRegisterModal() {
    this.showRegisterModal = true;
    this.showLoginClienteModal = false;
  }

  // Abrir modal de login cliente
  openLoginClienteModal() {
    this.showLoginClienteModal = true;
    this.showRegisterModal = false;
  }

  // Cerrar modales
  closeModals() {
    this.showRegisterModal = false;
    this.showLoginClienteModal = false;
    this.resetClienteData();
  }

  // Registrar cliente sin contraseña
  registrarCliente() {
    this.authService.registrarUsuarioSinContraseña(this.clienteData).subscribe({
      next: (response) => {
        alert('Cliente registrado exitosamente');
        this.closeModals();
        this.resetClienteData();
        
        // Opcional: Auto-login después del registro
        this.authService.loginSinContraseña(this.clienteData.email).subscribe({
          next: () => {
            this.router.navigate(['/']); // Redirige a la página principal
          },
          error: () => {
            // El registro fue exitoso pero el login automático falló
            // El usuario puede hacer login manualmente después
          }
        });
      },
      error: (error) => {
        alert('Error al registrar cliente: ' + (error.error?.message || 'Intente nuevamente'));
      }
    });
  }

  // Login cliente sin contraseña
  loginCliente() {
    if (!this.emailCliente) {
      alert('Por favor ingrese su correo');
      return;
    }

    this.authService.loginSinContraseña(this.emailCliente).subscribe({
      next: () => {
        this.router.navigate(['/']); // Redirige a la página principal
      },
      error: () => {
        alert('Login failed. Verifique su correo electrónico.');
      }
    });
  }

  // Resetear datos del formulario de cliente
  private resetClienteData() {
    this.clienteData = {
      nombre: '',
      apellido: '',
      dni: '',
      email: '',
      telefono: '',
      direccion: ''
    };
    this.emailCliente = '';
  }
}