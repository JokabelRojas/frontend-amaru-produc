import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalActividades } from './modal-actividades';

describe('ModalActividades', () => {
  let component: ModalActividades;
  let fixture: ComponentFixture<ModalActividades>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalActividades]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalActividades);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
