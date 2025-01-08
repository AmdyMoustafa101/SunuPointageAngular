import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyCohorteComponent } from './monthly-cohorte.component';

describe('MonthlyCohorteComponent', () => {
  let component: MonthlyCohorteComponent;
  let fixture: ComponentFixture<MonthlyCohorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyCohorteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyCohorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
