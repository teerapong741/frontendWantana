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
import Swal from 'sweetalert2';
import { DialogService as dialog } from './../../../core/services/dialog.service';

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
  clothListDisplay: any[] = [];
  tabList: any[] = [];
  tabActive: string = '';

  constructor(
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private readonly orderService: OrderService,
    private readonly customerService: CustomerService,
    private readonly employeeService: EmployeeService,
    private readonly authService: AuthService,
    private readonly dialog: dialog
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
          Swal.fire({
            title: 'Error!',
            text: result.errors[0].message,
            icon: 'error',
            confirmButtonText: 'ตกลง',
          });
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
      width: this.dialog.dialogSize,
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      closeOnEscape: true,
      closable: true,
      baseZIndex: 10000,
    });

    this.ref.onClose.subscribe(async (item: any) => {
      if (item) {
        const isExist = [];
        let isEqualProblem = true;
        for (let cloth of this.clothList) {
          if (!!cloth.fabric_problem && !!item.fabric_problem) {
            const clothProblem = cloth.fabric_problem.map(
              ({ name }: any) => name
            );
            const itemProblem = item.fabric_problem.map(
              ({ name }: any) => name
            );
            isEqualProblem = this.compare(clothProblem, itemProblem);
          }
          if (
            JSON.stringify(cloth.type) === JSON.stringify(item.type) &&
            JSON.stringify(cloth.type_of_use) ===
              JSON.stringify(item.type_of_use) &&
            isEqualProblem &&
            JSON.stringify(cloth.type_special) ===
              JSON.stringify(item.type_special) &&
            JSON.stringify(cloth.is_out_process) ===
              JSON.stringify(item.is_out_process) &&
            JSON.stringify(cloth.key) !== JSON.stringify(item.key)
          )
            await isExist.push(cloth);
        }

        if (isExist.length === 0)
          this.clothList.push({
            key: (Math.random() + 1).toString(36).substring(7),
            ...item,
          });
        else {
          const index = this.clothList.findIndex(
            (cloth) =>
              JSON.stringify(cloth.type) === JSON.stringify(item.type) &&
              JSON.stringify(cloth.type_of_use) ===
                JSON.stringify(item.type_of_use) &&
              isEqualProblem &&
              JSON.stringify(cloth.type_special) ===
                JSON.stringify(item.type_special) &&
              JSON.stringify(cloth.is_out_process) ===
                JSON.stringify(item.is_out_process)
          );
          this.clothList[index].number =
            this.clothList[index].number + item.number;
        }

        let tabList = this.clothList.filter(
          (cloth: any) => !this.tabList.includes(cloth.type.name)
        );
        tabList = tabList.map(({ type }: any) => type.name);
        this.tabList = this.tabList.concat(tabList);
        this.onChangeTab(item.type.name);
        if (this.tabList.length <= 1) {
          this.clothListDisplay = this.clothList;
        }
      }
    });
  }

  onEditItem(key: string): void {
    const index = this.clothList.findIndex((cloth) => cloth.key === key);

    this.ref = this.dialogService.open(EditClothComponent, {
      header: 'แก้ไขรายการผ้า',
      width: '90%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      closeOnEscape: true,
      closable: true,
      baseZIndex: 10000,
      data: {
        cloth: !!this.clothList[index] ? this.clothList[index] : null,
      },
    });

    this.ref.onClose.subscribe(async (item: any) => {
      if (item) {
        const isExist: any[] = [];
        let isEqualProblem = true;
        for (let cloth of this.clothList) {
          if (!!cloth.fabric_problem && !!item.fabric_problem) {
            const clothProblem = cloth.fabric_problem.map(
              ({ name }: any) => name
            );
            const itemProblem = item.fabric_problem.map(
              ({ name }: any) => name
            );
            isEqualProblem = this.compare(clothProblem, itemProblem);
          }
          if (
            JSON.stringify(cloth.type) === JSON.stringify(item.type) &&
            JSON.stringify(cloth.type_of_use) ===
              JSON.stringify(item.type_of_use) &&
            isEqualProblem &&
            JSON.stringify(cloth.type_special) ===
              JSON.stringify(item.type_special) &&
            JSON.stringify(cloth.is_out_process) ===
              JSON.stringify(item.is_out_process) &&
            JSON.stringify(cloth.key) !== JSON.stringify(item.key)
          )
            await isExist.push(cloth);
        }

        if (isExist.length >= 1) {
          isExist[0].number = isExist[0].number + item.number;
          const indexExist = await this.clothList.findIndex(
            (cloth) => cloth.key === isExist[0].key
          );
          let tab = await this.clothList[indexExist].type.name;
          this.clothList[indexExist] = await isExist[0];
          this.clothList = await this.clothList.filter(
            (cloth) => cloth.key !== item.key
          );
          this.onFilterTabList();
          this.onChangeTab(tab);
        } else {
          this.clothList[index] = await item;
          let tab = await this.clothList[index].type.name;
          this.onFilterTabList();
          this.onChangeTab(tab);
        }
      }
    });
  }

  compare(array1: any[], array2: any[]) {
    if (array1.length != array2.length) {
      return false;
    }

    array1 = array1.slice();
    array1.sort();
    array2 = array2.slice();
    array2.sort();

    for (var i = 0; i < array1.length; i++) {
      if (array1[i] != array2[i]) {
        return false;
      }
    }

    return true;
  }

  onRemoveItem(key: string): void {
    const index = this.clothList.findIndex((cloth) => cloth.key === key);
    let tab = this.clothList[index].type.name;
    this.clothList = this.clothList.filter((cloth, i) => index !== i);
    let clothInType = this.clothList.filter(({ type }) => type.name == tab);
    if (this.clothList.length > 0 && clothInType.length === 0)
      tab = this.clothList[0].type.name;
    this.clothListDisplay = this.clothList;
    this.onFilterTabList();
    this.onChangeTab(tab);
  }

  onFilterTabList(): void {
    let result: any[] = [];
    let tabList = this.clothList.map(({ type }) => type.name);
    tabList.map((list: any) => {
      if (!result.includes(list)) result.push(list);
    });
    this.tabList = result;
  }

  onChangeTab(tab: string): void {
    let displayTab = [];
    displayTab = this.clothList.filter((cloth) => cloth.type.name === tab);
    this.clothListDisplay = displayTab;
    this.tabActive = tab;
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
      Swal.fire({
        title: 'คำเตือน',
        text: 'โปรดกรอกข้อมูลให้ครบ',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
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
