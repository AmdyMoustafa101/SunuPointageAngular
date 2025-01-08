import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateApprenantComponent } from './update-apprenant.component';

describe('UpdateApprenantComponent', () => {
  let component: UpdateApprenantComponent;
  let fixture: ComponentFixture<UpdateApprenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateApprenantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateApprenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
