import { Component, OnInit } from '@angular/core';
import { EmployeService } from '../../../../services/employe.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { HeaderAndSidebarComponent } from "../../../header-and-sidebar/header-and-sidebar.component";
import { Chart } from 'chart.js'; // Ajoutez ceci pour les graphiques

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderAndSidebarComponent],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'] // Corrigez ici pour 'styleUrls'
})
export class AdminPageComponent implements OnInit {
  admin: any;
  stats: any = {
    totalEmployees: 0,
    totalLearners: 0,
    totalDepartments: 0,
    totalCohorts: 0
  };

  ngOnInit(): void {
    // Get user data and statistics from the service
    this.admin = this.employeService.getUserData();
    this.getStatistics();
  }

  constructor(private fb: FormBuilder, private employeService: EmployeService, private router: Router) {}

  getStatistics() {
    // Remplacez cette méthode par celle qui récupère réellement vos données
    this.employeService.getStatistics().subscribe(data => {
      this.stats = data; // Assurez-vous que ces données sont renvoyées par votre service
      this.createAttendanceChart(); // Créez le graphique après avoir récupéré les données
    });
  }

  createAttendanceChart() {
    const ctx = document.getElementById('attendanceChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'Présences',
            data: [65, 59, 80, 81, 56, 55, 40], // Remplacez par vos données
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Absences',
            data: [28, 48, 40, 19, 86, 27, 90], // Remplacez par vos données
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  logout() {
    this.employeService.logout().subscribe({
      next: (response) => {
        this.employeService.clearToken(); // Supprimer le jeton
        this.router.navigate(['/login']);
        Swal.fire('Déconnexion réussie', response.message, 'success');
        console.log('Déconnexion réussie');
      },
      error: (err) => Swal.fire('Erreur', err.error.message, 'error'),
    });
  }
}