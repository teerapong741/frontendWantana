import { LoadingModule } from './../../core/components/loading/loading.module';
import { ConfirmOrderSenderComponent } from './confirm-order-sender/confirm-order-sender.component';
import { ClothProblemService } from 'src/app/core/services/cloth-problem.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderService } from 'src/app/core/services/order.service';

import { SenderOrderRoutingModule } from './sender-order-routing.module';

import { SendOrderComponent } from './send-order.component';
import { NewProblemComponent } from './new-problem/new-problem.component';
import { SelectClotheComponent } from './select-clothe/select-clothe.component';

// PrimeNg
import { PickListModule } from 'primeng/picklist';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ChipModule } from 'primeng/chip';
import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AddProblemComponent } from './add-problem/add-problem.component';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
@NgModule({
  imports: [
    CommonModule,
    PickListModule,
    TagModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    SenderOrderRoutingModule,
    StepsModule,
    CardModule,
    ConfirmDialogModule,
    TranslateModule,
    ChipModule,
    TableModule,
    SelectButtonModule,
    DynamicDialogModule,LoadingModule
  ],
  declarations: [
    SendOrderComponent,
    SelectClotheComponent,
    NewProblemComponent,
    AddProblemComponent,
    ConfirmOrderSenderComponent,
  ],
  exports: [
    SendOrderComponent,
    SelectClotheComponent,
    NewProblemComponent,
    AddProblemComponent,
    ConfirmOrderSenderComponent,
  ],
  providers: [
    OrderService,
    ConfirmationService,
    DialogService,
    ClothProblemService,
  ],
})
export class SendOrderModule {}
