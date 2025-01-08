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
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';  // Importez votre guard
import { ForgotPassComponent } from './components/forgot-pass/forgot-pass.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ApprenantListComponent } from './components/apprenant-list/apprenant-list.component';
import { EmployeListComponent } from './components/employe-list/employe-list.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {path: 'departement', component: DepartementCreateComponent},
  {path: 'cohorte', component: CohortesComponent},
  {path: 'employe', component: EmployeCreateComponent},
  {path: 'apprenant', component: ApprenantCreateComponent},
  {path: 'admin-page', component: AdminPageComponent, canActivate: [AuthGuard]},
  {path: 'vigile-page', component: VigilePageComponent, canActivate: [AuthGuard]},
  { path: 'historiques', component: HistoriqueLogsComponent, canActivate: [AuthGuard]},
  { path: 'pointage', component: PointageComponent, canActivate: [AuthGuard]},
  { path: 'presence', component: PresenceComponent, canActivate: [AuthGuard]},
  { path: 'list', component: ListComponent},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'forgot', component: ForgotPassComponent },
  { path: 'change-password/:email', component: ChangePasswordComponent },
  { path: 'app-list', component: ApprenantListComponent },
  { path: 'emp-list', component: EmployeListComponent },

];
