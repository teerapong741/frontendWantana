import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNg
import { LoadingComponent } from './loading.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [LoadingComponent],
  exports: [LoadingComponent],
})
export class LoadingModule {}
