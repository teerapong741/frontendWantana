import { AuthService } from './../../services/auth.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { RouterModule } from '@angular/router';

import { SidebarModule as Sidebar } from 'primeng/sidebar';


@NgModule({
  imports: [CommonModule, RouterModule, Sidebar],
  declarations: [SidebarComponent],
  exports: [SidebarComponent],
  providers: [AuthService],
})
export class SidebarModule {}
