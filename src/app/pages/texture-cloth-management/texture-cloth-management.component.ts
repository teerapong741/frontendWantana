import { createTypeClotheInput } from './../../core/interfaces/texture-cloth.interface';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TextureClothService } from 'src/app/core/services/texture-cloth.service';

@Component({
  selector: 'app-texture-cloth-management',
  templateUrl: './texture-cloth-management.component.html',
  styleUrls: ['./texture-cloth-management.component.scss'],
})
export class TextureClothManagementComponent implements OnInit {
  loading: boolean = false;
  $subscription: Subscription | any = null;
  textureClothList: any[] = [];
  newTextureVisible: boolean = false;
  newTextureValue: string = '';

  constructor(
    private confirmationService: ConfirmationService,
    private router: Router,
    private textureClothService: TextureClothService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.$subscription = this.textureClothService
      .typeClothes()
      .subscribe((result) => {
        this.loading = false;
        if (!!result.data) {
          const typeClothes = JSON.parse(
            JSON.stringify(result.data.typeClothes)
          );
          this.textureClothList = typeClothes;
        } else {
          console.error(result.errors[0].message);
        }
      });
  }

  onNewTexture(): void {
    if (!this.newTextureValue) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ชื่อชนิดเนื้อผ้า',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else {
      this.loading = true;
      const createTypeClotheInput: createTypeClotheInput = {
        name: this.newTextureValue,
      };
      this.$subscription = this.textureClothService
        .createTypeClothe(createTypeClotheInput)
        .subscribe((result) => {
          this.loading = false;
          if (!!result.data) {
            this.newTextureVisible = false;
            this.onResetValue();
          } else {
            console.error(result.errors[0].message);
          }
        });
    }
  }

  onResetValue(): void {
    this.newTextureValue = '';
  }

  onVisibleNewTexture(): void {
    this.newTextureVisible = true;
  }

  onDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'ต้องการจะลบใช่หรือไม่',
      acceptLabel: 'ลบ',
      acceptIcon: 'fas fa-trash',
      acceptButtonStyleClass: 'p-button-danger p-button-raised',
      rejectLabel: 'ยกลิก',
      rejectButtonStyleClass: 'p-button-warning p-button-raised',
      accept: () => {
        this.loading = true;
        this.$subscription = this.textureClothService
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
}
