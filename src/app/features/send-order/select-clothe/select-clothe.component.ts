import { Status } from './../../../core/enums/status';
import { ConfirmationService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'app-select-clothe',
  templateUrl: './select-clothe.component.html',
  styleUrls: ['./select-clothe.component.scss'],
})
export class SelectClotheComponent implements OnInit, OnDestroy {
  $subscriptions: Subscription | undefined = undefined;
  sourceClothes: any[] = [];
  targetClothes: any[] = [];

  @Input() orderId: number = 0;
  @Output() next = new EventEmitter<boolean>();

  primaryId: number = 0;

  constructor(
    private orderService: OrderService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.targetClothes = !!this.orderService.getOrder()
      ? this.orderService.getOrder().clothes
      : [];
    this.$subscriptions = this.orderService
      .order(this.orderId)
      .subscribe((result) => {
        if (!!result.data) {
          const order = JSON.parse(JSON.stringify(result.data.order));
          this.primaryId = order.id;
          this.onOrderByPrimaryId();
        } else {
          console.error(result.errors[0].message);
        }
      });
  }

  onOrderByPrimaryId(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.$subscriptions = this.orderService
        .findOneByPrimaryId(this.primaryId)
        .subscribe((result) => {
          if (!!result.data) {
            const orders = JSON.parse(
              JSON.stringify(result.data.findOneByPrimaryId)
            );
            const orderFilter: any[] = [];
            console.log(orders);
            if (!!orders && orders.length > 0)
              for (let order of orders) {
                if (order.status == Status.IN)
                  for (let clothe of order.clothes) {
                    orderFilter.push({
                      ...clothe,
                      order_id: order.id,
                      is_out_process: order.isOutProcess,
                    });
                  }
              }
            this.sourceClothes = [];
            this.targetClothes = [];
            this.sourceClothes = [...orderFilter];
            resolve(orderFilter);
          } else {
            reject(result.errors[0].message);
          }
        });
    });
  }

  onNext(): void {
    if (this.targetClothes.length > 0) {
      this.orderService.setOrder({
        ...this.orderService.getOrder(),
        clothes: this.targetClothes,
      });
      this.next.emit(true);
      // this.router.navigate(['./../new-problem'], { relativeTo: this.route });
    } else {
      this.confirmationService.confirm({
        message: 'โปรดเลือกอย่างน้อย 1 รายการ',
        acceptLabel: 'ตกลง',
        rejectVisible: false,
      });
    }
  }

  onCancel(): void {
    this.next.emit(false);
  }

  ngOnDestroy(): void {
    if (!!this.$subscriptions) this.$subscriptions.unsubscribe();
  }
}
