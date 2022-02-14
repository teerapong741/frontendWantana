import { AuthService } from './../../core/services/auth.service';
import { UpdateCustomerInput } from './../../core/interfaces/customer.interface';
import { CustomerService } from './../../core/services/customer.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CreateCustomerInput } from 'src/app/core/interfaces/customer.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss'],
})
export class CustomerManagementComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  $subscription: Subscription | undefined = undefined;

  customerList: any[] = [];
  newCustomerVisible: boolean = false;
  editCustomerVisible: boolean = false;

  idCustomer: string = '';
  idCard: string = '';
  fname: string = '';
  lname: string = '';
  phone: string = '';
  address: string = '';
  lineId: string = '';
  email: string = '';

  constructor(
    private confirmationService: ConfirmationService,
    private router: Router,
    private customerService: CustomerService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.$subscription = this.customerService
      .customers()
      .subscribe((result) => {
        this.loading = false;
        if (!!result.data) {
          const customers = JSON.parse(JSON.stringify(result.data.customers));
          this.customerList = customers.sort((a: any, b: any) => {
            const date1: any = new Date(a.created_at);
            const date2: any = new Date(b.created_at)
            const result = date2 - date1
            return result;
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
  }

  onNewCustomer(): void {
    if (
      !this.idCard ||
      !this.fname ||
      !this.lname ||
      !this.phone ||
      !this.address ||
      !this.email
    ) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ข้อมูลลูกค้าให้ครบ',
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
      const createCustomerInput: CreateCustomerInput = {
        idCard: this.idCard,
        firstName: this.fname,
        lastName: this.lname,
        address: this.address,
        phoneNumber: this.phone,
        email: this.email,
      };

      this.$subscription = this.customerService
        .createCustomer(createCustomerInput)
        .subscribe((result) => {
          this.loading = false;
          if (result.data) {
            this.newCustomerVisible = false;
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
    this.idCustomer = '';
    this.idCard = '';
    this.fname = '';
    this.lname = '';
    this.phone = '';
    this.address = '';
    this.lineId = '';
    this.email = '';
  }

  onVisibleNewCustomer(): void {
    this.newCustomerVisible = true;
  }

  onVisibleEditCustomer(customer: any): void {
    this.editCustomerVisible = true;
    this.idCustomer = customer.id;
    this.idCard = customer.idCard;
    this.fname = customer.firstName;
    this.lname = customer.lastName;
    this.phone = customer.phoneNumber;
    this.address = customer.address;
    this.email = customer.email;
    this.lineId = customer.lineUserId;
  }

  onEditCustomer(): void {
    if (
      !this.idCard ||
      !this.fname ||
      !this.lname ||
      !this.phone ||
      !this.address ||
      !this.email
    ) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ข้อมูลลูกค้าให้ครบ',
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
      const updateCustomerInput: UpdateCustomerInput = {
        id: Number(this.idCustomer),
        idCard: this.idCard,
        firstName: this.fname,
        lastName: this.lname,
        address: this.address,
        phoneNumber: this.phone,
        email: this.email,
        lineUserId: this.lineId,
      };

      this.$subscription = this.customerService
        .updateCustomer(updateCustomerInput)
        .subscribe((result) => {
          this.loading = false;
          if (result.data) {
            this.editCustomerVisible = false;
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
        this.$subscription = this.customerService
          .removeCustomer(Number(id))
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
