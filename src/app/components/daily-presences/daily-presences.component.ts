import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { PresenceService } from '../../services/presence.service';
import { CommonModule } from '@angular/common';
import { SideNavComponent } from '../side-nav/side-nav.component';


@Component({
  selector: 'app-daily-presences',
  standalone: true,
  imports: [
    CommonModule,
    SideNavComponent
  ],
  templateUrl: './daily-presences.component.html',
  styleUrl: './daily-presences.component.css'
})
export class DailyPresencesComponent {
  date: string = new Date().toISOString().split('T')[0]; // Date actuelle au format YYYY-MM-DD
  departementId: string = ''; // Identifiant du département récupéré depuis l'URL
  presences: any[] = [];
  errorMessage: string = '';

  constructor(
    private presenceService: PresenceService,
    private route: ActivatedRoute // Pour accéder aux paramètres de l'URL
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du département depuis l'URL
    this.route.params.subscribe((params) => {
      this.departementId = params['id']; // Récupérer le paramètre 'id' de l'URL
      if (this.departementId) {
        this.getDailyPresences(); // Charger les présences automatiquement
      } else {
        this.errorMessage = 'Aucun identifiant de département trouvé dans l’URL.';
      }
    });
  }

  getDailyPresences(): void {
    this.presenceService.getPresencesByDepartement(this.date, this.departementId).subscribe(
      (response) => {
        this.presences = response; // Supposons que l'API renvoie directement un tableau de présences
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la récupération des présences.';
        console.error('Erreur API:', error);
      }
    );
  }
}
