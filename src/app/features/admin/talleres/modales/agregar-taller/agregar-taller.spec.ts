import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarTaller } from './agregar-taller';

describe('AgregarTaller', () => {
  let component: AgregarTaller;
  let fixture: ComponentFixture<AgregarTaller>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarTaller]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarTaller);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
