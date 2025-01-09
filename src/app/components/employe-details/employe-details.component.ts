import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeService } from '../../services/employe.service';
import { Employe } from '../../models/employe.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderAndSidebarComponent } from '../header-and-sidebar/header-and-sidebar.component';

@Component({
  selector: 'app-employe-details',
  standalone: true,
  imports: [CommonModule, HeaderAndSidebarComponent, FormsModule],
  templateUrl: './employe-details.component.html',
  styleUrls: ['./employe-details.component.css']
})
export class EmployeDetailsComponent implements OnInit {
  employe: Employe | undefined;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
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
}