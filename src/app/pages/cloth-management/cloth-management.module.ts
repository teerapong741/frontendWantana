import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClothManagementComponent } from './cloth-management.component';

// PrimeNg 
import {ButtonModule} from 'primeng/button'
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [CommonModule, ButtonModule, RippleModule, TableModule, RouterModule],
  declarations: [ClothManagementComponent],
  exports: [ClothManagementComponent],
})
export class ClothManagementModule {}
