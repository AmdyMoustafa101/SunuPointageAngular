// apprenant-details.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApprenantService } from '../../services/apprenant.service'; // Assurez-vous que le chemin est correct
import { RouterModule } from '@angular/router';
import { SideNavComponent } from '../side-nav/side-nav.component';


@Component({
  selector: 'app-apprenant-details',
  standalone: true,
  imports: [CommonModule, RouterModule, SideNavComponent],
  providers: [ApprenantService], // Assurez-vous d'ajouter ApprenantService à votre module principal
  templateUrl: './apprenant-details.component.html',
  styleUrls: ['./apprenant-details.component.css']
})
export class ApprenantDetailsComponent implements OnInit {
  apprenantId: number | null = null;
  apprenant: any; // Remplacez par votre modèle approprié

  constructor( private router: Router, private route: ActivatedRoute, private apprenantService: ApprenantService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.apprenantId = +params['id']; // Récupérer l'ID de l'URL
      this.loadApprenantDetails();
    });
  }

  loadApprenantDetails(): void {
    if (this.apprenantId) {
      this.apprenantService.getApprenantById(this.apprenantId).subscribe(
        data => {
          this.apprenant = data; // Charger les détails de l'apprenant
          console.log('Données de l\'apprenant:', this.apprenant);
        },
        error => {
          console.error('Erreur lors du chargement des détails de l\'apprenant:', error);
          // Gérer l'erreur (par exemple, afficher un message d'erreur)
        }
      );
    }
  }
  goBack(): void {
    this.router.navigate(['/apprenants']); // Redirige vers la liste des apprenants
}
}