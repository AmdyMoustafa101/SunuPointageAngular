import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartementEditComponent } from './departement-edit.component';

describe('DepartementEditComponent', () => {
  let component: DepartementEditComponent;
  let fixture: ComponentFixture<DepartementEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartementEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
