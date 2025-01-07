import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CohorteDetailsComponent } from './cohorte-details.component';

describe('CohorteDetailsComponent', () => {
  let component: CohorteDetailsComponent;
  let fixture: ComponentFixture<CohorteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CohorteDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CohorteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
