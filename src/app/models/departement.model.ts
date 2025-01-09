export interface Departement {
    id?: number;
    nom: string;
    description: string;
    horaires: { jours: { [key: string]: boolean }, heure_debut: string, heure_fin: string }[];
    archive: boolean;
  }