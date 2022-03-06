import { specialClothList } from './../../core/values/cloth.value';
import {
  createSpecialClotheInput,
  UpdateSpecialClotheInput,
} from './../../core/interfaces/special-cloth.interface';
import { SpecialClothService } from './../../core/services/special-cloth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-special-cloth-management',
  templateUrl: './special-cloth-management.component.html',
  styleUrls: ['./special-cloth-management.component.scss'],
})
export class SpecialClothManagementComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  $subscription: Subscription | undefined;

  specialClothes: string[] = specialClothList;

  specialClothList: any[] = [];
  newSpecialClothVisible: boolean = false;
  newSpecialClothValue: string = '';

  constructor(
    private confirmationService: ConfirmationService,
    private router: Router,
    private specialClothService: SpecialClothService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.$subscription = this.specialClothService
      .specialClothes()
      .subscribe((result) => {
        this.loading = false;
        if (!!result.data) {
          const specialClothes = JSON.parse(
            JSON.stringify(result.data.specialClothes)
          );
          this.specialClothList = specialClothes;
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

  onNewSpecialCloth(): void {
    const names: any = this.specialClothList.map(({ name }: any) => name);
    if (!this.newSpecialClothValue) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ชื่อประเภทผ้าพิเศษ',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (names.includes(this.newSpecialClothValue.trim().split(' ').join(''))) {
      this.confirmationService.confirm({
        message: 'มีประเภทผ้าพิเศษนี้แล้ว',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else {
      this.loading = true;
      const createSpecialClotheInput: createSpecialClotheInput = {
        name: this.newSpecialClothValue,
      };
      this.$subscription = this.specialClothService
        .createSpecialClothe(createSpecialClotheInput)
        .subscribe((result) => {
          this.loading = false;
          if (!!result.data) {
            this.newSpecialClothVisible = false;
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
    this.newSpecialClothValue = '';
  }

  onVisibleNewSpecialCloth(): void {
    this.newSpecialClothVisible = true;
  }

  onDelete(id: string | number, disable: boolean): void {
    this.confirmationService.confirm({
      message: `ต้องการจะ${!disable ? 'ปิดการมองเห็น' : 'กู้คืน'}ใช่หรือไม่`,
      acceptLabel: `${!disable ? 'ปิดการมองเห็น' : 'กู้คืน'}`,
      acceptIcon: 'fas fa-trash',
      acceptButtonStyleClass: 'p-button-danger p-button-raised',
      rejectLabel: 'ยกเลิก',
      rejectButtonStyleClass: 'p-button-warning p-button-raised',
      accept: () => {
        this.loading = true;
        const updateInput: UpdateSpecialClotheInput = {
          isDisable: !disable,
          id: Number(id),
        };
        this.$subscription = this.specialClothService
          .disableSpecialClothe(updateInput)
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
