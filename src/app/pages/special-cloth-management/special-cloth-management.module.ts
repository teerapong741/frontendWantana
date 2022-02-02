import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Service
import { SpecialClothService } from './../../core/services/special-cloth.service';

// Component
import { SpecialClothManagementComponent } from './special-cloth-management.component';
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
  ],
  declarations: [SpecialClothManagementComponent],
  exports: [SpecialClothManagementComponent],
  providers: [DialogService, ConfirmationService, SpecialClothService],
})
export class SpecialClothManagementModule {}
