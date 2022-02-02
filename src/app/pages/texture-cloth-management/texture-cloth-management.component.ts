import { textureClothList } from './../../core/values/cloth.value';
import { TextureClothService } from './../../core/services/texture-cloth.service';
import { createTypeClotheInput } from '../../core/interfaces/type-cloth.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { createSortClotheInput } from 'src/app/core/interfaces/texture-cloth.interface';

@Component({
  selector: 'app-texture-cloth-management',
  templateUrl: './texture-cloth-management.component.html',
  styleUrls: ['./texture-cloth-management.component.scss'],
})
export class TextureClothManagementComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  $subscription: Subscription | undefined = undefined;

  textureClothes: any[] = textureClothList;

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
      .sortClothes()
      .subscribe((result) => {
        this.loading = false;
        if (!!result.data) {
          const sortClothes = JSON.parse(
            JSON.stringify(result.data.sortClothes)
          );
          this.textureClothList = sortClothes;
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
      const createSortClotheInput: createSortClotheInput = {
        name: this.newTextureValue,
      };
      this.$subscription = this.textureClothService
        .createSortClothe(createSortClotheInput)
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
          .removeSortClothe(Number(id))
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
