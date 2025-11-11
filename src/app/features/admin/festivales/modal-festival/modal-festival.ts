import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FestivalesService } from '../../../cliente/services/festivales.service';
import { Festival } from '../../../cliente/models/festival.model';

@Component({
  selector: 'app-modal-festival',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-festival.html',
})
export class ModalFestival {
  form: FormGroup;

  categorias = [
    { _id: '1', nombre: 'Musical' },
    { _id: '2', nombre: 'Cultural' },
    { _id: '3', nombre: 'Deportivo' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalFestival>,
    private festivalesService: FestivalesService,
    @Inject(MAT_DIALOG_DATA) public data?: Festival
  ) {
    this.form = this.fb.group({
      titulo: [data?.titulo ?? '', Validators.required],
      descripcion: [data?.descripcion ?? '', Validators.required],
      fecha_evento: [data?.fecha_evento ?? '', Validators.required],
      lugar: [data?.lugar ?? '', Validators.required],
      organizador: [data?.organizador ?? '', Validators.required],
      tipo: [data?.tipo ?? 'musical', Validators.required],
      id_categoria: [data?.id_categoria ?? '', Validators.required],
    });
  }

  submit() {
    if (this.form.valid) {
      // Forzamos tipado correcto para TS
      const festival: Festival = this.form.value as Festival;

      this.festivalesService.createFestival(festival).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}
