import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ClothProblemService } from 'src/app/core/services/cloth-problem.service';
import { SpecialClothService } from 'src/app/core/services/special-cloth.service';
import { TextureClothService } from 'src/app/core/services/texture-cloth.service';
import { TypeClothService } from 'src/app/core/services/type-cloth.service';
import {
  fabricProblemOptions,
  typeOfUseOptions,
  typeOptions,
  typeSpecialOptions,
} from 'src/app/core/values/cloth.value';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-cloth',
  templateUrl: './edit-cloth.component.html',
  styleUrls: ['./edit-cloth.component.scss'],
})
export class EditClothComponent implements OnInit, OnDestroy {
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

  number: number = 1;
  isOutProcess: boolean = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private readonly typeClothService: TypeClothService,
    private readonly textureClothService: TextureClothService,
    private readonly clothProblemService: ClothProblemService,
    private readonly specialClothService: SpecialClothService
  ) {}

  ngOnInit() {
    // this.typeOptions = typeOptions;
    // this.typeOfUseOptions = typeOfUseOptions;
    // this.typeSpecialOptions = typeSpecialOptions;
    // this.fabricProblemOptions = fabricProblemOptions;
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
            if (!type.isDisable)
              typeClothsFilter.push({
                ...type,
                value: type.name,
              });
          }

          this.typeOfUseOptions = typeClothsFilter;
        } else {
          Swal.fire({
            title: 'Error!',
            text: result.errors[0].message,
            icon: 'error',
            confirmButtonText: 'Cool',
          });
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
          const sortClothsFilter = [this.defaultOption];
          for (let sort of sortCloths) {
            if (!sort.isDisable)
              sortClothsFilter.push({
                ...sort,
                value: sort.name,
              });
          }

          this.typeOptions = sortClothsFilter;
        } else {
          Swal.fire({
            title: 'Error!',
            text: result.errors[0].message,
            icon: 'error',
            confirmButtonText: 'Cool',
          });
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
            if (!special.isDisable)
              specialClothsFilter.push({
                ...special,
                value: special.name,
              });
          }

          this.typeSpecialOptions = specialClothsFilter;
        } else {
          Swal.fire({
            title: 'Error!',
            text: result.errors[0].message,
            icon: 'error',
            confirmButtonText: 'Cool',
          });
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
          Swal.fire({
            title: 'Error!',
            text: result.errors[0].message,
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        }
      });

    const cloth = this.config.data.cloth;
    this.typeSelected = cloth.type;
    this.typeOfUseSelected = cloth.type_of_use;
    this.typeSpecialSelected = cloth.type_special;
    this.fabricProblemSelected = cloth.fabric_problem;
    this.isOutProcess = cloth.is_out_process;
    this.number = cloth.number;
  }

  onChangeType(type: any): void {
    if (type !== 'ผ้าพิเศษ') this.typeSpecialSelected = null;
  }

  onEdit(): void {
    this.ref.close({
      key: this.config.data.cloth.key,
      type: this.typeSelected,
      type_of_use: this.typeOfUseSelected,
      type_special: this.typeSpecialSelected,
      fabric_problem: this.fabricProblemSelected,
      is_out_process: this.isOutProcess,
      number: this.number,
    });
  }

  ngOnDestroy(): void {
    if (!!this.$subscription) this.$subscription.unsubscribe();
  }
}
