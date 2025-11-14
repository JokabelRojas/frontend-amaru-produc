import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Servicios2 } from './servicios2';

describe('Servicios2', () => {
  let component: Servicios2;
  let fixture: ComponentFixture<Servicios2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Servicios2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Servicios2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
