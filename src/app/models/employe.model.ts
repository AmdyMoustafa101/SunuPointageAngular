export interface Employe {
    id: number;
    nom: string;
    prenom: string;
    matricule: string;
    telephone: string;
    email: string;
    photo: File;
    adresse: string;
    role: 'simple' | 'vigile' | 'administrateur';  // Utilisation d'une union de chaînes pour le type de rôle
    archive: boolean;
    blocked: boolean;
    selected?: boolean;
    departementId: number;
    created_at: Date;
    updated_at: Date;
  }