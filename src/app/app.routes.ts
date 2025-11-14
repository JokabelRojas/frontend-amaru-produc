import { Routes } from '@angular/router';

// Páginas públicas
import { Dashboard } from './features/pages/dashboard/dashboard';
import { Login } from './features/auth/login/login';

// Secciones visibles desde el header
import { Talleres } from './features/admin/talleres/talleres';
import { Festivales } from './features/admin/festivales/festivales';
import { Servicios } from './features/admin/servicios/servicios';
import { Inscripciones } from './features/admin/inscripciones/inscripciones';

// Panel administrativo
import { PanelAdmin } from './features/pages/panel-admin/panel-admin';
import { PanelAdministracion } from './features/admin/panel-administracion/panel-administracion';
import { Categoria } from './features/admin/categoria/categoria';

// Guard
import { AuthGuard } from './core/guards/auth.guard';
import { Profesor } from './features/admin/profesor/profesor';
import { Actividades } from './features/admin/actividades/actividades';
import { Premios } from './features/admin/premios/premios';

export const routes: Routes = [
  // Página principal
  {
    path: '',
    component: Dashboard,
    pathMatch: 'full'
  },

  // Login público
  {
    path: 'login',
    component: Login
  },

  // Páginas públicas accesibles desde el header
  {
    path: 'talleres',
    loadComponent: () => import('./features/cliente/components/talleres/talleres').then(m => m.Talleres)
  },
  {
    path: 'festivales',
    loadComponent: () => import('./features/cliente/components/festivales/festivales').then(m=> m.Festivales)
  },
  {
    path: 'servicios',
    loadComponent: () => import('./features/cliente/components/servicios/servicios').then(m=> m.Servicios)
  },
  {
    path: 'contacto',
    loadComponent: () => import('./features/cliente/components/contacto/contacto').then(m => m.Contacto)
    // si aún no tienes el componente Contacto, puedes crearlo o comentar esta ruta
  },
  {
    path: 'talleres/inscripciones',
    component: Inscripciones
  },

  // Panel administrativo (rutas protegidas)
  {
    path: 'panel',
    component: PanelAdmin,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'panel-administracion',
        component: PanelAdministracion
      },
      {
        path: 'categoria',
        component: Categoria
      },
            {
        path: 'profesor',
        component: Profesor
      },
      {
        path: 'talleres',
        component: Talleres
      },
      {
        path: 'actividades',
        component: Actividades
      },
      {
        path: 'festivales',
        component: Festivales
      },
            {
        path: 'premios',
        component: Premios
      },
      {
        path: 'servicios',
        component: Servicios
      },
      {
        path: 'inscripciones',
        component: Inscripciones
      }
    ]
  },

  // Redirección por defecto
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
