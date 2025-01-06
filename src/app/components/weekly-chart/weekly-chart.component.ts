import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AttendanceService } from '../../services/dash.service'; // Chemin du service à adapter

@Component({
  selector: 'app-weekly-chart',
  standalone: true,
  imports: [],
  templateUrl: './weekly-chart.component.html',
  styleUrls: ['./weekly-chart.component.css'],
  providers: [AttendanceService],
})
export class WeeklyChartComponent implements AfterViewInit {
  @ViewChild('weeklyChart') weeklyChartRef!: ElementRef<HTMLCanvasElement>;

  // Plage de dates pour la semaine (exemple)
  startDate: string = '2024-12-29'; // Exemple de date de début
  endDate: string = '2025-01-03';   // Exemple de date de fin

  constructor(private attendanceService: AttendanceService) {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    this.attendanceService.getWeeklyData(this.startDate, this.endDate).subscribe(
      (data) => {
        this.renderChart(data);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }

  renderChart(data: any) {
    const ctx = this.weeklyChartRef.nativeElement.getContext('2d');

    // Vérifiez si les données sont un objet, sinon affichez une erreur
    if (typeof data === 'object' && !Array.isArray(data)) {
      // Transformez l'objet en tableau
      const formattedData = Object.entries(data).map(([jour, valeurs]: [string, any]) => ({
        day: jour,
        ...valeurs, // Ajoute les propriétés `absences` et `retards` aux jours
      }));

      const labels = formattedData.map((item) => item.day); // Exemple : ['Lundi', 'Mardi', 'Mercredi', ...]
      const presences = formattedData.map(
        (item) => (item.retards ?? 0) // Remplace `undefined` par 0 si nécessaire
      );
      const absences = formattedData.map(
        (item) => (item.absences ?? 0) // Remplace `undefined` par 0 si nécessaire
      );

      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Retards',
                data: presences,
                borderColor: '#6c63ff',
                backgroundColor: 'rgba(108, 99, 255, 0.3)',
                fill: true,
                tension: 0.4,
              },
              {
                label: 'Absences',
                data: absences,
                borderColor: '#ff6384',
                backgroundColor: 'rgba(255, 99, 132, 0.3)',
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
            },
          },
        });
      }
    } else {
      console.error('Les données reçues ne sont pas valides :', data);
    }
  }
}
