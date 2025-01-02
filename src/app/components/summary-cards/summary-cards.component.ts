import { Component, OnInit } from '@angular/core';
import { SummaryService } from '../../services/summary.service';

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [],
  templateUrl: './summary-cards.component.html',
  styleUrl: './summary-cards.component.css'
})
export class SummaryCardsComponent implements OnInit {
  totalEmployes = 0;
  totalDepartements = 0;
  totalApprenants = 0;
  totalCohortes = 0;

  constructor(private summaryService: SummaryService) {}

  ngOnInit(): void {
    this.summaryService.getAllData().subscribe(
      (data) => {
        // Données récupérées depuis les API
        this.totalEmployes = data.empDept.nombre_employes || 0;
        this.totalDepartements = data.empDept.nombre_departements || 0;
        this.totalApprenants = data.appCohorte.nombre_apprenants || 0;
        this.totalCohortes = data.appCohorte.nombre_cohortes || 0;
      },
      (error) => {
        console.error('Erreur lors de la récupération des données', error);
      }
    );
  }
}
