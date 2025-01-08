import { Component, OnInit } from '@angular/core';
import { WeeklyPresencesComponent } from '../weekly-presences/weekly-presences.component';
import { DailyPresencesComponent } from '../daily-presences/daily-presences.component';
import { CommonModule } from '@angular/common';
import { MonthlyPresencesComponent } from "../../monthly-presences/monthly-presences.component";
import { AttendanceService } from '../../services/dash.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-historic-d',
  standalone: true,
  imports: [
    DailyPresencesComponent,
    WeeklyPresencesComponent,
    CommonModule,
    MonthlyPresencesComponent
],
  templateUrl: './historic-d.component.html',
  styleUrl: './historic-d.component.css'
})
export class HistoricDComponent implements OnInit{
  departementName: string = '';
  currentView: string = 'daily'; // Vue par défaut : présences journalières
  departementId: number = 0;
  errorMessage: string = '';

  constructor(
    private attendanceService: AttendanceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du département depuis l'URL
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (!id) {
        this.errorMessage = 'Aucun identifiant de département trouvé dans l’URL.';
        return;
      }

      this.departementId = +id; // Convertir en nombre
      this.fetchDepartementName();
    });
  }

  // Méthode pour récupérer le nom du département
  fetchDepartementName(): void {
    this.attendanceService.getDepartementNameById(this.departementId).subscribe(
      (name: string) => {
        this.departementName = name;
      },
      (error) => {
        console.error('Erreur lors de la récupération du nom du département:', error);
        this.errorMessage = 'Impossible de récupérer le nom du département.';
      }
    );
  }
}
