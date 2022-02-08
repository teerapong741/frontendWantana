import { AuthService } from './../../../core/services/auth.service';
import { EmployeeService } from './../../../core/services/employee.service';
import { CustomerService } from './../../../core/services/customer.service';
import { Router } from '@angular/router';
import { EditClothComponent } from './../../../features/edit-cloth/edit-cloth.component';
import { AddClothComponent } from './../../../features/add-cloth/add-cloth.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { customerList } from 'src/app/core/values/customer.value';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'app-add-cloths',
  templateUrl: './add-cloths.component.html',
  styleUrls: ['./add-cloths.component.scss'],
})
export class AddClothsComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  $subscriptions: Subscription | undefined = undefined;

  ref: DynamicDialogRef | null = null;

  customerList: any[] = [];
  customerSelected: any | null = null;

  customerId: string | number = 0;
  phone: string = '';
  address: string = '';
  lineId: string = '';
  employeeId: any = null;
  employeeCode: any = null;

  clothList: any[] = [];

  constructor(
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private readonly orderService: OrderService,
    private readonly customerService: CustomerService,
    private readonly employeeService: EmployeeService,
    private readonly authService: AuthService
  ) {}

  ngOnInit() {
    this.loading = true;
    // this.customerList = customerList;
    // this.$subscriptions = this.orderService
    const codeEmployee = this.authService.isCodeEmployee();
    this.employeeId = codeEmployee.id;
    this.employeeCode = codeEmployee.key;

    this.$subscriptions = this.customerService
      .customers()
      .subscribe((result) => {
        this.loading = false;
        if (!!result.data) {
          const customers = JSON.parse(JSON.stringify(result.data.customers));
          const customersTrim = [];
          for (let customer of customers) {
            customersTrim.push({
              id: customer.id,
              name: `${customer.key} ${customer.firstName} ${customer.lastName}`,
              key: customer.key,
              firstName: customer.firstName,
              lastName: customer.lastName,
              phone: customer.phoneNumber,
              lineId: customer.lineUserId,
              address: customer.address,
            });
          }
          this.customerList = customersTrim;
        } else {
          console.error(result.errors[0].message);
        }
      });

    const orderDetail = this.orderService.getOrder();
    if (!!orderDetail) {
      this.customerSelected = orderDetail.customer;
      this.onSelectedCustomer();
      this.clothList = orderDetail.cloth_list;
    }
  }

  onSelectedCustomer(): void {
    this.customerId = this.customerSelected.id;
    this.phone = this.customerSelected.phone;
    this.address = this.customerSelected.address;
    this.lineId = this.customerSelected.lineId;
  }

  onClearCustomerValue(): void {
    this.customerId = 0;
    this.phone = '';
    this.address = '';
    this.lineId = '';
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

  async onNext(): Promise<void> {
    if (
      !this.customerSelected ||
      !this.phone ||
      !this.address ||
      // !this.lineId ||
      !this.employeeId ||
      this.clothList.length < 1
    ) {
      this.confirmationService.confirm({
        message: 'โปรดกรอกข้อมูลให้ครบ',
        acceptVisible: true,
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    } else {
      await this.orderService
        .setOrder({
          customer: this.customerSelected,
          phone: this.phone,
          address: this.address,
          line_id: this.lineId,
          employee_id: this.employeeId,
          employee_key: this.employeeCode,
          cloth_list: this.clothList,
        })
        .then(() => {
          this.router.navigate(['./../cloth-management/confirm-order']);
        });
    }
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
    if (!!this.$subscriptions) this.$subscriptions.unsubscribe();
  }
}
