import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProfesor } from './modal-profesor';

describe('ModalProfesor', () => {
  let component: ModalProfesor;
  let fixture: ComponentFixture<ModalProfesor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalProfesor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalProfesor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
