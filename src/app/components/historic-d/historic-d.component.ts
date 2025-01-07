import { Component } from '@angular/core';
import { WeeklyPresencesComponent } from '../weekly-presences/weekly-presences.component';
import { DailyPresencesComponent } from '../daily-presences/daily-presences.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historic-d',
  standalone: true,
  imports: [
    DailyPresencesComponent,
    WeeklyPresencesComponent,
    CommonModule,
  ],
  templateUrl: './historic-d.component.html',
  styleUrl: './historic-d.component.css'
})
export class HistoricDComponent {
  currentView: string = 'daily'; // Vue par défaut : présences journalières
}
