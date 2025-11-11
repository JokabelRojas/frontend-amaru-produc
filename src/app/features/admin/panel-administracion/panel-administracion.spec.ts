import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAdministracion } from './panel-administracion';

describe('PanelAdministracion', () => {
  let component: PanelAdministracion;
  let fixture: ComponentFixture<PanelAdministracion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelAdministracion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelAdministracion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
