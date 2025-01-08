import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttendanceService } from '../../../services/dash.service';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js';
import { ViewChild } from '@angular/core';
import { registerables, CategoryScale, LinearScale } from 'chart.js';

interface PresenceData {
  date: string;       // Format de la date, par exemple "01/01/2025"
  presences: number;  // Nombre de présences pour cette date
}

@Component({
  selector: 'app-monthly-cohorte',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './monthly-cohorte.component.html',
  styleUrl: './monthly-cohorte.component.css'
})
export class MonthlyCohorteComponent {
  @ViewChild('monthlyChart') monthlyChartRef!: ElementRef<HTMLCanvasElement>;
  
  monthlyPresences: any;
  errorMessage: string | null = null;
  cohorteId: string = '';

  // Données du graphique
  chartData: any;
  chartOptions: any = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Présences Mensuelles' },
    },
  };

  constructor(
    private presenceService: AttendanceService,
    private route: ActivatedRoute
  ) {
    Chart.register(...registerables, CategoryScale, LinearScale);
  }

  ngOnInit(): void {
    const today = new Date();
    const month = today.getMonth() + 1; // Mois courant (1-12)
    const year = today.getFullYear();

    // Récupérer l'ID du département depuis l'URL
    this.route.params.subscribe((params) => {
      this.cohorteId = params['id']; // Récupérer le paramètre 'id' de l'URL
      if (this.cohorteId) {
        this.getMonthlyPresences(month, year); // Charger les présences automatiquement
      } else {
        this.errorMessage = 'Aucun identifiant de département trouvé dans l’URL.';
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.monthlyPresences) {
      this.renderChart(); // Une fois les données récupérées, rendre le graphique
    }
  }

  getMonthlyPresences(month: number, year: number): void {
    this.presenceService.getMonthlyPresenceByCohorte(month, year, parseInt(this.cohorteId, 10)).subscribe(
      (response) => {
        console.log("données :", response);
        this.monthlyPresences = response.data; // Exemple de données : {1: 0, 2: 1, 3: 0, ...}
        this.renderChart(); // Rendre le graphique avec les données
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la récupération des données.';
        console.error('Erreur API:', error);
      }
    );
  }

  renderChart(): void {
    const ctx = this.monthlyChartRef.nativeElement.getContext('2d');
  
    if (!this.monthlyPresences || Object.keys(this.monthlyPresences).length === 0) {
      console.error('Aucune donnée disponible pour le graphique.');
      return;
    }
  
    // Extraire les labels (dates) et les valeurs (présences) depuis l'objet monthlyPresences
    const labels = Object.values(this.monthlyPresences).map((item: any) => item.date); // Récupération des dates
    const values = Object.values(this.monthlyPresences).map((item: any) => item.presences); // Récupération des présences
  
    console.log('Labels:', labels);
    console.log('Values:', values);
  
    if (ctx) {
      new Chart(ctx, {
        type: 'bar', // Type de graphique (vous pouvez le changer en 'line', 'pie', etc.)
        data: {
          labels: labels, // Les labels pour l'axe X (dates)
          datasets: [
            {
              label: 'Présences mensuelles',
              data: values, // Les données pour l'axe Y (valeurs des présences)
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
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
            title: {
              display: true,
              text: 'Présences mensuelles',
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Dates',
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Nombre de présences',
              },
            },
          },
        },
      });
    }
  }
}
