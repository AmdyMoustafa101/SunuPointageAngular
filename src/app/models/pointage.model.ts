export interface Pointage {
  utilisateur_id: string;
  nom: string;
  prenom: string;
  role: string;
  date: string; // Date au format ISO
  heure_arrivee?: string; // Heure d'arrivée, optionnelle
  heure_depart?: string;  // Heure de départ, optionnelle
  vigile_matricule: string;
  vigile_prenom: string;
}
