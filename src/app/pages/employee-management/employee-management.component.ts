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
import Swal from 'sweetalert2';

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
  editOldPassword: string = '';
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

  fakeInput: string = '';

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
          const employees = JSON.parse(JSON.stringify(result.data.employees));
          this.$subscription = this.employeeService
            .deletedEmployees()
            .subscribe((result) => {
              this.loading = false;
              const deletedEmployees = JSON.parse(
                JSON.stringify(result.data.deletedEmployees)
              );
              const employeeSuperAdmin = employees.filter(
                (em: any) => em.role === 'HEAD_ADMIN'
              );
              let employeeAdmin = employees.filter(
                (em: any) => em.role === 'ADMIN'
              );
              let employeesFilter = employees.filter(
                (em: any) => em.role !== 'ADMIN' && em.role !== 'HEAD_ADMIN'
              );
              const totalEmployees = [
                ...employeeSuperAdmin,
                ...employeeAdmin,
                ...employeesFilter,
                ...deletedEmployees,
              ];
              this.employeeList = totalEmployees;
            });
        } else {
          Swal.fire({
            title: 'Error!',
            text: result.errors[0].message,
            icon: 'error',
            confirmButtonText: 'ตกลง',
          });
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
      !this.role ||
      !this.email
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
    } else if (this.idCard.length !== 13) {
      Swal.fire({
        title: 'คำเตือน',
        text: 'รูปแบบรหัสบัตรประชาชนไม่ถูกต้อง',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
      });
    } else if (this.phone.length !== 10) {
      Swal.fire({
        title: 'คำเตือน',
        text: 'รูปแบบเบอร์มือถือไม่ถูกต้อง',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
      });
    } else if (
      !String(this.email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      Swal.fire({
        title: 'คำเตือน',
        text: 'รูปแบบอีเมล์ไม่ถูกต้อง',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
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
            Swal.fire({
              title: 'Error!',
              text: result.errors[0].message,
              icon: 'error',
              confirmButtonText: 'ตกลง',
            });
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
    this.editOldPassword = '';
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
    this.editOldPassword = '';
    this.editPasswordVisible = true;
  }

  onEditPassword(): void {
    if (!this.editOldPassword || !this.editPassword || !this.confirmPassword) {
      Swal.fire({
        title: 'คำเตือน',
        text: 'โปรดใส่ข้อมูลให้ครบ',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
      });
    } else if (this.editOldPassword !== this.employeeLogin.password) {
      Swal.fire({
        title: 'คำเตือน',
        text: 'รหัสผ่านเดิมไม่ถูกต้อง',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
      });
    } else if (this.editPassword !== this.confirmPassword) {
      Swal.fire({
        title: 'คำเตือน',
        text: 'ยืนยันรหัสผ่านใหม่ไม่ตรงกัน',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
      });
    } else {
      Swal.fire({
        title: 'Warning',
        text: 'ต้องการแก้ไขใช่หรือไม่',
        icon: 'question',
        confirmButtonText: 'ยืนยัน',
        showCancelButton: true,
        cancelButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.isConfirmed) {
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
                Swal.fire({
                  title: 'Error!',
                  text: result.errors[0].message,
                  icon: 'error',
                  confirmButtonText: 'ตกลง',
                });
              }
            });
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
      !this.role ||
      !this.email
    ) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ข้อมูลพนักงานให้ครบ',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (this.idCard.length !== 13) {
      Swal.fire({
        title: 'คำเตือน',
        text: 'รูปแบบรหัสบัตรประชาชนไม่ถูกต้อง',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
      });
    } else if (this.phone.length !== 10) {
      Swal.fire({
        title: 'คำเตือน',
        text: 'รูปแบบเบอร์มือถือไม่ถูกต้อง',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
      });
    } else if (
      !String(this.email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      Swal.fire({
        title: 'คำเตือน',
        text: 'รูปแบบอีเมล์ไม่ถูกต้อง',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
      });
    } else {
      Swal.fire({
        title: 'Warning',
        text: 'ต้องการแก้ไขใช่หรือไม่',
        icon: 'question',
        confirmButtonText: 'ยืนยัน',
        showCancelButton: true,
        cancelButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.isConfirmed) {
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
            .subscribe(async (result) => {
              this.loading = false;
              if (result.data) {
                const employee = result.data.updateEmployee;
                this.editEmployeeVisible = false;
                this.onResetValue();
              } else {
                Swal.fire({
                  title: 'Error!',
                  text: result.errors[0].message,
                  icon: 'error',
                  confirmButtonText: 'ตกลง',
                });
              }
            });
        }
      });
    }
  }

  onResetPassword(id: string, idCard: string): void {
    Swal.fire({
      title: 'ต้องการจะรีเซ็ทรหัสผ่านใช่หรือไม่',
      icon: 'question',
      confirmButtonText: 'ตกลง',
      showCancelButton: true,
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        const updateEmployeeInput: updateEmployeeInput = {
          id: id,
          password: idCard,
        };

        this.$subscription = this.employeeService
          .updateEmployee(updateEmployeeInput)
          .subscribe((result) => {
            this.loading = false;
            if (result.data) {
              this.onResetValue();
            } else {
              Swal.fire({
                title: 'Error!',
                text: result.errors[0].message,
                icon: 'error',
                confirmButtonText: 'ตกลง',
              });
            }
          });
      }
    });
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
          .softRemoveEmployee(Number(id))
          .subscribe((result) => {
            this.loading = false;
            if (!!result.data) {
            } else {
              Swal.fire({
                title: 'Error!',
                text: result.errors[0].message,
                icon: 'error',
                confirmButtonText: 'ตกลง',
              });
            }
          });
      },
    });
  }

  onRestoreEmployee(id: string): void {
    this.confirmationService.confirm({
      message: 'ต้องการจะคืนสิทธิ์พนักงานใช่หรือไม่',
      acceptLabel: 'ลบ',
      acceptIcon: 'fas fa-trash',
      acceptButtonStyleClass: 'p-button-danger p-button-raised',
      rejectLabel: 'ยกลิก',
      rejectButtonStyleClass: 'p-button-warning p-button-raised',
      accept: () => {
        this.loading = true;
        this.$subscription = this.employeeService
          .restoreEmployee(Number(id))
          .subscribe((result) => {
            this.loading = false;
            if (!!result.data) {
            } else {
              Swal.fire({
                title: 'Error!',
                text: result.errors[0].message,
                icon: 'error',
                confirmButtonText: 'ตกลง',
              });
            }
          });
      },
    });
  }

  ngOnDestroy(): void {
    if (!!this.$subscription) this.$subscription.unsubscribe();
  }
}
