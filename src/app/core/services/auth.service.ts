  import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { environment } from '../../../environments/environment';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  import { isPlatformBrowser } from '@angular/common';

  @Injectable({
    providedIn: 'root'
  })
  export class AuthService {
    private tokenKey = 'access_token';

    constructor(
      private http: HttpClient,
      @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    private isBrowser(): boolean {
      return isPlatformBrowser(this.platformId);
    }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}auth/login`, { email, password }).pipe(
      tap((res: any) => {
        if (res.access_token && this.isBrowser()) {
          localStorage.setItem(this.tokenKey, res.access_token);
          // Guardar datos completos del usuario
          if (res.user) {
            localStorage.setItem('user_data', JSON.stringify(res.user));
          }
        }
      })
    );
  }

    getToken(): string | null {
      return this.isBrowser() ? localStorage.getItem(this.tokenKey) : null;
    }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem('user_data');
    }
  }

    isAuthenticated(): boolean {
      return !!this.getToken();
    }

    registrarUsuarioSinContraseña(usuarioData: {
      nombre: string;
      apellido: string;
      dni: string;
      email: string;
      telefono: string;
      direccion: string;
    }): Observable<any> {
      return this.http.post(`${environment.apiUrl}auth/register-sin-password`, usuarioData);
    }

  loginSinContraseña(email: string): Observable<any> {
    const url = `${environment.apiUrl}auth/login-sin-password`.replace(/([^:]\/)\/+/g, '$1');
    return this.http.post(url, { email }).pipe(
      tap((res: any) => {
        if (res.access_token && this.isBrowser()) {
          localStorage.setItem(this.tokenKey, res.access_token);
          // Guardar datos completos del usuario
          if (res.user) {
            localStorage.setItem('user_data', JSON.stringify(res.user));
          }
        }
      })
    );
  }

  getUserData(): any {
    if (this.isBrowser()) {
      try {
        const userData = localStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        return null;
      }
    }
    return null;
  }
  }