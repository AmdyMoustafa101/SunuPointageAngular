import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyPresencesComponent } from './monthly-presences.component';

describe('MonthlyPresencesComponent', () => {
  let component: MonthlyPresencesComponent;
  let fixture: ComponentFixture<MonthlyPresencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyPresencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyPresencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
