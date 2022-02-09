import { DashboardModule } from './dashboard/dashboard.module';
import { CustomerManagementModule } from './customer-management/customer-management.module';
import { EmployeeManagementModule } from './employee-management/employee-management.module';
import { NgModule } from '@angular/core';
import { ClothManagementModule } from './cloth-management/cloth-management.module';
import { ClothProblemManagementModule } from './cloth-problem-management/cloth-problem-management.module';
import { TextureClothManagementModule } from './texture-cloth-management/texture-cloth-management.module';
import { TypeClothManagementModule } from './type-cloth-management/type-cloth-management.module';
import { SpecialClothManagementModule } from './special-cloth-management/special-cloth-management.module';

@NgModule({
  imports: [
    DashboardModule,
    ClothManagementModule,
    TextureClothManagementModule,
    TypeClothManagementModule,
    ClothProblemManagementModule,
    EmployeeManagementModule,
    CustomerManagementModule,
    SpecialClothManagementModule,
  ],
  exports: [
    DashboardModule,
    ClothManagementModule,
    TextureClothManagementModule,
    TypeClothManagementModule,
    ClothProblemManagementModule,
    EmployeeManagementModule,
    CustomerManagementModule,
    SpecialClothManagementModule,
  ],
})
export class PagesModule {}
