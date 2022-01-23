import { EmployeeManagementModule } from './employee-management/employee-management.module';
import { NgModule } from "@angular/core";
import { ClothManagementModule } from "./cloth-management/cloth-management.module";
import { ClothProblemManagementModule } from "./cloth-problem-management/cloth-problem-management.module";
import { TextureClothManagementModule } from "./texture-cloth-management/texture-cloth-management.module";
import { TypeClothManagementModule } from "./type-cloth-management/type-cloth-management.module";

@NgModule({
  imports: [
    ClothManagementModule,
    TextureClothManagementModule,
    TypeClothManagementModule,
    ClothProblemManagementModule,
    EmployeeManagementModule,
  ],
  exports: [
    ClothManagementModule,
    TextureClothManagementModule,
    TypeClothManagementModule,
    ClothProblemManagementModule,
    EmployeeManagementModule,
  ],
})
export class PagesModule {}