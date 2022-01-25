import { CustomerManagementComponent } from './pages/customer-management/customer-management.component';
import { EmployeeManagementComponent } from './pages/employee-management/employee-management.component';
import { ClothProblemManagementComponent } from './pages/cloth-problem-management/cloth-problem-management.component';
import { TypeClothManagementComponent } from './pages/type-cloth-management/type-cloth-management.component';
import { TextureClothManagementComponent } from './pages/texture-cloth-management/texture-cloth-management.component';
import { ClothManagementComponent } from './pages/cloth-management/cloth-management.component';
import { LoginComponent } from './core/components/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './core/auth/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { role: ['ADMIN', 'SUB_ADMIN'] },
  },
  {
    path: 'cloth-management',
    loadChildren: () =>
      import('./pages/cloth-management/cloth-management.module').then(
        (m) => m.ClothManagementModule
      ),
    canActivate: [AuthGuard],
    data: { role: ['ADMIN', 'SUB_ADMIN'] },
  },
  {
    path: 'texture-cloth-management',
    component: TextureClothManagementComponent,
    canActivate: [AuthGuard],
    data: { role: ['ADMIN'] },
  },
  {
    path: 'type-cloth-management',
    component: TypeClothManagementComponent,
    canActivate: [AuthGuard],
    data: { role: ['ADMIN'] },
  },
  {
    path: 'cloth-problem-management',
    component: ClothProblemManagementComponent,
    canActivate: [AuthGuard],
    data: { role: ['ADMIN'] },
  },
  {
    path: 'employee-management',
    component: EmployeeManagementComponent,
    canActivate: [AuthGuard],
    data: { role: ['ADMIN'] },
  },
  {
    path: 'customer-management',
    component: CustomerManagementComponent,
    canActivate: [AuthGuard],
    data: { role: ['ADMIN', 'SUB_ADMIN'] },
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
