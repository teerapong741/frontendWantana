import { AuthService } from './../../core/services/auth.service';
import {
  createEmployeeInput,
  updateEmployeeInput,
} from './../../core/interfaces/employee.interface';
import { EmployeeService } from './../../core/services/employee.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Role } from 'src/app/core/enums/role';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss'],
})
export class EmployeeManagementComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  $subscription: Subscription | undefined = undefined;

  employeeList: any[] = [];
  newEmployeeVisible: boolean = false;
  editEmployeeVisible: boolean = false;
  editPasswordVisible: boolean = false;

  editPassword: string = '';

  employeeLogin: any = null;

  roleOptions: any = [];

  idEmployee: string = '';
  idCard: string = '';
  fname: string = '';
  lname: string = '';
  phone: string = '';
  address: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  role: Role = Role.SUB_ADMIN;

  constructor(
    private confirmationService: ConfirmationService,
    private router: Router,
    private employeeService: EmployeeService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.roleOptions = [
      { name: 'ผู้จัดการ', value: Role.ADMIN },
      { name: 'พนักงาน', value: Role.SUB_ADMIN },
    ];

    this.loading = true;
    this.$subscription = this.employeeService
      .employees()
      .subscribe((result) => {
        this.loading = false;
        if (!!result.data) {
          const employees = result.data.employees;
          this.employeeList = employees;
        } else {
          console.error(result.errors[0].message);
        }
      });

    this.employeeLogin = this.authService.isCodeEmployee();
  }

  onNewEmployee(): void {
    if (
      !this.idCard ||
      !this.fname ||
      !this.lname ||
      !this.phone ||
      !this.address ||
      !this.role
    ) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ข้อมูลพนักงานให้ครบ',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (this.password.trim() !== this.confirmPassword.trim()) {
      this.confirmationService.confirm({
        message: 'โปรดใส่รหัสผ่านให้ตรงกัน',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else {
      this.loading = true;
      const createEmployeeInput: createEmployeeInput = {
        idCard: this.idCard,
        firstName: this.fname,
        lastName: this.lname,
        address: this.address,
        phoneNumber: this.phone,
        email: this.email,
        password: this.idCard,
        role: this.role,
      };

      this.$subscription = this.employeeService
        .createEmployee(createEmployeeInput)
        .subscribe((result) => {
          this.loading = false;
          if (result.data) {
            this.newEmployeeVisible = false;
            this.onResetValue();
          } else {
            console.error(result.errors[0].message);
          }
        });
    }
  }

  onResetValue(): void {
    this.idEmployee = '';
    this.idCard = '';
    this.fname = '';
    this.lname = '';
    this.phone = '';
    this.address = '';
    this.password = '';
    this.confirmPassword = '';
    this.editPassword = '';
    this.email = '';
    this.role = Role.SUB_ADMIN;
  }

  onVisibleNewEmployee(): void {
    this.newEmployeeVisible = true;
  }

  onVisibleEditEmployee(employee: any): void {
    this.editEmployeeVisible = true;
    this.idEmployee = employee.id;
    this.idCard = employee.idCard;
    this.fname = employee.firstName;
    this.lname = employee.lastName;
    this.phone = employee.phoneNumber;
    this.address = employee.address;
    this.email = employee.email;
    this.password = employee.password;
    this.role = employee.role;
  }

  onVisibleEditPassword(employee: any): void {
    this.idEmployee = employee.id;
    this.editPassword = '';
    this.confirmPassword = '';
    this.editPasswordVisible = true;
  }

  onEditPassword(): void {
    if (!this.editPassword || !this.confirmPassword) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ข้อมูลให้ครบ',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    }
    if (this.editPassword !== this.confirmPassword) {
      this.confirmationService.confirm({
        message: 'รหัสผ่านไม่ตรงกัน',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else {
      this.loading = true;
      const updateEmployeeInput: updateEmployeeInput = {
        id: this.idEmployee,
        password: this.editPassword,
      };

      this.$subscription = this.employeeService
        .updateEmployee(updateEmployeeInput)
        .subscribe((result) => {
          this.loading = false;
          if (result.data) {
            this.editPasswordVisible = false;
            this.onResetValue();
          } else {
            console.error(result.errors[0].message);
          }
        });
    }
  }

  onEditEmployee(): void {
    if (
      !this.idCard ||
      !this.fname ||
      !this.lname ||
      !this.phone ||
      !this.address ||
      !this.role
    ) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ข้อมูลพนักงานให้ครบ',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else {
      this.loading = true;
      const updateEmployeeInput: updateEmployeeInput = {
        id: this.idEmployee,
        idCard: this.idCard,
        firstName: this.fname,
        lastName: this.lname,
        address: this.address,
        phoneNumber: this.phone,
        email: this.email,
        password: this.idCard,
        role: this.role,
      };

      this.$subscription = this.employeeService
        .updateEmployee(updateEmployeeInput)
        .subscribe((result) => {
          this.loading = false;
          if (result.data) {
            this.editEmployeeVisible = false;
            this.onResetValue();
          } else {
            console.error(result.errors[0].message);
          }
        });
    }
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
        this.$subscription = this.employeeService
          .removeEmployee(Number(id))
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
