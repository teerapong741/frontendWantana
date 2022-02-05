import { OrderService } from './../../../core/services/order.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cloth-table',
  templateUrl: './cloth-table.component.html',
  styleUrls: ['./cloth-table.component.scss'],
})
export class ClothTableComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  $subscriptions: Subscription | undefined = undefined;

  clothList: any[] = [];

  constructor(private readonly orderService: OrderService) {}

  ngOnInit() {
    this.loading = true;
    this.$subscriptions = this.orderService.orders().subscribe((result) => {
      this.loading = false;
      if (!!result.data) {
        const orders = JSON.parse(JSON.stringify(result.data.orders));
        this.clothList = orders.filter(
          (order: any) => order.primaryOrderId == order.id
        );
        console.log(this.clothList);
        console.log(orders);
      } else {
        console.error(result.errors[0].message);
      }
    });
  }

  // onCalTotalClothes(clothes: any): number {
  //   const number: number = 0;
  //   for (let clothe of clothes)
  // }

  onDelete(id: string): void {}

  ngOnDestroy(): void {
    if (this.$subscriptions) this.$subscriptions.unsubscribe();
  }
}
