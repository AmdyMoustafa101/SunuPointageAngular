import { Routes } from '@angular/router';
import { DepartementCreateComponent } from './components/Departement/departement-create/departement-create.component';
import { CohortesComponent } from './components/cohortes/cohortes.component';
import { EmployeCreateComponent } from './components/Employe/Employe-create/employe-create/employe-create.component';
import { ApprenantCreateComponent } from './components/Apprenant/Apprenant-create/apprenant-create/apprenant-create.component';
import { LoginComponent } from './components/login/login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {path: 'departement', component: DepartementCreateComponent},
  {path: 'cohorte', component: CohortesComponent},
  {path: 'employe', component: EmployeCreateComponent},
  {path: 'apprenant', component: ApprenantCreateComponent}

];
