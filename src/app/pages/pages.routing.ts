import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { PagesComponent } from './pages.component';
import { RegisterComponent } from '../auth/register/register.component';

const routes: Routes = [
  { path: 'dashboard', component: PagesComponent, children:[
    { path: '', component: DashboardComponent},
    { path: 'progress', component: ProgressComponent},
    { path: 'grafica1', component: RegisterComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
