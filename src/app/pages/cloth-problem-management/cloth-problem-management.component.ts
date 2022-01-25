import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { createProblemClotheInput } from 'src/app/core/interfaces/cloth-problem.interface';
import { ClothProblemService } from 'src/app/core/services/cloth-problem.service';

@Component({
  selector: 'app-cloth-problem-management',
  templateUrl: './cloth-problem-management.component.html',
  styleUrls: ['./cloth-problem-management.component.scss'],
})
export class ClothProblemManagementComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  $subscription: Subscription | undefined = undefined;

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
          console.error(result.errors[0].message);
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
            console.error(result.errors[0].message);
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

  onDelete(id: string): void {
    this.confirmationService.confirm({
      message: 'ต้องการจะลบใช่หรือไม่',
      acceptLabel: 'ลบ',
      acceptIcon: 'fas fa-trash',
      acceptButtonStyleClass: 'p-button-danger p-button-raised',
      rejectLabel: 'ยกลิก',
      rejectButtonStyleClass: 'p-button-warning p-button-raised',
      accept: () => {
        this.loading = true;
        this.$subscription = this.clothProblemService
          .removeProblemClothe(Number(id))
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