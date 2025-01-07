import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyPresencesComponent } from './weekly-presences.component';

describe('WeeklyPresencesComponent', () => {
  let component: WeeklyPresencesComponent;
  let fixture: ComponentFixture<WeeklyPresencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyPresencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyPresencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
