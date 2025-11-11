import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPremio } from './modal-premio';

describe('ModalPremio', () => {
  let component: ModalPremio;
  let fixture: ComponentFixture<ModalPremio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPremio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPremio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
