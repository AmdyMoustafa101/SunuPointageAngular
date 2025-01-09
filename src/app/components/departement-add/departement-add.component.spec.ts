import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartementAddComponent } from './departement-add.component';

describe('DepartementAddComponent', () => {
  let component: DepartementAddComponent;
  let fixture: ComponentFixture<DepartementAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartementAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartementAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
