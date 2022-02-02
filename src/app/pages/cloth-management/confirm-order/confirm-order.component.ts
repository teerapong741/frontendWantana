import { ConfirmationService } from 'primeng/api';
import { NavigationEnd, Router } from '@angular/router';
import { OrderService } from 'src/app/core/services/order.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CreateOrderInput } from 'src/app/core/interfaces/order.interface';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.scss'],
})
export class ConfirmOrderComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  $subscriptions: Subscription | undefined = undefined;
  orderDetail: any = null;

  processOrder: any = [];
  outProcessOrder: any = [];

  totalCloths: number = 0;
  thickCloths: number = 0;
  thinCloths: number = 0;
  specialCloths: number = 0;
  problemCloths: number = 0;
  inProcess: number = 0;
  outProcess: number = 0;

  constructor(
    private readonly orderService: OrderService,
    private readonly router: Router,
    private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.orderDetail = this.orderService.getOrder();
    if (!this.orderDetail) this.router.navigate(['./../cloth-management']);

    const clothList = this.orderDetail.cloth_list;

    this.processOrder = clothList.filter((order: any) => !order.is_out_process);
    this.outProcessOrder = clothList.filter(
      (order: any) => order.is_out_process
    );

    clothList.map((cloth: any) => {
      this.totalCloths += cloth.number;
    });
    clothList
      .filter((cloth: any) => cloth.type === 'ผ้าหนา')
      .map((cloth: any) => {
        this.thickCloths += cloth.number;
      });
    clothList
      .filter((cloth: any) => cloth.type === 'ผ้าบาง')
      .map((cloth: any) => {
        this.thinCloths += cloth.number;
      });
    clothList
      .filter((cloth: any) => cloth.type === 'ผ้าพิเศษ')
      .map((cloth: any) => {
        this.specialCloths += cloth.number;
      });
    clothList
      .filter(
        (cloth: any) =>
          !!cloth.fabric_problem && cloth.fabric_problem.length > 0
      )
      .map((cloth: any) => (this.problemCloths += cloth.number));
    clothList
      .filter((cloth: any) => !cloth.is_out_process)
      .map((cloth: any) => {
        this.inProcess += cloth.number;
      });
    clothList
      .filter((cloth: any) => cloth.is_out_process)
      .map((cloth: any) => {
        this.outProcess += cloth.number;
      });
  }

  onReturn(): void {
    window.history.back();
  }

  onSuccess(): void {
    this.confirmationService.confirm({
      message: 'โปรดตรวจสอบรายการให้ถูกต้องก่อนยืนยัน',
      acceptLabel: 'ตกลง',
      rejectLabel: 'ยกลิก',
      accept: async () => {
        const createOrderInput: CreateOrderInput = {
          customerId: Number(this.orderDetail.customer.id),
          employeeId: this.orderDetail.employee,
        };
        await this.onCreateOrder(createOrderInput);
        this.router.navigate(['./../cloth-management/']);
      },
    });
  }

  async onCreateOrder(createOrderInput: CreateOrderInput): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.$subscriptions = this.orderService
        .createOrder(createOrderInput)
        .subscribe((result) => {
          this.loading = false;
          if (!!result.data) {
            resolve();
          } else {
            reject();
          }
        });
    });
  }

  ngOnDestroy(): void {
    if (!!this.$subscriptions) this.$subscriptions.unsubscribe();
  }
}
