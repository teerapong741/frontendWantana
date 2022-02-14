import { ReportsComponent } from './reports.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      // { path: '', redirectTo: 'reports', pathMatch: 'full' },
      // { path: 'reports', component: ReportsComponent },
    ],
  },
  { path: '**', redirectTo: 'cloth-management', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
