import { ThaiDateModule } from './../../core/pipes/thai-date.module';
import { ThaiDatePipe } from './../../core/pipes/thai-date.pipe';
import { OrderService } from 'src/app/core/services/order.service';
import { ClothProblemService } from 'src/app/core/services/cloth-problem.service';
import { EmployeeService } from './../../core/services/employee.service';
import { CustomerService } from './../../core/services/customer.service';
import { FormsModule } from '@angular/forms';
import { LoadingModule } from 'src/app/core/components/loading/loading.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';

import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReportsRoutingModule,
    LoadingModule,
    DropdownModule,
    InputTextModule,
    CalendarModule,
    TableModule,
    ThaiDateModule,
  ],
  declarations: [ReportsComponent],
  providers: [
    CustomerService,
    EmployeeService,
    ClothProblemService,
    OrderService,
  ],
})
export class ReportsModule {}
