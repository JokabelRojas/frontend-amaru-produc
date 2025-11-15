import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Festival } from './festivales';

describe('Festival', () => {
  let component: Festivales;
  let fixture: ComponentFixture<Festivales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Festival]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Festival);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
