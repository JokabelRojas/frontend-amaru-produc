import { Component } from '@angular/core';
import { HeaderAdmin } from '../../../../shared/components/header-admin/header-admin';
import { HeaderCliente } from '../../../../shared/components/header-cliente/header-cliente';

@Component({
  selector: 'app-contacto',
  imports: [HeaderCliente],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css'
})
export class Contacto {

}
