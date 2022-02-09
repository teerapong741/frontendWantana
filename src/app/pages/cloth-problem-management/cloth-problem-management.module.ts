import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

//Component
import { ClothProblemManagementComponent } from './cloth-problem-management.component';
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
import { ClothProblemService } from 'src/app/core/services/cloth-problem.service';
import { LoadingModule } from 'src/app/core/components/loading/loading.module';

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
  declarations: [ClothProblemManagementComponent],
  exports: [ClothProblemManagementComponent],
  providers: [DialogService, ConfirmationService, ClothProblemService],
})
export class ClothProblemManagementModule {}
