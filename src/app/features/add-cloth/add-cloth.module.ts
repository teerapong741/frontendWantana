import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddClothComponent } from './add-cloth.component';

// PrimeNg
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SelectButtonModule,
    InputNumberModule,
    ButtonModule,
    RippleModule,
  ],
  declarations: [AddClothComponent],
  exports: [AddClothComponent],
})
export class AddClothModule {}
