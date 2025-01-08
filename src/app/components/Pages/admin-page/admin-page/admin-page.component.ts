import { Component, OnInit } from '@angular/core';
import { EmployeService } from '../../../../services/employe.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';
import { HeaderAndSidebarComponent } from "../../../header-and-sidebar/header-and-sidebar.component";
import { SummaryCardsComponent } from "../../../summary-cards/summary-cards.component";
import { MonthlyChartComponent } from "../../../monthly-chart/monthly-chart.component";
import { WeeklyChartComponent } from "../../../weekly-chart/weekly-chart.component";
import { PieChartComponent } from "../../../pie-chart/pie-chart.component";


@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderAndSidebarComponent, SummaryCardsComponent, MonthlyChartComponent, WeeklyChartComponent, PieChartComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit {
  ngOnInit(): void {
    // Récupérer les données utilisateur depuis le service ou le localStorage
    const user = this.employeService.getUserData();
    if (user && user.id) {
      this.admin = user;
    } else {
      // Si aucune donnée, redirigez ou faites une autre action, si nécessaire
      console.log('Aucune donnée utilisateur trouvée');
    }
  }

  constructor(private fb: FormBuilder,private employeService: EmployeService, private router: Router) {}

  admin: any;

  logout() {
    this.employeService.logout().subscribe({
      next: (response) => {
        this.employeService.clearToken(); // Supprimer le jeton
        this.router.navigate(['/login']);
        Swal.fire('Deconnexion réussie', response.message, 'success'),
        console.log('Déconnexion réussie');

      },
      error: (err) => Swal.fire('Erreur', err.error.message, 'error'),
    });
  }





}
