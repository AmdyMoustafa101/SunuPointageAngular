import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { PresenceService } from '../../services/presence.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Chart, CategoryScale, registerables, LinearScale } from 'chart.js';

@Component({
  selector: 'app-weekly-presences',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
  ],
  templateUrl: './weekly-presences.component.html',
  styleUrl: './weekly-presences.component.css'
})
export class WeeklyPresencesComponent implements AfterViewInit {
  @ViewChild('weeklyChart') weeklyChartRef!: ElementRef<HTMLCanvasElement>;

  dateRangeStart: string = ''; // Date de début de la plage
  dateRangeEnd: string = ''; // Date de fin de la plage
  departementId: string = ''; // ID du département récupéré depuis l'URL
  presences: any = {}; // Données des présences sous forme d'objet {lundi: 0, mardi: 0, ...}
  errorMessage: string = '';
  
  constructor(
    private presenceService: PresenceService,
    private route: ActivatedRoute // Pour accéder aux paramètres de l'URL
  ) {
    Chart.register(...registerables, CategoryScale, LinearScale);
  }

  ngOnInit(): void {
    // Calculer les dates par défaut (semaine en cours)
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    this.dateRangeStart = weekAgo.toISOString().split('T')[0]; // Date d'il y a 7 jours
    this.dateRangeEnd = today.toISOString().split('T')[0]; // Date actuelle

    // Récupérer l'ID du département depuis l'URL
    this.route.params.subscribe((params) => {
      this.departementId = params['id']; // Récupérer le paramètre 'id' de l'URL
      if (this.departementId) {
        this.getWeeklyPresences(); // Charger les présences automatiquement
      } else {
        this.errorMessage = 'Aucun identifiant de département trouvé dans l’URL.';
      }
    });
  }

  ngAfterViewInit() {
    if (this.presences && Object.keys(this.presences).length > 0) {
      this.renderChart(this.presences); // Rendu du graphique après récupération des données
    }
  }

  getWeeklyPresences(): void {
    this.presenceService.getWeeklyPresencesByDepartement(this.dateRangeStart, this.dateRangeEnd, this.departementId).subscribe(
      (response) => {
        this.presences = response.data; // Exemple de données : { lundi: 0, mardi: 0, ... }
        this.renderChart(this.presences); // Passez les données aux fonctions de rendu
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la récupération des présences.';
        console.error('Erreur API:', error);
      }
    );
  }

  renderChart(data: any): void {
  const ctx = this.weeklyChartRef.nativeElement.getContext('2d');

  // Jours de la semaine
  const daysOfWeek = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  // Calcul du jour actuel
  const today = new Date();
  const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // Dimanche = 0, mais on le place comme dernier jour de la semaine

  // Construction des données
  const presences = daysOfWeek.map((day, index) => {
    if (index > currentDayIndex) {
      return null; // Jours futurs : valeur null
    }
    return data[day] ?? 0; // Jours passés et actuels : valeur réelle ou 0 par défaut
  });

  // Capitaliser les noms des jours pour l'axe X
  const labels = daysOfWeek.map((day) => day.charAt(0).toUpperCase() + day.slice(1));

  if (ctx) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Présences',
            data: presences,
            borderColor: '#6c63ff',
            backgroundColor: 'rgba(108, 99, 255, 0.3)',
            fill: true,
            tension: 0.4,
            spanGaps: true, // Permet d'éviter une ligne entre les valeurs nulles
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
              text: 'Présences',
            },
          },
        },
      },
    });
  }
}

  
}
