import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPresencesComponent } from './daily-presences.component';

describe('DailyPresencesComponent', () => {
  let component: DailyPresencesComponent;
  let fixture: ComponentFixture<DailyPresencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyPresencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyPresencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
