import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronogramComponent } from './cronogram.component';

describe('CronogramComponent', () => {
  let component: CronogramComponent;
  let fixture: ComponentFixture<CronogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CronogramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CronogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
