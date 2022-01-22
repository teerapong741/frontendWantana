import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-texture-cloth-management',
  templateUrl: './texture-cloth-management.component.html',
  styleUrls: ['./texture-cloth-management.component.scss'],
})
export class TextureClothManagementComponent implements OnInit {
  textureClothList: any[] = [];
  newTextureVisible: boolean = false;
  newTextureValue: string = '';

  constructor(
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.textureClothList = [
      {
        id: '123',
        name: 'ผ้าขาวบาง',
        value: 7,
      },
    ];
  }

  ngOnInit() {}

  onNewTexture(): void {
    if (!this.newTextureValue) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ชื่อชนิดเนื้อผ้า',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else {
      this.textureClothList.push({
        id: '13',
        name: this.newTextureValue
      })
      this.newTextureVisible = false;
      this.onResetValue();
    }
  }

  onResetValue(): void {
    this.newTextureValue = '';
  }

  onVisibleNewTexture(): void {
    this.newTextureVisible = true;
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
        this.textureClothList = this.textureClothList.filter(
          (texture) => texture.id !== id
        );
      },
    });
  }
}
