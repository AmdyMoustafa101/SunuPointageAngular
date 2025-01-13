import { Routes } from '@angular/router';

// Departements
import { DepartementListComponent } from './components/departement-list/departement-list.component';
import { DepartementDetailsComponent } from './components/departement-details/departement-details.component';
import { DepartementEditComponent } from './components/departement-edit/departement-edit.component';
import { DepartementAddComponent } from './components/departement-add/departement-add.component';

// Cohortes
import { CohortesComponent } from './components/cohortes/cohortes.component';
import { AddCohorteComponent } from './components/add-cohorte/add-cohorte.component';
import { CohorteDetailsComponent } from './components/cohorte-details/cohorte-details.component';
import { UpdateCohorteComponent } from './components/update-cohorte/update-cohorte.component';
import { ListeApprenantsComponent } from './components/apprenant/liste-apprenant.component';
import { ApprenantDetailsComponent } from './components/apprenant-details/apprenant-details.component';
import { UpdateApprenantComponent } from './components/update-apprenant/update-apprenant.component';
import { AddApprenantComponent } from './components/add-apprenant/add-apprenant.component';

// Employes
import { EmployeCreateComponent } from './components/Employe/Employe-create/employe-create/employe-create.component';
import { ListeEmployesComponent } from './components/liste-employes/liste-employes.component';
import { EmployeDetailsComponent } from './components/employe-details/employe-details.component';
import { EmployeEditComponent } from './components/employe-edit/employe-edit.component';
import { EmployeAddComponent } from './components/employe-add/employe-add.component';

// Pages
import { LoginComponent } from './components/login/login/login.component';
import { AdminPageComponent } from './components/Pages/admin-page/admin-page/admin-page.component';
import { VigilePageComponent } from './components/Pages/vigile-page/vigile-page/vigile-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

// Historique
import { HistoriqueLogsComponent } from './components/historique-logs/historique-logs.component';
import { HistoricDComponent } from './components/historic-d/historic-d.component';
import { HistoricCohorteComponent } from './components/historic-C/historic-cohorte/historic-cohorte.component';

// Other components
import { PointageComponent } from './components/pointage/pointage.component';
import { PresenceComponent } from './components/presence/presence.component';
import { ListComponent } from './components/list/list.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

// Leave Requests
import { LeaveRequestFormComponent } from './components/leave-request-form/leave-request-form.component';
// import { LeaveRequestsListComponent } from './components/leave-requests-list/leave-requests-list.component';
// import { LeaveRequestDetailsComponent } from './components/leave-request-details/leave-request-details.component';


// Profile
import { ProfileComponent } from './components/profile/profile.component';

// Paramètres
import { SettingsComponent } from './components/settings/settings.component';



export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    
    // Departements
    { path: 'departements', component: DepartementListComponent },
    { path: 'departement/:id', component: DepartementDetailsComponent },
    { path: 'departement-edit/:id', component: DepartementEditComponent },
    { path: 'departement-add', component: DepartementAddComponent },
    
    // Cohortes
    { path: 'cohorte', component: CohortesComponent },
    { path: 'cohorte/add', component: AddCohorteComponent },
    { path: 'cohorte/:id', component: CohorteDetailsComponent },
    { path: 'cohorte/:id/apprenants', component: ListeApprenantsComponent },
    { path: 'apprenant/:id', component: ApprenantDetailsComponent },
    { path: 'update-apprenant/:id', component: UpdateApprenantComponent },
    { path: 'apprenants', component: AddApprenantComponent },
    { path: 'cohortes/modifier/:id', component: UpdateCohorteComponent },
    
    // Employes
    { path: 'employe', component: EmployeCreateComponent },
    { path: 'employe-details/:id', component: EmployeDetailsComponent },
    { path: 'employe-edit/:id', component: EmployeEditComponent },
    { path: 'employe-add', component: EmployeAddComponent },
    { path: 'liste-employes/:departementId', component: ListeEmployesComponent },
    
    // Pages
    { path: 'admin-page', component: AdminPageComponent },
    { path: 'vigile-page', component: VigilePageComponent },
    { path: 'dashboard', component: DashboardComponent },
    
    // Historique
    { path: 'historiques', component: HistoriqueLogsComponent },
    { path: 'departH/:id', component: HistoricDComponent },
    { path: 'departC/:id', component: HistoricCohorteComponent },
    
    // Congés
    // { path: 'leave-requests', component: LeaveRequestsListComponent },
    { path: 'leave-request/add', component: LeaveRequestFormComponent },
    // { path: 'leave-request/:id', component: LeaveRequestDetailsComponent },


    //Profile
    { path: 'profile', component: ProfileComponent },

    // Paramètres
    { path: 'settings', component: SettingsComponent },

    // Other components
    { path: 'pointage', component: PointageComponent },
    { path: 'presence', component: PresenceComponent },
    { path: 'list', component: ListComponent },
    { path: 'forgot', component: ForgotPassComponent },
    { path: 'change-password/:email', component: ChangePasswordComponent },
];