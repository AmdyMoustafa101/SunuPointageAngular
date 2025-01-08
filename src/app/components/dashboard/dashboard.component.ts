import { Component } from '@angular/core';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { SummaryCardsComponent } from '../summary-cards/summary-cards.component';
import { MonthlyChartComponent } from '../monthly-chart/monthly-chart.component';
import { WeeklyChartComponent } from '../weekly-chart/weekly-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SideNavComponent,
    PieChartComponent,
    SummaryCardsComponent,
    MonthlyChartComponent,
    WeeklyChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
