import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPremios } from './modal-premios';

describe('ModalPremios', () => {
  let component: ModalPremios;
  let fixture: ComponentFixture<ModalPremios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPremios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPremios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
