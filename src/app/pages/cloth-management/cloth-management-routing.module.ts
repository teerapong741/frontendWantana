import { OrderDetailComponent } from './order-detail/order-detail.component';
import { ConfirmOrderComponent } from './confirm-order/confirm-order.component';
import { ClothTableComponent } from './cloth-table/cloth-table.component';
import { ClothManagementComponent } from './cloth-management.component';
import { AddClothsComponent } from './add-cloths/add-cloths.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendOrderComponent } from 'src/app/features/send-order/send-order.component';

const routes: Routes = [
  { path: '', redirectTo: 'cloths-table', pathMatch: 'full' },
  { path: 'cloths-table', component: ClothTableComponent },
  {
    path: 'add-cloths',
    component: AddClothsComponent,
    data: { animation: 'isLeft' },
  },
  { path: 'confirm-order', component: ConfirmOrderComponent },
  { path: 'order-detail/:id', component: OrderDetailComponent },
  {
    path: 'send-order',
    loadChildren: () =>
      import('./../../features/send-order/send-order.module').then(
        (m) => m.SendOrderModule
      ),
  },
  { path: '**', redirectTo: 'cloth-management', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClothManagementRoutingModule {}
