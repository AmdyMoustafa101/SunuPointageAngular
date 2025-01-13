import { Component, OnInit } from '@angular/core';
import { EmployeService } from '../../services/employe.service';
import { DepartementService } from '../../services/departement.service';
import { Employe } from '../../models/employe.model';
import { Departement } from '../../models/departement.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SideNavComponent } from '../side-nav/side-nav.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SideNavComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Employe | null = null;
  departement: Departement | null = null;

  constructor(
    private employeService: EmployeService,
    private departementService: DepartementService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const userData = this.employeService.getUserData();
    console.log('UserData:', userData); // Log user data
    if (userData && userData.id) {
      this.employeService.getEmployeById(userData.id).subscribe((data: Employe) => {
        console.log('Employe Data:', data); // Log fetched employe data
        this.user = data;
        if (data.departementId) {
          this.loadDepartementData(data.departementId);
        }
      }, error => {
        console.error('Error fetching user data:', error);
      });
    } else {
      // Handle the case where user data is not available
      console.error('User data not available');
    }
  }

  loadDepartementData(id: number): void {
    this.departementService.getDepartementById(id).subscribe((data: Departement) => {
      this.departement = data;
      console.log('Departement Data:', this.departement); // Log fetched departement data
    }, error => {
      console.error('Error fetching departement data:', error);
    });
  }
}