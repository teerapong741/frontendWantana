import { specialClothList } from './../../core/values/cloth.value';
import { createSpecialClotheInput } from './../../core/interfaces/special-cloth.interface';
import { SpecialClothService } from './../../core/services/special-cloth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';

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
          console.error(result.errors[0].message);
        }
      });
  }

  onNewSpecialCloth(): void {
    if (!this.newSpecialClothValue) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ชื่อประเภทผ้าพิเศษ',
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
            console.error(result.errors[0].message);
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
        this.$subscription = this.specialClothService
          .removeSpecialClothe(Number(id))
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
