import {
  createTypeClotheInput,
  UpdateTypeClotheInput,
} from './../../core/interfaces/type-cloth.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TypeClothService } from 'src/app/core/services/type-cloth.service';
import { typeClothList } from 'src/app/core/values/cloth.value';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-type-cloth-management',
  templateUrl: './type-cloth-management.component.html',
  styleUrls: ['./type-cloth-management.component.scss'],
})
export class TypeClothManagementComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  $subscription: Subscription | undefined;

  typeClothes: string[] = typeClothList;

  typeClothList: any[] = [];
  newTypeClothVisible: boolean = false;
  newTypeClothValue: string = '';

  constructor(
    private confirmationService: ConfirmationService,
    private router: Router,
    private typeClothService: TypeClothService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.$subscription = this.typeClothService
      .typeClothes()
      .subscribe((result) => {
        this.loading = false;
        if (!!result.data) {
          const typeClothes = JSON.parse(
            JSON.stringify(result.data.typeClothes)
          );
          this.typeClothList = typeClothes;
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

  onNewTypeCloth(): void {
    const names = this.typeClothList.map(({ name }: any) => name);
    if (!this.newTypeClothValue) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ประเภทการใช้งานผ้า',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (names.includes(this.newTypeClothValue.trim().split(' ').join(''))) {
      this.confirmationService.confirm({
        message: 'มีผระเภทการใช้งานนี้แล้ว',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else {
      this.loading = true;
      const createTypeClotheInput: createTypeClotheInput = {
        name: this.newTypeClothValue,
      };
      this.$subscription = this.typeClothService
        .createTypeClothe(createTypeClotheInput)
        .subscribe((result) => {
          this.loading = false;
          if (!!result.data) {
            this.newTypeClothVisible = false;
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
    this.newTypeClothValue = '';
  }

  onVisibleNewTypeCloth(): void {
    this.newTypeClothVisible = true;
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
        const updateInput: UpdateTypeClotheInput = {
          isDisable: !disable,
          id: Number(id),
        };
        this.$subscription = this.typeClothService
          .disableTypeClothe(updateInput)
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
