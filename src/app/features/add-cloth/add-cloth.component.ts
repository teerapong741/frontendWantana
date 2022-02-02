import { SpecialClothService } from './../../core/services/special-cloth.service';
import { ClothProblemService } from 'src/app/core/services/cloth-problem.service';
import { TextureClothService } from 'src/app/core/services/texture-cloth.service';
import { TypeClothService } from 'src/app/core/services/type-cloth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
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
export class AddClothComponent implements OnInit, OnDestroy {
  $subscription: Subscription | undefined = undefined;
  loading: boolean = false;
  defaultOption: any = { name: 'ไม่ได้ระบุ', value: null };

  typeOptions: any[] = [];
  typeSelected: any = null;

  typeOfUseOptions: any[] = [];
  typeOfUseSelected: any = null;

  typeSpecialOptions: any[] = [];
  typeSpecialSelected: any = null;

  fabricProblemOptions: any[] = [];
  fabricProblemSelected: any = null;

  isOutProcess: boolean = false;

  number: number = 1;

  constructor(
    public ref: DynamicDialogRef,
    private readonly typeClothService: TypeClothService,
    private readonly textureClothService: TextureClothService,
    private readonly clothProblemService: ClothProblemService,
    private readonly specialClothService: SpecialClothService
  ) {}

  ngOnInit() {
    this.$subscription = this.typeClothService
      .typeClothes()
      .subscribe((result) => {
        this.loading = false;
        if (!!result.data) {
          const typeCloths = JSON.parse(
            JSON.stringify(result.data.typeClothes)
          );
          const typeClothsFilter = [this.defaultOption];
          for (let type of typeCloths) {
            typeClothsFilter.push({
              ...type,
              value: type.name,
            });
          }

          this.typeOfUseOptions = typeClothsFilter;
        } else {
          console.error(result.errors[0].message);
        }
      });

    this.$subscription = this.textureClothService
      .sortClothes()
      .subscribe((result) => {
        this.loading = false;
        if (!!result.data) {
          const sortCloths = JSON.parse(
            JSON.stringify(result.data.sortClothes)
          );
          const sortClothsFilter = [];
          for (let sort of sortCloths) {
            sortClothsFilter.push({
              ...sort,
              value: sort.name,
            });
          }

          this.typeOptions = sortClothsFilter;
          this.typeSelected = sortClothsFilter[0].value;
        } else {
          console.error(result.errors[0].message);
        }
      });

    this.$subscription = this.specialClothService
      .specialClothes()
      .subscribe((result) => {
        this.loading = false;
        if (!!result.data) {
          const specialCloths = JSON.parse(
            JSON.stringify(result.data.specialClothes)
          );
          const specialClothsFilter = [this.defaultOption];
          for (let special of specialCloths) {
            specialClothsFilter.push({
              ...special,
              value: special.name,
            });
          }

          this.typeSpecialOptions = specialClothsFilter;
        } else {
          console.error(result.errors[0].message);
        }
      });

    this.$subscription = this.clothProblemService
      .problemClothes()
      .subscribe((result) => {
        this.loading = false;
        if (!!result.data) {
          const problemCloths = JSON.parse(
            JSON.stringify(result.data.problemClothes)
          );
          const problemClothsFilter = [];
          for (let problem of problemCloths) {
            problemClothsFilter.push({
              ...problem,
              value: problem.name,
            });
          }

          this.fabricProblemOptions = problemClothsFilter;
        } else {
          console.error(result.errors[0].message);
        }
      });
    // this.typeSelected = typeOptions[0].value;
    // this.typeOfUseSelected = typeOfUseOptions[0].value;
    // this.typeSpecialSelected = typeSpecialOptions[0].value;
  }

  onAdd(): void {
    this.ref.close({
      type: this.typeSelected,
      type_of_use: this.typeOfUseSelected,
      type_special: this.typeSpecialSelected,
      fabric_problem: this.fabricProblemSelected,
      is_out_process: this.isOutProcess,
      number: this.number,
    });
  }

  onChangeType(type: any): void {
    if (type !== 'ผ้าพิเศษ') this.typeSpecialSelected = null;
  }

  ngOnDestroy(): void {
    if (!!this.$subscription) this.$subscription.unsubscribe();
  }
}
