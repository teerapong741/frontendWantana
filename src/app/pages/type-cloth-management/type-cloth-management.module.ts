import { LoadingModule } from 'src/app/core/components/loading/loading.module';
import { TypeClothService } from './../../core/services/type-cloth.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Component
import { TypeClothManagementComponent } from './type-cloth-management.component';
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
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
    DialogModule,LoadingModule
  ],
  declarations: [TypeClothManagementComponent],
  exports: [TypeClothManagementComponent],
  providers: [DialogService, ConfirmationService, TypeClothService],
})
export class TypeClothManagementModule {}
