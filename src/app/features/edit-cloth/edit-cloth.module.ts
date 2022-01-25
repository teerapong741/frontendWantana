import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditClothComponent } from './edit-cloth.component';

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
  declarations: [EditClothComponent],
  exports: [EditClothComponent],
})
export class EditClothModule {}
