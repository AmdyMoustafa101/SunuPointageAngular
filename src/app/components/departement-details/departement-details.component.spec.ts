import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartementDetailsComponent } from './departement-details.component';

describe('DepartementDetailsComponent', () => {
  let component: DepartementDetailsComponent;
  let fixture: ComponentFixture<DepartementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartementDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
