import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AttendanceService } from '../../services/dash.service'; // Service pour les données mensuelles

@Component({
  selector: 'app-monthly-chart',
  template: `<canvas #monthlyChart></canvas>`,
  standalone: true,
  styleUrls: ['./monthly-chart.component.css'],
  providers: [AttendanceService], // Fournisseur du service
})
export class MonthlyChartComponent implements AfterViewInit {
  @ViewChild('monthlyChart') monthlyChartRef!: ElementRef<HTMLCanvasElement>;

  constructor(private attendanceService: AttendanceService) {
    // Enregistrer tous les composants nécessaires de Chart.js
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    // Obtenir l'année courante
    const currentYear = new Date().getFullYear().toString();

    // Appeler la méthode pour récupérer les données annuelles
    this.attendanceService.getMonthlyData(currentYear).subscribe({
      next: (data) => {
        console.log('Données reçues :', data); // Log pour vérifier la structure des données
        if (this.isValidData(data)) {
          this.renderChart(data);
        } else {
          console.error('Les données reçues ne sont pas valides :', data);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des données annuelles :', err);
      },
    });
  }

  private isValidData(data: any): boolean {
    // Vérification de la structure des données
    console.log('Vérification des données:', data);

    return (
      data &&
      typeof data === 'object' &&
      Object.keys(data).every((month) => {
        const item = data[month];
        return (
          typeof item.presences === 'number' && // Validation des présences
          typeof item.absences === 'number'    // Validation des absences
        );
      })
    );
  }

  renderChart(data: any) {
    const ctx = this.monthlyChartRef.nativeElement.getContext('2d');

    if (ctx) {
      // Extraire les labels (mois) et les données
      const labels = Object.keys(data); // Mois de l'année
      const presences = labels.map((month) => data[month].presences); // Présences
      const absences = labels.map((month) => data[month].absences); // Absences

      // Initialisation du graphique
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels, // Mois de l'année
          datasets: [
            {
              label: 'Présences',
              data: presences,
              backgroundColor: '#6c63ff',
            },
            {
              label: 'Absences',
              data: absences,
              backgroundColor: '#ff6384',
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
          scales: {
            x: {
              title: {
                display: true,
                text: 'Mois de l\'année',
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Nombre',
              },
            },
          },
        },
      });
    } else {
      console.error('Impossible d’obtenir le contexte du canvas.');
    }
  }

}
