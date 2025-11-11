import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Talleres } from './talleres';

describe('Talleres', () => {
  let component: Talleres;
  let fixture: ComponentFixture<Talleres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Talleres]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Talleres);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
