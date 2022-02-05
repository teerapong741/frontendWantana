import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Module
import { ClothManagementRoutingModule } from './cloth-management-routing.module';
import { EditClothModule } from './../../features/edit-cloth/edit-cloth.module';

// Service
import { ClothService } from './../../core/services/cloth.service';
import { AuthService } from './../../core/services/auth.service';
import { EmployeeService } from './../../core/services/employee.service';
import { CustomerService } from './../../core/services/customer.service';
import { OrderService } from './../../core/services/order.service';

//Component
import { ClothTableComponent } from './cloth-table/cloth-table.component';
import { ConfirmOrderComponent } from './confirm-order/confirm-order.component';
import { ClothManagementComponent } from './cloth-management.component';
import { AddClothsComponent } from './add-cloths/add-cloths.component';

// PrimeNg
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { AddClothModule } from 'src/app/features/add-cloth/add-cloth.module';
import { ChipModule } from 'primeng/chip';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ClothManagementRoutingModule,
    ButtonModule,
    RippleModule,
    TableModule,
    RouterModule,
    InputTextModule,
    DropdownModule,
    AddClothModule,
    DynamicDialogModule,
    ChipModule,
    TranslateModule,
    EditClothModule,
    ConfirmDialogModule,
    TagModule,
  ],
  declarations: [
    ClothManagementComponent,
    AddClothsComponent,
    ClothTableComponent,
    ConfirmOrderComponent,
  ],
  providers: [
    DialogService,
    ConfirmationService,
    OrderService,
    CustomerService,
    EmployeeService,
    AuthService,
    ClothService,
  ],
  exports: [
    ClothManagementComponent,
    AddClothsComponent,
    ClothTableComponent,
    ConfirmOrderComponent,
  ],
})
export class ClothManagementModule {}
