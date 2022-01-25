import { EmployeeService } from '../../services/employee.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ButtonModule, InputTextModule, FormsModule],
  declarations: [LoginComponent],
  exports: [LoginComponent],
  providers: [EmployeeService]
})
export class LoginModule {}
