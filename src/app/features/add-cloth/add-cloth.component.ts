import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  fabricProblemOptions,
  typeOfUseOptions,
  typeOptions,
  typeSpecialOptions,
} from 'src/app/core/values/cloth.value';

@Component({
  selector: 'app-add-cloth',
  templateUrl: './add-cloth.component.html',
  styleUrls: ['./add-cloth.component.scss'],
})
export class AddClothComponent implements OnInit {
  typeOptions: any[] = [];
  typeSelected: any = null;

  typeOfUseOptions: any[] = [];
  typeOfUseSelected: any = null;

  typeSpecialOptions: any[] = [];
  typeSpecialSelected: any = null;

  fabricProblemOptions: any[] = [];
  fabricProblemSelected: any = null;

  number: number = 1;

  constructor(public ref: DynamicDialogRef) {}

  ngOnInit() {
    this.typeOptions = typeOptions;
    this.typeOfUseOptions = typeOfUseOptions;
    this.typeSpecialOptions = typeSpecialOptions;
    this.fabricProblemOptions = fabricProblemOptions;

    this.typeSelected = typeOptions[0].value;
    this.typeOfUseSelected = typeOfUseOptions[0].value;
    this.typeSpecialSelected = typeSpecialOptions[0].value;
  }

  onAdd(): void {
    this.ref.close({
      type: this.typeSelected,
      type_of_use: this.typeOfUseSelected,
      type_special: this.typeSpecialSelected,
      fabric_problem: this.fabricProblemSelected,
      number: this.number
    });
  }
}
