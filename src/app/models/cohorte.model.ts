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
    statut: StatutCohorte;
    selected?: boolean;  // Ajout de la propriété 'selected' pour gérer la sélection
}

interface Horaire {
    jours: { [key: string]: boolean };
    heure_debut: string;
    heure_fin: string;
}
