import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  fabricProblemOptions,
  typeOfUseOptions,
  typeOptions,
  typeSpecialOptions,
} from 'src/app/core/values/cloth.value';

@Component({
  selector: 'app-edit-cloth',
  templateUrl: './edit-cloth.component.html',
  styleUrls: ['./edit-cloth.component.scss'],
})
export class EditClothComponent implements OnInit {
  typeOptions: any[] = [];
  typeSelected: any = null;

  typeOfUseOptions: any[] = [];
  typeOfUseSelected: any = null;

  typeSpecialOptions: any[] = [];
  typeSpecialSelected: any = null;

  fabricProblemOptions: any[] = [];
  fabricProblemSelected: any = null;

  number: number = 1;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.typeOptions = typeOptions;
    this.typeOfUseOptions = typeOfUseOptions;
    this.typeSpecialOptions = typeSpecialOptions;
    this.fabricProblemOptions = fabricProblemOptions;

    const cloth = this.config.data.cloth;
    this.typeSelected = cloth.type;
    this.typeOfUseSelected = cloth.type_of_use;
    this.typeSpecialSelected = cloth.type_special;
    this.fabricProblemSelected = cloth.fabric_problem;
    this.number = cloth.number;
  }

  onEdit(): void {
    this.ref.close({
      type: this.typeSelected,
      type_of_use: this.typeOfUseSelected,
      type_special: this.typeSpecialSelected,
      fabric_problem: this.fabricProblemSelected,
      number: this.number,
    });
  }
}
