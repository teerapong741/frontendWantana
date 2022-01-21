import { Router } from '@angular/router';
import { EditClothComponent } from './../../../features/edit-cloth/edit-cloth.component';
import { AddClothComponent } from './../../../features/add-cloth/add-cloth.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { customerList } from 'src/app/core/values/customer.value';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-add-cloths',
  templateUrl: './add-cloths.component.html',
  styleUrls: ['./add-cloths.component.scss'],
})
export class AddClothsComponent implements OnInit, OnDestroy {
  ref: DynamicDialogRef | null = null;

  customerList: any[] = [];
  customerSelected: any | null = null;

  phone: string = '';
  address: string = '';
  lineId: string = '';
  employeeId: string = '';

  clothList: any[] = [];

  constructor(
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.customerList = customerList;
  }

  newClothList(): void {
    this.ref = this.dialogService.open(AddClothComponent, {
      header: 'เพิ่มรายการผ้า',
      width: '45%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      closeOnEscape: true,
      closable: true,
      baseZIndex: 10000,
    });

    this.ref.onClose.subscribe((item: any) => {
      if (item) {
        this.clothList.push({ ...item });
      }
    });
  }

  onEditItem(index: number): void {
    this.ref = this.dialogService.open(EditClothComponent, {
      header: 'แก้ไขรายการผ้า',
      width: '45%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      closeOnEscape: true,
      closable: true,
      baseZIndex: 10000,
      data: {
        cloth: this.clothList[index],
      },
    });

    this.ref.onClose.subscribe((item: any) => {
      if (item) {
        this.clothList[index] = item;
      }
    });
  }

  onRemoveItem(index: number): void {
    this.clothList = this.clothList.filter((cloth, i) => index !== i);
  }

  onSuccess(): void {
    if (
      !this.customerSelected &&
      !this.phone &&
      !this.address &&
      !this.lineId &&
      !this.employeeId &&
      this.clothList.length > 0
    ) {
      this.confirmationService.confirm({
        message: 'โปรดกรอกข้อมูลให้ครบ',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else {
      this.confirmationService.confirm({
        message: 'โปรดตรวจสอบรายการให้ถูกต้องก่อนยืนยัน',
        acceptLabel: 'ตกลง',
        rejectLabel: 'ยกลิก',
        accept: () => {
          this.router.navigate(['./../cloth-management/']);
        },
      });
    }
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }
}
