import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricCohorteComponent } from './historic-cohorte.component';

describe('HistoricCohorteComponent', () => {
  let component: HistoricCohorteComponent;
  let fixture: ComponentFixture<HistoricCohorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricCohorteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricCohorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
