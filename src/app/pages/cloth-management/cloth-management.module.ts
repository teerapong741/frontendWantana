import { EditClothModule } from './../../features/edit-cloth/edit-cloth.module';
import { ClothTableComponent } from './cloth-table/cloth-table.component';
import {  TranslateModule } from '@ngx-translate/core';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClothManagementRoutingModule } from './cloth-management-routing.module';

//Component
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
  ],
  declarations: [
    ClothManagementComponent,
    AddClothsComponent,
    ClothTableComponent,
  ],
  providers: [DialogService, ConfirmationService],
  exports: [ClothManagementComponent, AddClothsComponent, ClothTableComponent],
})
export class ClothManagementModule {}
