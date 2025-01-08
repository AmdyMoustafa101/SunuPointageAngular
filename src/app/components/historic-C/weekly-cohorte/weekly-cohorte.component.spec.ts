import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyCohorteComponent } from './weekly-cohorte.component';

describe('WeeklyCohorteComponent', () => {
  let component: WeeklyCohorteComponent;
  let fixture: ComponentFixture<WeeklyCohorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyCohorteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyCohorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
