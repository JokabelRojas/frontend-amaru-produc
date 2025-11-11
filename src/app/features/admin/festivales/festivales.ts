import { Component } from '@angular/core';
import { CommonModule, DatePipe, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ModalFestival } from './modal-festival/modal-festival';
import { ModalPremio } from './modal-premio/modal-premio';
import { FestivalesService } from '../../cliente/services/festivales.service';
import { Festival } from '../../cliente/models/festival.model';
import { Premio } from '../../cliente/models/premio.model';

@Component({
  selector: 'app-festivales',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, NgClass, MatDialogModule],
  templateUrl: './festivales.html',
  styleUrls: ['./festivales.css'],
  providers: [DatePipe]
})
export class Festivales {
  festivales: Festival[] = [];
  premios: Premio[] = [];

  constructor(private dialog: MatDialog, private festivalesService: FestivalesService) {
    this.cargarFestivales();
    this.cargarPremios();
  }

  abrirModalFestival(festival?: Festival) {
    const dialogRef = this.dialog.open(ModalFestival, { data: festival });
    dialogRef.afterClosed().subscribe(() => this.cargarFestivales());
  }

  abrirModalPremio(premio?: Premio) {
    const dialogRef = this.dialog.open(ModalPremio, { data: { premio, festivales: this.festivales } });
    dialogRef.afterClosed().subscribe(() => this.cargarPremios());
  }

  cargarFestivales() {
    this.festivalesService.getFestivales().subscribe(f => this.festivales = f);
  }

  cargarPremios() {
    this.festivalesService.getPremios().subscribe(p => this.premios = p);
  }

 getPremiosPorFestival(festivalId?: string) {
  if (!festivalId) return [];  // evita undefined
  return this.premios.filter(p => p.festival === festivalId);
}

}
