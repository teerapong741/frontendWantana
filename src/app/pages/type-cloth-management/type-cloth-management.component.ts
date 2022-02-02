import { createTypeClotheInput } from './../../core/interfaces/type-cloth.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TypeClothService } from 'src/app/core/services/type-cloth.service';
import { typeClothList } from 'src/app/core/values/cloth.value';

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
          console.error(result.errors[0].message);
        }
      });
  }

  onNewTypeCloth(): void {
    if (!this.newTypeClothValue) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ประเภทการใช้งานผ้า',
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
            console.error(result.errors[0].message);
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

  onDelete(id: string | number): void {
    this.confirmationService.confirm({
      message: 'ต้องการจะลบใช่หรือไม่',
      acceptLabel: 'ลบ',
      acceptIcon: 'fas fa-trash',
      acceptButtonStyleClass: 'p-button-danger p-button-raised',
      rejectLabel: 'ยกลิก',
      rejectButtonStyleClass: 'p-button-warning p-button-raised',
      accept: () => {
        this.loading = true;
        this.$subscription = this.typeClothService
          .removeTypeClothe(Number(id))
          .subscribe((result) => {
            this.loading = false;
            if (!!result.data) {
            } else {
              console.error(result.errors[0].message);
            }
          });
      },
    });
  }

  ngOnDestroy(): void {
    if (!!this.$subscription) this.$subscription.unsubscribe();
  }
}
