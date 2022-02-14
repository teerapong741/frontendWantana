import { ThaiDateModule } from 'src/app/core/pipes/thai-date.module';
import { LoadingModule } from 'src/app/core/components/loading/loading.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';

import { TableModule } from 'primeng/table';
@NgModule({
  imports: [CommonModule, FormsModule, TableModule, LoadingModule, ThaiDateModule],
  declarations: [DashboardComponent],
  exports: [DashboardComponent],
})
export class DashboardModule {}
