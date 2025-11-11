import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterCliente } from './footer-cliente';

describe('FooterCliente', () => {
  let component: FooterCliente;
  let fixture: ComponentFixture<FooterCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
