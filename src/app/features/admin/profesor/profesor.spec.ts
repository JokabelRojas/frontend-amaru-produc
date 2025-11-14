import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Profesor } from './profesor';

describe('Profesor', () => {
  let component: Profesor;
  let fixture: ComponentFixture<Profesor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profesor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Profesor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
