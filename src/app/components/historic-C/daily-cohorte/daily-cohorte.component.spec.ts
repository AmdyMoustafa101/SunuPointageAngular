import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyCohorteComponent } from './daily-cohorte.component';

describe('DailyCohorteComponent', () => {
  let component: DailyCohorteComponent;
  let fixture: ComponentFixture<DailyCohorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyCohorteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyCohorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
