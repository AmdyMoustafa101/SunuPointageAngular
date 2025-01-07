// src/app/models/cohorte.model.ts

export enum StatutCohorte {
    ACTIVE = 'active',
    TERMINEE = 'terminee'
}

export interface Cohorte {
    id: number; // ID de la cohorte
    nom: string;
    description: string;
    horaires: Horaire[];
    annee: number;
    statut: StatutCohorte; // Utilisation de l'énumération pour le statut
}

interface Horaire {
    jours: string[];
    heure_debut: string;
    heure_fin: string;
}