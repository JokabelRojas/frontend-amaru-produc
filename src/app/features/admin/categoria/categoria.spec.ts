import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Categoria } from './categoria';

describe('Categoria', () => {
  let component: Categoria;
  let fixture: ComponentFixture<Categoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Categoria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Categoria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
