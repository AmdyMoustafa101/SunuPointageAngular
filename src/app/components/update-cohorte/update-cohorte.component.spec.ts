import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCohorteComponent } from './update-cohorte.component';

describe('UpdateCohorteComponent', () => {
  let component: UpdateCohorteComponent;
  let fixture: ComponentFixture<UpdateCohorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCohorteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCohorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
