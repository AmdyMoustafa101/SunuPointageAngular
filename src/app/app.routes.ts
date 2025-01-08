import { Routes } from '@angular/router';
import { DepartementCreateComponent } from './components/Departement/departement-create/departement-create.component';
import { CohortesComponent } from './components/cohortes/cohortes.component';
import { EmployeCreateComponent } from './components/Employe/Employe-create/employe-create/employe-create.component';
// import { ApprenantCreateComponent } from './components/Apprenant/Apprenant-create/apprenant-create/apprenant-create.component';
import { LoginComponent } from './components/login/login/login.component';
import { AdminPageComponent } from './components/Pages/admin-page/admin-page/admin-page.component';
import { VigilePageComponent } from './components/Pages/vigile-page/vigile-page/vigile-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HistoriqueLogsComponent } from './components/historique-logs/historique-logs.component';
import { PointageComponent } from './components/pointage/pointage.component';
import { PresenceComponent } from './components/presence/presence.component';
import { ListComponent } from './components/list/list.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AddCohorteComponent } from './components/add-cohorte/add-cohorte.component';
import { CohorteDetailsComponent } from './components/cohorte-details/cohorte-details.component';
import { UpdateCohorteComponent } from './components/update-cohorte/update-cohorte.component';
import { ListeApprenantsComponent } from './components/apprenant/liste-apprenant.component';
import { ApprenantDetailsComponent } from './components/apprenant-details/apprenant-details.component';
import { UpdateApprenantComponent } from './components/update-apprenant/update-apprenant.component';
import { AddApprenantComponent } from './components/add-apprenant/add-apprenant.component';


export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'departement', component: DepartementCreateComponent },
  { path: 'cohorte', component: CohortesComponent },
  { path: 'cohorte/add', component: AddCohorteComponent }, // Ajoutez cette ligne pour la route vers add-cohorte
  { path: 'cohorte/:id', component: CohorteDetailsComponent },
  // { path: 'cohorte/:id/apprenants', component: ListeApprenantsComponent },
  { path: 'cohorte/:id/apprenants', component: ListeApprenantsComponent },
  { path: 'apprenant/:id', component: ApprenantDetailsComponent },
  { path: 'update-apprenant/:id', component: UpdateApprenantComponent },
  { path: 'apprenants', component: AddApprenantComponent },
  { path: 'cohortes/modifier/:id', component: UpdateCohorteComponent },
  { path: 'employe', component: EmployeCreateComponent },
  // { path: 'apprenant', component: ApprenantCreateComponent },
  { path: 'admin-page', component: AdminPageComponent },
  { path: 'vigile-page', component: VigilePageComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'historiques', component: HistoriqueLogsComponent },
  { path: 'pointage', component: PointageComponent },
  { path: 'presence', component: PresenceComponent },
  { path: 'list', component: ListComponent },
  { path: 'forgot', component: ForgotPassComponent },
  { path: 'change-password/:email', component: ChangePasswordComponent },
];