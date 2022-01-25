import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';

import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';

@NgModule({
  imports: [CommonModule, RouterModule, ButtonModule, RippleModule],
  declarations: [NavbarComponent],
  exports: [NavbarComponent],
})
export class NavbarModule {}
