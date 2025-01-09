import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { DepartementService } from '../../services/departement.service';
import { Departement } from '../../models/departement.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderAndSidebarComponent } from '../header-and-sidebar/header-and-sidebar.component';

@Component({
  selector: 'app-departement-edit',
  standalone: true,
  imports: [ HeaderAndSidebarComponent, ReactiveFormsModule],
  templateUrl: './departement-edit.component.html',
  styleUrls: ['./departement-edit.component.css']
})
export class DepartementEditComponent implements OnInit {
  departement: Departement | undefined;
  departementForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private departementService: DepartementService,
    private fb: FormBuilder
  ) {
    this.departementForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required]],
      horaires: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getDepartementById(Number(id));
    }
  }

  getDepartementById(id: number): void {
    this.departementService.getDepartementById(id).subscribe(
      (data: Departement) => {
        this.departement = data;
        if (this.departement) {
          this.departementForm.patchValue(this.departement);
        }
      },
      (error: any) => this.errorMessage = error.message
    );
  }

  updateDepartement(): void {
    if (this.departementForm.valid && this.departement) {
      this.departementService.updateDepartement(this.departement.id!, this.departementForm.value).subscribe(
        () => this.router.navigate(['/departements']),
        (error: any) => this.errorMessage = error.message
      );
    }
  }
}