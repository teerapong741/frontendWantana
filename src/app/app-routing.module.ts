import { TextureClothManagementComponent } from './pages/texture-cloth-management/texture-cloth-management.component';
import { ClothManagementComponent } from './pages/cloth-management/cloth-management.component';
import { LoginComponent } from './core/components/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'cloth-management',
    loadChildren: () =>
      import('./pages/cloth-management/cloth-management.module').then(
        (m) => m.ClothManagementModule
      ),
  },
  { path: 'texture-cloth-management', component: TextureClothManagementComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
