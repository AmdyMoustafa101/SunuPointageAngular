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
    Chart.register(...registerables); // Enregistrer tous les composants nécessaires de Chart.js
  }

  ngAfterViewInit() {
    // Appeler les données mensuelles (exemple pour janvier 2025)
    const year = '2025';
    const month = '01';

    this.attendanceService.getMonthlyData(year, month).subscribe({
      next: (data) => {
        console.log('Données reçues :', data);  // Log des données pour vérifier leur structure
        if (this.isValidData(data)) {
          this.renderChart(data);
        } else {
          console.error('Les données reçues ne sont pas valides :', data);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des données mensuelles :', err);
      },
    });
  }

  private isValidData(data: any): boolean {
    // Vérification de la structure des données
    console.log('Vérification des données:', data);

    // Vérification si les données sont un tableau d'objets avec les bonnes propriétés
    return (
      Array.isArray(data) &&
      data.every((item: any) => {
        console.log('Vérification de l\'élément:', item);  // Log pour chaque élément
        return (
          typeof item.month === 'string' &&   // Validation du mois
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
      const labels = data.map((item: any) => item.month); // Utilisation de 'month' pour les labels
      const presences = data.map((item: any) => item.presences); // Présences
      const absences = data.map((item: any) => item.absences); // Absences

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
                text: 'Mois de l\'année', // Modifié pour afficher les mois
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
