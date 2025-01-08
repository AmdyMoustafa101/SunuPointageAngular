import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApprenantService } from '../../services/apprenant.service';
import { ApprenantFormData } from '../../models/apprenant.model';
import { HeaderAndSidebarComponent } from '../header-and-sidebar/header-and-sidebar.component';

@Component({
    selector: 'app-update-apprenant',
    standalone: true,
    imports: [HeaderAndSidebarComponent, ReactiveFormsModule],
    templateUrl: './update-apprenant.component.html',
    styleUrls: ['./update-apprenant.component.css']
})
export class UpdateApprenantComponent implements OnInit {
    apprenantForm: FormGroup;
    apprenant: ApprenantFormData = {
        id: 0,
        nom: '',
        prenom: '',
        adresse: '',
        telephone: '',
        matricule: '',
        cohorte_id: 0,
        photo: undefined,
        archivé: false
    };
    successMessage: string = '';
    errorMessage: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private apprenantService: ApprenantService,
        private fb: FormBuilder
    ) {
        this.apprenantForm = this.fb.group({
            nom: ['', Validators.required],
            prenom: ['', Validators.required],
            adresse: ['', Validators.required],
            telephone: ['', Validators.required],
            matricule: [''],
            photo: [null],
            resse: [''],
            cohorte_id: [0, Validators.required],
            archivé: [false]
        });
    }

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            const id = +idParam;
            this.loadApprenant(id);
        } else {
            console.error('Aucun ID trouvé dans la route');
        }
    }

    loadApprenant(id: number): void {
        this.apprenantService.getApprenantById(id).subscribe({
            next: (data) => {
                this.apprenant = { ...data, photo: undefined };
                this.apprenantForm.patchValue(this.apprenant);
            },
            error: (error) => {
                console.error('Erreur lors du chargement de l\'apprenant:', error);
                alert('Erreur lors du chargement de l\'apprenant');
                this.router.navigate(['/apprenants']);
            }
        });
    }

    updateApprenant(): void {
        if (this.apprenantForm.valid) {
            const idParam = this.route.snapshot.paramMap.get('id');
            const id = idParam ? +idParam : undefined;

            if (id !== undefined) {
                const updatedApprenant = this.apprenantForm.value;

                this.apprenantService.updateApprenant(id, updatedApprenant).subscribe({
                    next: (response) => {
                        console.log('Réponse de l\'API après succès:', response);
                        this.successMessage = 'Apprenant mis à jour avec succès!';
                        this.router.navigate(['/apprenants']);
                    },
                    error: (err) => {
                        console.error('Erreur détaillée:', err);
                        this.errorMessage = 'Erreur lors de la mise à jour de l\'apprenant: ' + err;
                    }
                });
            } else {
                console.error('ID invalide ou introuvable');
                this.errorMessage = 'ID invalide ou introuvable';
            }
        } else {
            console.error('Formulaire invalide:', this.apprenantForm.errors);
            this.errorMessage = 'Le formulaire contient des erreurs.';
        }
    }

    goBack(): void {
        this.router.navigate(['/apprenants']);
    }
}