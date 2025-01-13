import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeService } from '../../services/employe.service';
import { Employe } from '../../models/employe.model';
import { SideNavComponent } from '../side-nav/side-nav.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-employe-edit',
  standalone: true,
  imports: [SideNavComponent, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './employe-edit.component.html',
  styleUrls: ['./employe-edit.component.css']
})
export class EmployeEditComponent implements OnInit {
  employe: Employe | undefined;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeService: EmployeService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.getEmployeDetails(id);
    }
  }

  getEmployeDetails(id: number): void {
    this.employeService.getEmployeById(id).subscribe(
      (data: Employe) => {
        this.employe = data;
      },
      (error: any) => {
        this.errorMessage = error.message;
        console.error('Erreur lors de la récupération des détails de l\'employé:', error);
      }
    );
  }

  updateEmploye(): void {
    if (this.employe) {
      this.employeService.updateEmploye(this.employe.id, this.employe).subscribe(
        () => {
          Swal.fire('Succès', 'Employé mis à jour avec succès!', 'success');
          this.router.navigate(['/liste-employes', this.employe?.departementId]);
        },
        (error: any) => {
          this.errorMessage = error.message;
          Swal.fire('Erreur', 'Erreur lors de la mise à jour de l\'employé:', 'error');
          console.error('Erreur lors de la mise à jour de l\'employé:', error);
        }
      );
    }
  }
}