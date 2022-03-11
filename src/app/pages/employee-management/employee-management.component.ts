import { AddressService } from './../../core/services/address.service';
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

  provinces: any[] = [];
  provinceSelected: any = null;
  districts: any[] = [];
  districtSelected: any = null;
  subDistricts: any[] = [];
  subDistrictSelected: any = null;
  postAddress: string = '';
  disabled: boolean = true;
  fakeInput: string = '';

  constructor(
    private confirmationService: ConfirmationService,
    private router: Router,
    private employeeService: EmployeeService,
    public authService: AuthService,
    private readonly addressService: AddressService
  ) {}

  ngOnInit() {
    this.roleOptions = [
      { name: 'ผู้จัดการ', value: Role.ADMIN },
      { name: 'พนักงาน', value: Role.SUB_ADMIN },
    ];

    this.addressService.provinces().subscribe((result) => {
      if (result.data) {
        const provinces = result.data;
        const filter = [];
        for (let p of provinces) {
          filter.push({
            name: p.province,
            label: p.province,
          });
        }
        this.provinces = filter;
      }
    });

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
  onSelectedProvince(): void {
    this.districtSelected = null;
    this.subDistrictSelected = null;
    this.addressService
      .districtsOfProvince(this.provinceSelected.name)
      .subscribe((result) => {
        if (result.data) {
          const districts = result.data;
          const filter = [];
          for (let p of districts) {
            filter.push({
              name: p,
              label: p,
            });
          }
          this.districts = filter;
        }
      });
  }

  onSelectedDistrict(): void {
    this.subDistrictSelected = null;
    this.addressService
      .subDistrictsOfDistrict(
        this.provinceSelected.name,
        this.districtSelected.name
      )
      .subscribe((result) => {
        if (result.data) {
          const subDistricts = result.data;
          const filter = [];
          for (let p of subDistricts) {
            filter.push({
              name: p,
              label: p,
            });
          }
          this.subDistricts = filter;
        }
      });
  }

  onNewEmployee(): void {
    const names: string[] = this.employeeList.map(
      ({ fname, lname }: any) => `${fname} ${lname}`
    );
    const idCards: string[] = this.employeeList.map(
      ({ idCard }: any) => idCard
    );
    const emails: string[] = this.employeeList.map(({ email }) => email);
    const phones: string[] = this.employeeList.map(
      ({ phoneNumber }) => phoneNumber
    );
    if (!this.idCard) {
      this.confirmationService.confirm({
        message: 'โปรดกรอกข้อมูลเลขบัตรประชาชน',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.fname) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ชื่อ',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.lname) {
      this.confirmationService.confirm({
        message: 'โปรดใส่นามสกุล',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.phone) {
      this.confirmationService.confirm({
        message: 'โปรดใส่เบอร์มือถือ',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.address) {
      this.confirmationService.confirm({
        message: 'โปรดกรอกที่อยู่ให้ครบ',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.provinceSelected) {
      this.confirmationService.confirm({
        message: 'โปรดเลือกจังหวัด',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.districtSelected) {
      this.confirmationService.confirm({
        message: 'โปรดเลือกอำเภอ',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.postAddress) {
      this.confirmationService.confirm({
        message: 'โปรดใส่รหัสไปรษณีย์',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (this.postAddress.toString().length !== 5) {
      this.confirmationService.confirm({
        message: 'รูปแบบรหัสไปรษณีย์ไม่ถูกต้อง',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.subDistrictSelected) {
      this.confirmationService.confirm({
        message: 'โปรดเลือกตำบล',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.email) {
      this.confirmationService.confirm({
        message: 'โปรดใส่อีเมล์',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.role) {
      this.confirmationService.confirm({
        message: 'โปรดเลือกสิทธิ์',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (this.idCard.length !== 17) {
      Swal.fire({
        title: 'คำเตือน',
        text: 'รูปแบบรหัสบัตรประชาชนไม่ถูกต้อง',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
      });
    } else if (this.phone.length !== 12) {
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
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[com]{2,}))$/
        )
    ) {
      Swal.fire({
        title: 'คำเตือน',
        text: 'รูปแบบอีเมล์ไม่ถูกต้อง',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
      });
    } else if (
      names.includes(`${this.fname.trim()} ${this.lname.trim()}`) ||
      idCards.includes(this.idCard.trim()) ||
      emails.includes(this.email) ||
      phones.includes(this.phone)
    ) {
      Swal.fire({
        title: 'คำเตือน',
        text: 'มีข้อมูลนี้อยู่ในระบบแล้ว',
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
        password: this.phone,
        role: this.role,
        subDistrict: this.subDistrictSelected.name,
        proVince: this.provinceSelected.name,
        disTrict: this.districtSelected.name,
        postalCode: +this.postAddress,
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
    this.subDistrictSelected = null;
    this.provinceSelected = null;
    this.districtSelected = null;
    this.postAddress = '';
  }

  onVisibleNewEmployee(): void {
    this.newEmployeeVisible = true;
  }

  onVisibleEditEmployee(employee: any): void {
    this.addressService.provinces().subscribe((result) => {
      if (result.data) {
        const provinces = result.data;
        const filter = [];
        for (let p of provinces) {
          filter.push({
            name: p.province,
            label: p.province,
          });
        }
        this.provinces = filter;
      }
    });
    this.addressService
      .districtsOfProvince(employee.proVince)
      .subscribe((result) => {
        if (result.data) {
          const districts = result.data;
          const filter = [];
          for (let p of districts) {
            filter.push({
              name: p,
              label: p,
            });
          }
          this.districts = filter;
        }
      });
    this.addressService
      .subDistrictsOfDistrict(employee.proVince, employee.disTrict)
      .subscribe((result) => {
        if (result.data) {
          const districts = result.data;
          const filter = [];
          for (let p of districts) {
            filter.push({
              name: p,
              label: p,
            });
          }
          this.subDistricts = filter;
        }
      });
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
    this.provinceSelected = {
      name: employee.proVince,
      label: employee.proVince,
    };
    this.districtSelected = {
      name: employee.disTrict,
      label: employee.disTrict,
    };
    this.subDistrictSelected = {
      name: employee.subDistrict,
      label: employee.subDistrict,
    };
    console.log(employee);
    this.postAddress = employee.postalCode;
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
        title: 'คำเตือน',
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
    const names: any[] = this.employeeList.map(
      ({ id, fname, lname }: any): any => {
        if (id !== this.idEmployee) return `${fname} ${lname}`;
      }
    );
    const idCards: any[] = this.employeeList.map(({ id, idCard }: any) => {
      if (id !== this.idEmployee) return idCard;
    });
    const emails: any[] = this.employeeList.map(({ id, email }) => {
      if (id !== this.idEmployee) return email;
    });
    const phones: any[] = this.employeeList.map(({ id, phoneNumber }) => {
      if (id !== this.idEmployee) return phoneNumber;
    });
    if (!this.idCard) {
      this.confirmationService.confirm({
        message: 'โปรดกรอกข้อมูลเลขบัตรประชาชน',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.fname) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ชื่อ',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.lname) {
      this.confirmationService.confirm({
        message: 'โปรดใส่นามสกุล',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.phone) {
      this.confirmationService.confirm({
        message: 'โปรดใส่เบอร์มือถือ',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.address) {
      this.confirmationService.confirm({
        message: 'โปรดกรอกที่อยู่ให้ครบ',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.provinceSelected) {
      this.confirmationService.confirm({
        message: 'โปรดเลือกจังหวัด',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.districtSelected) {
      this.confirmationService.confirm({
        message: 'โปรดเลือกอำเภอ',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.postAddress) {
      this.confirmationService.confirm({
        message: 'โปรดใส่รหัสไปรษณีย์',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (this.postAddress.toString().length !== 5) {
      this.confirmationService.confirm({
        message: 'รูปแบบรหัสไปรษณีย์ไม่ถูกต้อง',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.subDistrictSelected) {
      this.confirmationService.confirm({
        message: 'โปรดเลือกตำบล',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.email) {
      this.confirmationService.confirm({
        message: 'โปรดใส่อีเมล์',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.role) {
      this.confirmationService.confirm({
        message: 'โปรดเลือกสิทธิ์',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (this.idCard.length !== 17) {
      Swal.fire({
        title: 'คำเตือน',
        text: 'รูปแบบรหัสบัตรประชาชนไม่ถูกต้อง',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
      });
    } else if (this.phone.length !== 12) {
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
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[com]{2,}))$/
        )
    ) {
      Swal.fire({
        title: 'คำเตือน',
        text: 'รูปแบบอีเมล์ไม่ถูกต้อง',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
      });
    } else if (
      names.includes(`${this.fname.trim()} ${this.lname.trim()}`) ||
      idCards.includes(this.idCard.trim()) ||
      emails.includes(this.email) ||
      phones.includes(this.phone)
    ) {
      Swal.fire({
        title: 'คำเตือน',
        text: 'มีข้อมูลนี้อยู่ในระบบแล้ว',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
      });
    } else {
      Swal.fire({
        title: 'คำเตือน',
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
            proVince: this.provinceSelected.name,
            disTrict: this.districtSelected.name,
            subDistrict: this.subDistrictSelected.name,
            postalCode: +this.postAddress,
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
      rejectLabel: 'ยกเลิก',
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
      rejectLabel: 'ยกเลิก',
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
