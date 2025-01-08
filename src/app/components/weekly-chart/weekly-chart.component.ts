import { Component, ElementRef, AfterViewInit, ViewChild, OnInit } from '@angular/core';
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

  weekRange: { startOfWeek: string; endOfWeek: string };

  // Plage de dates pour la semaine (exemple)
  startDate: string = '';
  endDate: string = '';



  constructor(private attendanceService: AttendanceService) {
    Chart.register(...registerables);
    this.weekRange = { startOfWeek: '', endOfWeek: '' };
  }

  ngOnInit(): void {
    this.weekRange = this.getCurrentWeekRange();
    this.startDate = this.weekRange.startOfWeek;
    this.endDate = this.weekRange.endOfWeek;

  }



  ngAfterViewInit() {
    console.log("date : ", this.startDate);
    console.log("date : ", this.endDate);
    this.attendanceService.getWeeklyData(this.startDate, this.endDate).subscribe(
      (data) => {
        this.renderChart(data);
        console.log("les données hebdomadaires: ", data);
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
      // Ordre des jours de la semaine
      const dayOrder = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

      // Obtenez le jour courant
      const today = new Date().toLocaleString('fr-FR', { weekday: 'long' }).toLowerCase();

      // Transformez l'objet en tableau
      const formattedData = Object.entries(data).map(([jour, valeurs]: [string, any]) => ({
        day: jour.toLowerCase(),
        ...valeurs, // Ajoute les propriétés `absences` et `retards` aux jours
      }));

      // Créez une structure complète de la semaine avec des valeurs par défaut (0 ou null pour les jours futurs)
      const weeklyData = dayOrder.map((day) => {
        const found = formattedData.find((item) => item.day === day);
        const isFuture = dayOrder.indexOf(day) > dayOrder.indexOf(today);

        return {
          day: day.charAt(0).toUpperCase() + day.slice(1), // Capitaliser la première lettre
          retards: found && !isFuture ? found.retards ?? 0 : null,
          absences: found && !isFuture ? found.absences ?? 0 : null,
        };
      });

      const labels = weeklyData.map((item) => item.day); // Exemple : ['Lundi', 'Mardi', ... 'Dimanche']
      const retards = weeklyData.map((item) => item.retards); // Retards (null pour les jours futurs)
      const absences = weeklyData.map((item) => item.absences); // Absences (null pour les jours futurs)

      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Retards',
                data: retards,
                borderColor: '#6c63ff',
                backgroundColor: 'rgba(108, 99, 255, 0.3)',
                fill: true,
                tension: 0.4,
                spanGaps: false, // Permet de ne pas tracer les lignes pour les valeurs nulles
              },
              {
                label: 'Absences',
                data: absences,
                borderColor: '#ff6384',
                backgroundColor: 'rgba(255, 99, 132, 0.3)',
                fill: true,
                tension: 0.4,
                spanGaps: false, // Permet de ne pas tracer les lignes pour les valeurs nulles
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
                  text: 'Jours de la semaine',
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
      }
    } else {
      console.error('Les données reçues ne sont pas valides :', data);
    }
  }



  getCurrentWeekRange(): { startOfWeek: string; endOfWeek: string } {
    const today = new Date();

    // Obtenir le jour de la semaine (0 = dimanche, 1 = lundi, ...)
    const dayOfWeek = today.getDay();

    // Si aujourd'hui est dimanche (0), le considérer comme 7ème jour
    const correctedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    // Calculer le lundi de la semaine (début)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (correctedDayOfWeek - 1));

    // Calculer le dimanche de la semaine (fin)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // Formater les dates en 'YYYY-MM-DD'
    const formatDate = (date: Date): string => date.toISOString().split('T')[0];

    return {
      startOfWeek: formatDate(startOfWeek),
      endOfWeek: formatDate(endOfWeek),
    };
  }

}
