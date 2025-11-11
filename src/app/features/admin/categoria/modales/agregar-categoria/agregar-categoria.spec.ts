import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarCategoria } from './agregar-categoria';

describe('AgregarCategoria', () => {
  let component: AgregarCategoria;
  let fixture: ComponentFixture<AgregarCategoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarCategoria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarCategoria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
