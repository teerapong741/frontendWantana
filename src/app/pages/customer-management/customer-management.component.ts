import { AddressService } from './../../core/services/address.service';
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

  provinces: any[] = [];
  provinceSelected: any = null;
  districts: any[] = [];
  districtSelected: any = null;
  subDistricts: any[] = [];
  subDistrictSelected: any = null;
  postAddress: string = '';

  constructor(
    private confirmationService: ConfirmationService,
    private router: Router,
    private customerService: CustomerService,
    public authService: AuthService,
    private readonly addressService: AddressService
  ) {}

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
            const date2: any = new Date(b.created_at);
            const result = date1 - date2;
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
  }

  onSelectedProvince(): void {
    this.districtSelected = null;
    this.subDistrictSelected = null;
    console.log(this.provinceSelected);
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

  onNewCustomer(): void {
    const names: string[] = this.customerList.map(
      ({ fname, lname }: any) => `${fname} ${lname}`
    );
    const idCards: string[] = this.customerList.map(
      ({ idCard }: any) => idCard
    );
    const phones: string[] = this.customerList.map(
      ({ phoneNumber }: any) => phoneNumber
    );
    const emails: string[] = this.customerList.map(({ email }: any) => email);
    if (!this.idCard) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ข้อมูลเลขบัตรประชาชน',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.fname) {
      this.confirmationService.confirm({
        message: 'โปรดกรอกชื่อ',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.lname) {
      this.confirmationService.confirm({
        message: 'โปรดกรอกนามสกุล',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.phone) {
      this.confirmationService.confirm({
        message: 'โปรดกรอกหมายเลขมือถือ',
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
    }
    // else if (!this.subDistrictSelected) {
    //   this.confirmationService.confirm({
    //     message: 'โปรดเลือกตำบล',
    //     acceptVisible: true,
    //     acceptLabel: 'ตกลง',
    //     rejectVisible: false,
    //   });
    // }
    else if (!this.email) {
      this.confirmationService.confirm({
        message: 'โปรดกรอกอีเมล',
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
    } else if (
      names.includes(`${this.fname.trim()} ${this.lname.trim()}`) ||
      idCards.includes(this.idCard.trim()) ||
      phones.includes(this.phone.trim()) ||
      emails.includes(this.email.trim())
    ) {
      Swal.fire({
        title: 'คำเตือน',
        text: 'มีข้อมูลนี้อยู่ในระบบแล้ว',
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
        proVince: this.provinceSelected.name,
        disTrict: this.districtSelected.name,
        postalCode: +this.postAddress,
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

  async onVisibleEditCustomer(customer: any): Promise<void> {
    await this.addressService.provinces().subscribe(async (result) => {
      if (result.data) {
        const provinces = result.data;
        const filter = [];
        for (let p of provinces) {
          await filter.push({
            name: p.province,
            label: p.province,
          });
        }
        this.provinces = await filter;
        this.provinceSelected = await {
          name: customer.proVince,
          label: customer.proVince,
        };
      }
      return Promise.resolve();
    });

    await this.addressService
      .districtsOfProvince(customer.proVince)
      .subscribe(async (result) => {
        if (result.data) {
          const districts = result.data;
          const filter = [];
          for (let p of districts) {
            await filter.push({
              name: p,
              label: p,
            });
          }
          this.districts = await filter;
          this.districtSelected = {
            name: customer.disTrict,
            label: customer.disTrict,
          };
        }
        return Promise.resolve();
      });

    this.editCustomerVisible = true;
    this.idCustomer = customer.id;
    this.idCard = customer.idCard;
    this.fname = customer.firstName;
    this.lname = customer.lastName;
    this.phone = customer.phoneNumber;
    this.address = customer.address;
    this.email = customer.email;
    this.lineId = customer.lineUserId;
    this.postAddress = customer.postalCode;
  }

  onEditCustomer(): void {
    const names: any[] = this.customerList.map(({ id, fname, lname }: any) => {
      if (id !== this.idCustomer) `${fname} ${lname}`;
    });
    const idCards: any[] = this.customerList.map(({ id, idCard }: any) => {
      if (id !== this.idCustomer) idCard;
    });
    const phones: any[] = this.customerList.map(({ id, phoneNumber }: any) => {
      if (id !== this.idCustomer) phoneNumber;
    });
    const emails: any[] = this.customerList.map(({ id, email }: any) => {
      if (id !== this.idCustomer) email;
    });
    if (!this.idCard) {
      this.confirmationService.confirm({
        message: 'โปรดใส่ข้อมูลเลขบัตรประชาชน',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.fname) {
      this.confirmationService.confirm({
        message: 'โปรดกรอกชื่อ',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.lname) {
      this.confirmationService.confirm({
        message: 'โปรดกรอกนามสกุล',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else if (!this.phone) {
      this.confirmationService.confirm({
        message: 'โปรดกรอกหมายเลขมือถือ',
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
    }
    // else if (!this.subDistrictSelected) {
    //   this.confirmationService.confirm({
    //     message: 'โปรดเลือกตำบล',
    //     acceptVisible: true,
    //     acceptLabel: 'ตกลง',
    //     rejectVisible: false,
    //   });
    // }
    else if (!this.email) {
      this.confirmationService.confirm({
        message: 'โปรดกรอกอีเมล',
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
    } else if (
      names.includes(`${this.fname.trim()} ${this.lname.trim()}`) ||
      idCards.includes(this.idCard.trim()) ||
      phones.includes(this.phone.trim()) ||
      emails.includes(this.email.trim())
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
          const updateCustomerInput: UpdateCustomerInput = {
            id: Number(this.idCustomer),
            idCard: this.idCard,
            firstName: this.fname,
            lastName: this.lname,
            address: this.address,
            phoneNumber: this.phone,
            email: this.email,
            lineUserId: this.lineId,
            proVince: this.provinceSelected.name,
            disTrict: this.districtSelected.name,
            postalCode: +this.postAddress,
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
