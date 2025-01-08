import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyCohorteComponent } from "../daily-cohorte/daily-cohorte.component";
import { WeeklyCohorteComponent } from "../weekly-cohorte/weekly-cohorte.component";
import { MonthlyCohorteComponent } from "../monthly-cohorte/monthly-cohorte.component";

@Component({
  selector: 'app-historic-cohorte',
  standalone: true,
  imports: [DailyCohorteComponent, WeeklyCohorteComponent, MonthlyCohorteComponent, CommonModule],
  templateUrl: './historic-cohorte.component.html',
  styleUrl: './historic-cohorte.component.css'
})
export class HistoricCohorteComponent {
  currentView: string = 'daily';
}
