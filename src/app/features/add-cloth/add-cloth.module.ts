import { SpecialClothService } from './../../core/services/special-cloth.service';
import { TextureClothService } from 'src/app/core/services/texture-cloth.service';
import { TypeClothService } from './../../core/services/type-cloth.service';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddClothComponent } from './add-cloth.component';

// PrimeNg
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ClothProblemService } from 'src/app/core/services/cloth-problem.service';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SelectButtonModule,
    InputNumberModule,
    ButtonModule,
    RippleModule,
    CheckboxModule,
    InputSwitchModule,
  ],
  declarations: [AddClothComponent],
  exports: [AddClothComponent],
  providers: [
    ClothProblemService,
    TypeClothService,
    TextureClothService,
    SpecialClothService,
  ],
})
export class AddClothModule {}
