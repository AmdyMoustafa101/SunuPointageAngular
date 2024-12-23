import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderAndSidebarComponent } from "../header-and-sidebar/header-and-sidebar.component";
@Component({
  selector: 'app-historique-logs',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, HeaderAndSidebarComponent],
  templateUrl: './historique-logs.component.html',
  styleUrl: './historique-logs.component.css'
})
export class HistoriqueLogsComponent implements OnInit {

  logs: any[] = [];
  search: string = '';
  date: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getLogs();
  }

  isSidebarVisible: boolean = true; // Par défaut, le sidebar est visible.

  // Exemple d'intégration avec une communication entre composants
  toggleSidebar(state: boolean): void {
    this.isSidebarVisible = state;
  }

  getLogs(): void {
    const params: any = { page: this.currentPage, limit: this.limit };
    if (this.search) params.search = this.search;
    if (this.date) params.date = this.date;

    this.http.get('http://localhost:3000/api/logs', { params }).subscribe((response: any) => {
      this.logs = response.logs;
      this.currentPage = response.currentPage;
      this.totalPages = response.totalPages;
    });
  }

  onSearch(): void {
    this.currentPage = 1; // Réinitialiser à la première page lors d'une nouvelle recherche
    this.getLogs();
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.getLogs();
    }
  }

}
