import { OrderService } from './../../../core/services/order.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-cloth-table',
  templateUrl: './cloth-table.component.html',
  styleUrls: ['./cloth-table.component.scss'],
})
export class ClothTableComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  $subscriptions: Subscription | undefined = undefined;

  clothList: any[] = [];

  constructor(
    private readonly orderService: OrderService,
    private readonly confirmationService: ConfirmationService
  ) {}

  async ngOnInit() {
    this.loading = true;
    this.$subscriptions = this.orderService.orders().subscribe((result) => {
      this.loading = false;
      if (!!result.data) {
        const orders = JSON.parse(JSON.stringify(result.data.orders));
        this.clothList = orders;
      } else {
        console.error(result.errors[0].message);
      }
    });
  }

  async onOrders(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.loading = true;
      this.$subscriptions = this.orderService.orders().subscribe((result) => {
        this.loading = false;
        if (!!result.data) {
          const orders = JSON.parse(JSON.stringify(result.data.orders));
          resolve(orders);
        } else {
          reject(result.errors[0].message);
        }
      });
    });
  }

  onDelete(id: number): void {
    // this.confirmationService.confirm({message: 'hel'})
    this.confirmationService.confirm({
      message: 'ต้องการลบรายการใช้หรือไม่',
      acceptLabel: 'ลบ',
      acceptIcon: 'fas fa-trash',
      acceptButtonStyleClass: 'p-button-danger p-button-raised',
      rejectLabel: 'ยกลิก',
      rejectButtonStyleClass: 'p-button-warning p-button-raised',
      accept: async () => {
        await this.onRemoveOrder(Number(id)).catch((error) =>
          console.error(error)
        );
      },
    });
  }

  async onRemoveOrder(id: number): Promise<any> {
    this.loading = true;
    return new Promise(async (resolve, reject) => {
      this.$subscriptions = this.orderService
        .removeOrder(Number(id))
        .subscribe((result) => {
          this.loading = false;
          if (!!result.data) {
            const order = JSON.parse(JSON.stringify(result.data.removeOrder));
            resolve(order);
          } else {
            reject(result.errors[0].message);
          }
        });
    });
  }

  ngOnDestroy(): void {
    if (this.$subscriptions) this.$subscriptions.unsubscribe();
  }
}
