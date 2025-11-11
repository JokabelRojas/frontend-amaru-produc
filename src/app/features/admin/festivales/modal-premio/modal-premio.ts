import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FestivalesService } from '../../../cliente/services/festivales.service';
import {  Festival, } from '../../../cliente/models/festival.model';
import  {Premio} from '../../../cliente/models/premio.model';

@Component({
  selector: 'app-modal-premio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-premio.html',
})
export class ModalPremio{
  form: FormGroup;
  festivales: Festival[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalPremio>,
    private festivalesService: FestivalesService,
    @Inject(MAT_DIALOG_DATA) public data?: { premio?: Premio, festivales: Festival[] }
  ) {
    this.festivales = data?.festivales ?? [];

    this.form = this.fb.group({
      nombre: [data?.premio?.nombre ?? '', Validators.required],
      descripcion: [data?.premio?.descripcion ?? '', Validators.required],
      estado: [data?.premio?.estado ?? 'activo', Validators.required],
      festival: [data?.premio?.festival ?? '', Validators.required],
    });
  }

  submit() {
    if (this.form.valid) {
      const premio: Premio = this.form.value as Premio;
      this.festivalesService.createPremio(premio).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}
