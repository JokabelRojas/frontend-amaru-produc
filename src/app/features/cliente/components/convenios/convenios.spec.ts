import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Convenios } from './convenios';

describe('Convenios', () => {
  let component: Convenios;
  let fixture: ComponentFixture<Convenios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Convenios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Convenios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
