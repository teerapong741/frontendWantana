import { ConfirmOrderComponent } from './confirm-order/confirm-order.component';
import { ClothTableComponent } from './cloth-table/cloth-table.component';
import { ClothManagementComponent } from './cloth-management.component';
import { AddClothsComponent } from './add-cloths/add-cloths.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'cloths-table', pathMatch: 'full' },
  { path: 'cloths-table', component: ClothTableComponent },
  {
    path: 'add-cloths',
    component: AddClothsComponent,
    data: { animation: 'isLeft' },
  },
  { path: 'confirm-order', component: ConfirmOrderComponent },
  { path: '**', redirectTo: 'cloth-management', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClothManagementRoutingModule {}
