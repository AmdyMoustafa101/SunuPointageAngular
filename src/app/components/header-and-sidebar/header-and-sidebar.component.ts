import { Component, OnInit } from '@angular/core';
import { EmployeService } from '../../services/employe.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { HistoriqueLogsComponent } from '../historique-logs/historique-logs.component';

import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-header-and-sidebar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './header-and-sidebar.component.html',
  styleUrl: './header-and-sidebar.component.css'
})
export class HeaderAndSidebarComponent  implements OnInit{
  dropdowns: { [key: string]: boolean } = {};

  // Affiche le dropdown
  showDropdown(dropdownId: string): void {
    this.dropdowns[dropdownId] = true;
    const dropdownMenu = document.getElementById(`${dropdownId}Menu`);
    if (dropdownMenu) {
      dropdownMenu.classList.add('show');
    }
  }

  // Masque le dropdown
  hideDropdown(dropdownId: string): void {
    this.dropdowns[dropdownId] = false;
    const dropdownMenu = document.getElementById(`${dropdownId}Menu`);
    if (dropdownMenu) {
      dropdownMenu.classList.remove('show');
    }
  }

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

  isSidebarVisible: boolean = true;
  dropdownVisible: boolean = false; // Variable pour contrôler l'affichage du dropdown

  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
  // Méthode pour afficher/masquer le dropdown
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  showProfileModal() {
    Swal.fire({
      title: `<div style="display: flex; align-items: center; justify-content: center; flex-direction: column;">
                <img src="${this.admin?.photo || 'assets/default-photo.jpg'}" style="width: 150px; height: 150px; object-fit: cover; border-radius: 50%;">


                <button class="btn btn-link text-primary" id="change-photo-btn" style="text-decoration: none;">
                  <i class="fas fa-pencil-alt"></i> Modifier la photo
                </button>
              </div>`,
      html: `<p><b>Nom:</b> ${this.admin?.nom}</p>
             <p><b>Prénom:</b> ${this.admin?.prenom}</p>
             <p><b>Email:</b> ${this.admin?.email}</p>
             <p><b>Fonction:</b> ${this.admin?.fonction}</p>
             <p><b>Rôle:</b> ${this.admin?.role}</p>
             <p><b>Téléphone:</b> ${this.admin?.telephone}</p>
             <button class="btn btn-warning w-100" id="change-password-btn">Changer le mot de passe</button>`,
      showConfirmButton: false,
      didOpen: () => {
        // Gérer la modification de la photo
        const changePhotoBtn = document.getElementById('change-photo-btn');
        changePhotoBtn?.addEventListener('click', () => {
          Swal.fire({
            title: 'Modifier la photo',
            input: 'file',
            inputAttributes: {
              accept: 'image/*',
              'aria-label': 'Télécharger une nouvelle photo',
            },
            showCancelButton: true,
            confirmButtonText: 'Télécharger',
            preConfirm: (file) => {
              if (!file) {
                Swal.showValidationMessage('Veuillez sélectionner une photo.');
                return null;
              }
              return file;
            },
          }).then((result) => {
            if (result.isConfirmed && result.value) {
              const file = result.value;
              const formData = new FormData();
              formData.append('photo', file);

              this.employeService.updatePhoto(this.admin.id, formData).subscribe({
                next: (response) => {
                  this.admin.photo = response.updatedPhotoUrl; // Mettre à jour la photo localement
                  Swal.fire('Succès', 'Photo mise à jour avec succès.', 'success');
                },
                error: () => {
                  Swal.fire('Erreur', "La mise à jour de la photo a échoué.", 'error');
                },
              });
            }
          });
        });

        // Gérer le changement de mot de passe
        const changePasswordBtn = document.getElementById('change-password-btn');
        changePasswordBtn?.addEventListener('click', () => {
          Swal.fire({
            title: 'Changer le mot de passe',
            html: `<input type="password" id="current-password" class="swal2-input" placeholder="Mot de passe actuel">
                   <input type="password" id="new-password" class="swal2-input" placeholder="Nouveau mot de passe">
                   <input type="password" id="confirm-password" class="swal2-input" placeholder="Confirmer le mot de passe">`,
            showCancelButton: true,
            confirmButtonText: 'Changer',
            preConfirm: () => {
              const currentPassword = (document.getElementById('current-password') as HTMLInputElement).value;
              const newPassword = (document.getElementById('new-password') as HTMLInputElement).value;
              const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement).value;

              if (!currentPassword || !newPassword || !confirmPassword) {
                Swal.showValidationMessage('Veuillez remplir tous les champs.');
                return null;
              } else if (newPassword !== confirmPassword) {
                Swal.showValidationMessage('Les mots de passe ne correspondent pas.');
                return null;
              }

              return { currentPassword, newPassword, confirmPassword };
            },
          }).then((result) => {
            if (result.isConfirmed && result.value) {
              const { currentPassword, newPassword, confirmPassword } = result.value;

              this.employeService.changePassword(
                this.admin.id,
                currentPassword,
                newPassword,
                confirmPassword
              ).subscribe({
                next: () => Swal.fire('Succès', 'Mot de passe changé avec succès.', 'success'),
                error: () => Swal.fire('Erreur', "Le changement de mot de passe a échoué.", 'error'),
              });
            }
          });
        });

      },
    });
  }



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
