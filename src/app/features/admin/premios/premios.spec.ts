import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Premios } from './premios';

describe('Premios', () => {
  let component: Premios;
  let fixture: ComponentFixture<Premios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Premios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Premios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
