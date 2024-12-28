import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AttendanceService } from '../../services/dash.service'; // Chemin à adapter

@Component({
  selector: 'app-pie-chart',
  template: `<canvas #pieChart></canvas>`,
  standalone: true,
  imports: [],
  templateUrl: './pie-chart.component.html',
  providers: [AttendanceService], // Ajout du service
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements AfterViewInit {
  @ViewChild('pieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;

  constructor(private attendanceService: AttendanceService) {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    this.attendanceService.getDailyData().subscribe((data) => {
      this.renderChart(data);
    });
  }

  renderChart(data: any) {
    const ctx = this.pieChartRef.nativeElement.getContext('2d');
  
    if (!ctx) {
      console.error('Impossible d\'obtenir le contexte du canvas pour le pie chart.');
      return;
    }
  
    if (!data || typeof data !== 'object') {
      console.error('Les données fournies ne sont pas valides :', data);
      return;
    }
  
    // Récupérer les absences et retards en vérifiant les valeurs par défaut
    const absences = data.absences ?? 0; // Utilisation de l'opérateur nullish coalescing
    const retards = data.retards ?? 0;
  
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Absences', 'Retards'], // Les étiquettes du diagramme
        datasets: [
          {
            data: [absences, retards], // Données du graphique
            backgroundColor: ['#ff6384', '#63c2ff'], // Couleurs des segments
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top', // Position de la légende
          },
        },
      },
    });
  }
  
}
