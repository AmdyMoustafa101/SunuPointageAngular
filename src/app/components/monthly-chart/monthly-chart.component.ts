import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-monthly-chart',
  template: `<canvas id="monthlyChart"></canvas>`,
  standalone: true,
  imports: [],
  templateUrl: './monthly-chart.component.html',
  styleUrl: './monthly-chart.component.css'
})
export class MonthlyChartComponent implements AfterViewInit{
  @ViewChild('monthlyChart') monthlyChartRef!: ElementRef<HTMLCanvasElement>;

  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    const ctx = this.monthlyChartRef.nativeElement.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'],
          datasets: [
            {
              label: 'Présences',
              data: [50, 60, 70, 80, 90, 100, 110, 120],
              backgroundColor: '#6c63ff',
            },
            {
              label: 'Absences',
              data: [20, 30, 10, 40, 50, 20, 30, 40],
              backgroundColor: '#c9c9ff',
            },
          ],
        },
      });
    }
  }
}
