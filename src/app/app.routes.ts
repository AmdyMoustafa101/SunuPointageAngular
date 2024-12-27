import { Routes } from '@angular/router';
import { DepartementCreateComponent } from './components/Departement/departement-create/departement-create.component';
import { CohortesComponent } from './components/cohortes/cohortes.component';
import { EmployeCreateComponent } from './components/Employe/Employe-create/employe-create/employe-create.component';
import { ApprenantCreateComponent } from './components/Apprenant/Apprenant-create/apprenant-create/apprenant-create.component';
import { LoginComponent } from './components/login/login/login.component';
import { AdminPageComponent } from './components/Pages/admin-page/admin-page/admin-page.component';
import { VigilePageComponent } from './components/Pages/vigile-page/vigile-page/vigile-page.component';
import { HistoriqueLogsComponent } from './components/historique-logs/historique-logs.component';
import { PointageComponent } from './components/pointage/pointage.component';
import { PresenceComponent } from './components/presence/presence.component';
import { ListComponent } from './components/list/list.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {path: 'departement', component: DepartementCreateComponent},
  {path: 'cohorte', component: CohortesComponent},
  {path: 'employe', component: EmployeCreateComponent},
  {path: 'apprenant', component: ApprenantCreateComponent},
  {path: 'admin-page', component: AdminPageComponent},
  {path: 'vigile-page', component: VigilePageComponent},
  { path: 'historiques', component: HistoriqueLogsComponent},
  { path: 'pointage', component: PointageComponent},
  { path: 'presence', component: PresenceComponent},
  { path: 'list', component: ListComponent},

];
