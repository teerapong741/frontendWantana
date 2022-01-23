import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss'],
})
export class EmployeeManagementComponent implements OnInit {
  employeeList: any[] = [];
  newEmployeeVisible: boolean = false;

  fname: string = '';
  lname: string = '';
  phone: string = '';
  address: string = '';
  password: string = '';
  confirm_password: string = '';

  constructor(
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.employeeList = [
      {
        id: '123',
        fname: 'a',
        lname: 'b',
        address: '114 @fsdlf sda',
        phone: 'xxx-xxx-xxxx',
      },
    ];
  }

  ngOnInit() {}

  onNewEmployee(): void {
    if (
      !this.fname ||
      !this.lname ||
      !this.phone ||
      !this.address ||
      !this.password ||
      !this.confirm_password
    ) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ข้อมูลพนักงานให้ครบ',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (this.password.trim() !== this.confirm_password.trim()) {
      this.confirmationService.confirm({
        message: 'โปรดใส่รหัสผ่านให้ตรงกัน',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else {
      this.employeeList.push({
        id: '13',
        fname: this.fname,
        lname: this.lname,
        address: this.address,
        phone: this.phone,
      });
      this.newEmployeeVisible = false;
      this.onResetValue();
    }
  }

  onResetValue(): void {
    this.fname = '';
    this.lname = '';
    this.phone = '';
    this.address = '';
    this.password = '';
  }

  onVisibleNewEmployee(): void {
    this.newEmployeeVisible = true;
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
        this.employeeList = this.employeeList.filter(
          (texture) => texture.id !== id
        );
      },
    });
  }
}
