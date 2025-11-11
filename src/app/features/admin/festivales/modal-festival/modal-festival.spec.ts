import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFestival } from './modal-festival';

describe('ModalFestival', () => {
  let component: ModalFestival;
  let fixture: ComponentFixture<ModalFestival>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFestival]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFestival);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
