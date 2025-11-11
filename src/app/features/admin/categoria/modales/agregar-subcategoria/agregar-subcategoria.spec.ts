import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarSubcategoria } from './agregar-subcategoria';

describe('AgregarSubcategoria', () => {
  let component: AgregarSubcategoria;
  let fixture: ComponentFixture<AgregarSubcategoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarSubcategoria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarSubcategoria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
