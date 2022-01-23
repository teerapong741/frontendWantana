import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss'],
})
export class CustomerManagementComponent implements OnInit {
  customerList: any[] = [];
  newCustomerVisible: boolean = false;

  fname: string = '';
  lname: string = '';
  phone: string = '';
  address: string = '';
  line_id: string = '';
  id_card_number: string = '';

  constructor(
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.customerList = [
      {
        id: '123',
        fname: 'a',
        lname: 'b',
        address: '114 @fsdlf sda',
        phone: 'xxx-xxx-xxxx',
        line_id: '@asdSd_sdf',
        id_card_number: 'xxxx-xxx-xxx-xxx'
      },
    ];
  }

  ngOnInit() {}

  onNewCustomer(): void {
    if (
      !this.fname ||
      !this.lname ||
      !this.phone ||
      !this.address ||
      !this.line_id ||
      !this.id_card_number
    ) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ข้อมูลลูกค้าให้ครบ',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else {
      this.customerList.push({
        id: '13',
        fname: this.fname,
        lname: this.lname,
        phone: this.phone,
        address: this.address,
        line_id: this.line_id,
        id_card_number: this.id_card_number,
      });
      this.newCustomerVisible = false;
      this.onResetValue();
    }
  }

  onResetValue(): void {
    this.fname = '';
    this.lname = '';
    this.phone = '';
    this.address = '';
    this.line_id = '';
    this.id_card_number = '';
  }

  onVisibleNewCustomer(): void {
    this.newCustomerVisible = true;
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
        this.customerList = this.customerList.filter(
          (texture) => texture.id !== id
        );
      },
    });
  }
}
