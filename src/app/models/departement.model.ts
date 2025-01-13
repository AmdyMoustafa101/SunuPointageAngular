export interface Departement {
horaires_fin: any;
horaires_debut: any;
    statut: string;
    selected: unknown;
    id?: number;
    nom: string;
    description: string;
    horaires: { jours: { [key: string]: boolean }, heure_debut: string, heure_fin: string }[];
    archive: boolean;
    create_at: Date;
    update_at: Date;
  }