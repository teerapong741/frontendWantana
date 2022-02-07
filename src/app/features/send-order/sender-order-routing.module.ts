import { ConfirmOrderSenderComponent } from './confirm-order-sender/confirm-order-sender.component';
import { SendOrderComponent } from 'src/app/features/send-order/send-order.component';
import { NewProblemComponent } from './new-problem/new-problem.component';
import { SelectClotheComponent } from './select-clothe/select-clothe.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: SendOrderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SenderOrderRoutingModule {}
