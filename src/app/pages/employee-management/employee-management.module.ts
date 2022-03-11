import { LoadingModule } from 'src/app/core/components/loading/loading.module';
import { EmployeeService } from './../../core/services/employee.service';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
//Component
import { EmployeeManagementComponent } from './employee-management.component';
import { TranslateModule } from '@ngx-translate/core';
// PrimeNg
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ChipModule } from 'primeng/chip';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { PasswordModule } from 'primeng/password';
import {InputMaskModule} from 'primeng/inputmask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    TableModule,
    RouterModule,
    InputTextModule,
    DropdownModule,
    DynamicDialogModule,
    ChipModule,
    TranslateModule,
    ConfirmDialogModule,
    DialogModule,
    LoadingModule,
    PasswordModule,
    TagModule,
    InputMaskModule
  ],
  declarations: [EmployeeManagementComponent],
  exports: [EmployeeManagementComponent],
  providers: [DialogService, ConfirmationService, EmployeeService],
})
export class EmployeeManagementModule {}
