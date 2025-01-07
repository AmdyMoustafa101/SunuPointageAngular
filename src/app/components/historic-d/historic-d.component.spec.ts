import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricDComponent } from './historic-d.component';

describe('HistoricDComponent', () => {
  let component: HistoricDComponent;
  let fixture: ComponentFixture<HistoricDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricDComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
