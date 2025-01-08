// src/app/models/apprenant.model.ts

export interface Apprenant {
    id?: number;              // Optionnel car auto-généré
    nom: string;
    prenom: string;
    adresse: string;
    telephone: string;
    matricule: string;
    photo?: File;          // Optionnel car nullable
    cohorte_id?: number;
    archivé: boolean;
    created_at?: string;     // Timestamps Laravel
    updated_at?: string;     // Timestamps Laravel
}

// Interface pour les statistiques
export interface ApprenantStats {
    nombre_cohortes: number;
    nombre_apprenants: number;
}

// Interface pour la création d'un apprenant (FormData)
export interface ApprenantFormData {
    id?: number; // Si c'est un ajout, cet ID pourrait ne pas être nécessaire
    nom: string;
    prenom: string;
    adresse?: string; // Optionnel
    telephone?: string; // Optionnel
    matricule: string;
    photo?: File; // Pour le fichier, si applicable
    resse?: string; // Ajoutez cette propriété si nécessaire
    cohorte_id?: number; // Ajoutez cette propriété si nécessaire
    archivé: boolean;
}

// Interface pour la réponse de l'API
export interface ApprenantResponse {
    status: number;
    data: Apprenant;
    message?: string;
}

// Interface pour la liste des apprenants
export interface ApprenantListResponse {
    status: number;
    data: Apprenant[];
    message?: string;
}