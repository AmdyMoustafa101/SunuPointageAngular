import { Component } from '@angular/core';
import { PresenceService } from '../../services/presence.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
export class WeeklyPresencesComponent {
  dateRangeStart: string = ''; // Date de début de la plage
  dateRangeEnd: string = ''; // Date de fin de la plage
  departementId: string = ''; // ID du département récupéré depuis l'URL
  presences: any[] = [];
  errorMessage: string = '';

  constructor(
    private presenceService: PresenceService,
    private route: ActivatedRoute // Pour accéder aux paramètres de l'URL
  ) {}

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

  getWeeklyPresences(): void {
    this.presenceService
      .getWeeklyPresencesByDepartement(this.dateRangeStart, this.dateRangeEnd, this.departementId)
      .subscribe(
        (response) => {
          this.presences = response.data; // Supposons que l'API renvoie { success: true, data: [...] }
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la récupération des présences.';
          console.error('Erreur API:', error);
        }
      );
  }
}
