import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-type-cloth-management',
  templateUrl: './type-cloth-management.component.html',
  styleUrls: ['./type-cloth-management.component.scss'],
})
export class TypeClothManagementComponent implements OnInit {
  typeClothList: any[] = [];
  newTypeClothVisible: boolean = false;
  newTypeClothValue: string = '';

  constructor(
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.typeClothList = [
      {
        id: '123',
        name: 'ผ้าขาวบาง',
        value: 7,
      },
    ];
  }

  ngOnInit() {}

  onNewTypeCloth(): void {
    if (!this.newTypeClothValue) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ประเภทการใช้งานผ้า',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else {
      this.typeClothList.push({
        id: '13',
        name: this.newTypeClothValue,
      });
      this.newTypeClothVisible = false;
      this.onResetValue();
    }
  }

  onResetValue(): void {
    this.newTypeClothValue = '';
  }

  onVisibleNewTypeCloth(): void {
    this.newTypeClothVisible = true;
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
        this.typeClothList = this.typeClothList.filter(
          (texture) => texture.id !== id
        );
      },
    });
  }
}
