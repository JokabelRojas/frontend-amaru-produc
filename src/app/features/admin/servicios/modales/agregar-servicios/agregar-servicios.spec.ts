import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarServicios } from './agregar-servicios';

describe('AgregarServicios', () => {
  let component: AgregarServicios;
  let fixture: ComponentFixture<AgregarServicios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarServicios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarServicios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
