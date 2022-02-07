import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/core/services/order.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-send-order',
  templateUrl: './send-order.component.html',
  styleUrls: ['./send-order.component.scss'],
})
export class SendOrderComponent implements OnInit {
  items: any[] = [];

  state: number = 0;
  orderId: number = 0;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.items = [
      { label: 'เลือกรายการผ้า' },
      { label: 'เพิ่มผ้าเสียหายหลังการซัก' },
      { label: 'ตรวจสอบข้อมูล' },
    ];
    const order = this.config.data.order;
    this.orderId = order.id;
    this.orderService.setOrder({
      customer_id: order.customer.id,
      employee_id: order.employee.id,
      order_id: order.id,
      primary_order_id: order.primaryOrderId,
      total_clothes: order.clothes.length
    });
  }

  onSelectClotheNext(event: any) {
    if (event) this.state = 1;
    else {
    }
  }

  onNewProblemNext(event: any) {
    if (event) this.state = 2;
    else this.state = 0;
  }

  onConfirmOrderNext(event: any) {
    if (event) this.ref.close();
    else this.state = 1;
  }
}
