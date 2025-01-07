// cohorte-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CohorteService } from '../../services/cohorte.service';
import { Cohorte } from '../../models/cohorte.model';

@Component({
    selector: 'app-cohorte-details',
    templateUrl: './cohorte-details.component.html',
    styleUrls: ['./cohorte-details.component.css']
})
export class CohorteDetailsComponent implements OnInit {
    cohorte!: Cohorte;
    errorMessage: string = '';

    constructor(
        private route: ActivatedRoute,
        private cohorteService: CohorteService
    ) {}

    ngOnInit(): void {
        this.loadCohorte();
    }

    private loadCohorte(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
            this.errorMessage = 'ID de cohorte non fourni';
            return;
        }

        this.cohorteService.getCohorteById(Number(id)).subscribe({
            next: (data) => {
                this.cohorte = data;
            },
            error: (err) => {
                this.errorMessage = `Erreur lors du chargement de la cohorte : ${err.message}`;
            }
        });
    }
}