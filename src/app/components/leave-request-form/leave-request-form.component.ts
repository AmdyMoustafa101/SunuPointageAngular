import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveRequestService } from '../../services/leave-request.service';
import { DepartementService } from '../../services/departement.service';
import { NotificationService } from '../../services/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-leave-request-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './leave-request-form.component.html',
  styleUrls: ['./leave-request-form.component.css']
})
export class LeaveRequestFormComponent implements OnInit {
  leaveRequestForm: FormGroup;
  departments: any[] = [];
  serverErrors: any = {};

  constructor(
    private fb: FormBuilder,
    private leaveRequestService: LeaveRequestService,
    private departmentService: DepartementService,
    private notificationService: NotificationService
  ) {
    this.leaveRequestForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      department: ['', Validators.required],
      type: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      reason: ['']
    });
  }

  ngOnInit() {
    this.departmentService.getDepartements().subscribe(departments => {
      this.departments = departments;
    });
  }

  onSubmit() {
    if (this.leaveRequestForm.valid) {
      this.leaveRequestService.createLeaveRequest(this.leaveRequestForm.value).subscribe(
        response => {
          Swal.fire('Succès', 'Demande de congé créé avec succès!', 'success');
          console.log('Demande de congé créé avec succès!', response);
          this.notificationService.showSuccess('Demande de congé soumise avec succès!');
        },
        error => {
          console.error('An error occurred:', error);
          if (error.status === 422 && error.error && error.error.errors) {
            this.serverErrors = error.error.errors;
          } else {
            Swal.fire('Erreur', 'Une erreur s\'est produite; veuillez réessayer plus tard!', 'error');
            // alert('Une erreur s\'est produite; veuillez réessayer plus tard.');
          }
        }
      );
    }
  }
}