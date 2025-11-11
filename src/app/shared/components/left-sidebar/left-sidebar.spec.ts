import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftSidebar } from './left-sidebar';

describe('LeftSidebar', () => {
  let component: LeftSidebar;
  let fixture: ComponentFixture<LeftSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
