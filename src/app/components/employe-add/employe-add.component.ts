import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeService } from '../../services/employe.service';
import { Router } from '@angular/router';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employe-add',
  standalone: true,
  imports: [ReactiveFormsModule, SideNavComponent, CommonModule],
  templateUrl: './employe-add.component.html',
  styleUrls: ['./employe-add.component.css']
})
export class EmployeAddComponent implements OnInit {
  employeForm: FormGroup;
  errorMessage: string = '';
  departements: any[] = [];  // Variable to store the list of departments

  constructor(
    private fb: FormBuilder,
    private employeService: EmployeService,
    private router: Router
  ) {
    this.employeForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      adresse: ['', Validators.required],
      telephone: ['', Validators.required],
      photo: [null, Validators.required],
      role: ['', Validators.required],
      fonction: [''],
      departement_id: [''],  // Department ID
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    this.loadDepartements();  // Load the list of departments on component initialization
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.employeForm.patchValue({
        photo: file
      });
    }
  }

  loadDepartements(): void {
    this.employeService.getDepartements().subscribe(
      (data: any[]) => {
        this.departements = data;
      },
      (error: any) => {
        this.errorMessage = error.message;
        console.error('Error loading departments:', error);
      }
    );
  }

  submitForm(): void {
    if (this.employeForm.valid) {
      const formData: FormData = new FormData();
      Object.keys(this.employeForm.controls).forEach(key => {
        const value = this.employeForm.get(key)?.value;
        if (value instanceof FileList) {
          formData.append(key, value[0]);
        } else {
          formData.append(key, value);
        }
      });

      this.employeService.createEmploye(formData).subscribe(
        () => {
          this.router.navigate(['/liste-employes']);
        },
        error => {
          this.errorMessage = error.message;
          console.error('Error creating employee:', error);
        }
      );
    }
  }
}