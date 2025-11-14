import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Actividades } from './actividades';

describe('Actividades', () => {
  let component: Actividades;
  let fixture: ComponentFixture<Actividades>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Actividades]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Actividades);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
