import { UpdateProblemClotheInput } from './../../core/interfaces/cloth-problem.interface';
import { problemClothList } from './../../core/values/cloth.value';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { createProblemClotheInput } from 'src/app/core/interfaces/cloth-problem.interface';
import { ClothProblemService } from 'src/app/core/services/cloth-problem.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cloth-problem-management',
  templateUrl: './cloth-problem-management.component.html',
  styleUrls: ['./cloth-problem-management.component.scss'],
})
export class ClothProblemManagementComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  $subscription: Subscription | undefined = undefined;

  problemClothes: string[] = problemClothList;

  clothProblemList: any[] = [];
  newClothProblemVisible: boolean = false;
  newClothProblemValue: string = '';

  constructor(
    private confirmationService: ConfirmationService,
    private router: Router,
    private clothProblemService: ClothProblemService
  ) {
    this.clothProblemList = [
      {
        id: '123',
        name: 'ผ้าขาวบาง',
        value: 7,
      },
    ];
  }

  ngOnInit() {
    this.loading = true;
    this.$subscription = this.clothProblemService
      .problemClothes()
      .subscribe((result) => {
        this.loading = false;
        if (!!result.data) {
          const problemClothes = JSON.parse(
            JSON.stringify(result.data.problemClothes)
          );
          this.clothProblemList = problemClothes;
        } else {
          Swal.fire({
            title: 'Error!',
            text: result.errors[0].message,
            icon: 'error',
            confirmButtonText: 'ตกลง',
          });
        }
      });
  }

  onNewClothProblem(): void {
    if (!this.newClothProblemValue) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ชื่อประเภทผ้ามีปัญหา',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else {
      this.loading = true;
      const createProblemClotheInput: createProblemClotheInput = {
        name: this.newClothProblemValue,
      };
      this.$subscription = this.clothProblemService
        .createProblemClothe(createProblemClotheInput)
        .subscribe((result) => {
          this.loading = false;
          if (!!result.data) {
            this.newClothProblemVisible = false;
            this.onResetValue();
          } else {
            Swal.fire({
              title: 'Error!',
              text: result.errors[0].message,
              icon: 'error',
              confirmButtonText: 'ตกลง',
            });
          }
        });
    }
  }

  onResetValue(): void {
    this.newClothProblemValue = '';
  }

  onVisibleNewClothProblem(): void {
    this.newClothProblemVisible = true;
  }

  onDelete(id: string, disable: boolean): void {
    this.confirmationService.confirm({
      message: `ต้องการจะ${!disable ? 'ปิดการมองเห็น' : 'กู้คืน'}ใช่หรือไม่`,
      acceptLabel: `${!disable ? 'ปิดการมองเห็น' : 'กู้คืน'}`,
      acceptIcon: 'fas fa-trash',
      acceptButtonStyleClass: 'p-button-danger p-button-raised',
      rejectLabel: 'ยกเลิก',
      rejectButtonStyleClass: 'p-button-warning p-button-raised',
      accept: () => {
        this.loading = true;
        const updateInput: UpdateProblemClotheInput = {
          isDisable: !disable,
          id: Number(id),
        };
        this.$subscription = this.clothProblemService
          .disableProblemClothe(updateInput)
          .subscribe((result) => {
            this.loading = false;
            if (!!result.data) {
            } else {
              Swal.fire({
                title: 'Error!',
                text: result.errors[0].message,
                icon: 'error',
                confirmButtonText: 'ตกลง',
              });
            }
          });
      },
    });
  }

  ngOnDestroy(): void {
    if (!!this.$subscription) this.$subscription.unsubscribe();
  }
}
