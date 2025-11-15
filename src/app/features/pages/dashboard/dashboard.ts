import { Component } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { HeaderCliente } from '../../../shared/components/header-cliente/header-cliente';
import { Carrusel } from '../../cliente/components/carrusel/carrusel';
import { Mision } from "../../cliente/components/mision/mision";
import { Vision } from "../../cliente/components/vision/vision";
import { Servicios } from "../../cliente/components/servicios/servicios";
import { Convenios } from "../../cliente/components/convenios/convenios";
import { Servicios2 } from '../../cliente/components/servicios2/servicios2';
import { FooterCliente } from '../../../shared/components/footer-cliente/footer-cliente';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderCliente, Carrusel, Mision, Vision, Servicios2 , Convenios, FooterCliente],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
