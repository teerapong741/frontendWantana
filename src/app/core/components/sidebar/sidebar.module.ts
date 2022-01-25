import { AuthService } from './../../services/auth.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [SidebarComponent],
  exports: [SidebarComponent],
  providers: [AuthService]
})
export class SidebarModule {}
