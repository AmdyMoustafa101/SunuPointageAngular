import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeService } from '../../services/employe.service';
import { Employe } from '../../models/employe.model';
import { HeaderAndSidebarComponent } from '../header-and-sidebar/header-and-sidebar.component';

@Component({
  selector: 'app-employe-edit',
  standalone: true,
  imports: [HeaderAndSidebarComponent, ReactiveFormsModule, FormsModule, CommonModule],
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
        console.error('Error retrieving employee details:', error);
      }
    );
  }

  updateEmploye(): void {
    if (this.employe) {
      this.employeService.updateEmploye(this.employe.id, this.employe).subscribe(
        () => {
          this.router.navigate(['/liste-employes', this.employe?.departementId]);
        },
        (error: any) => {
          this.errorMessage = error.message;
          console.error('Error updating employee:', error);
        }
      );
    }
  }
}