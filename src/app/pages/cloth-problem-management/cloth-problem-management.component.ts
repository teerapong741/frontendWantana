import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-cloth-problem-management',
  templateUrl: './cloth-problem-management.component.html',
  styleUrls: ['./cloth-problem-management.component.scss'],
})
export class ClothProblemManagementComponent implements OnInit {
  clothProblemList: any[] = [];
  newClothProblemVisible: boolean = false;
  newClothProblemValue: string = '';

  constructor(
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.clothProblemList = [
      {
        id: '123',
        name: 'ผ้าขาวบาง',
        value: 7,
      },
    ];
  }

  ngOnInit() {}

  onNewClothProblem(): void {
    if (!this.newClothProblemValue) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ชื่อประเภทผ้ามีปัญหา',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else {
      this.clothProblemList.push({
        id: '13',
        name: this.newClothProblemValue,
      });
      this.newClothProblemVisible = false;
      this.onResetValue();
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
        this.clothProblemList = this.clothProblemList.filter(
          (texture) => texture.id !== id
        );
      },
    });
  }
}
