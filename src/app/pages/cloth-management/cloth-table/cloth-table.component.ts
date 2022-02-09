import { LineService } from './../../../core/services/line.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SendOrderComponent } from 'src/app/features/send-order/send-order.component';
import { OrderService } from './../../../core/services/order.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import Swal from 'sweetalert2';

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
    private readonly confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute,
    private lineService: LineService
  ) {}

  async ngOnInit() {
    this.loading = true;
    this.$subscriptions = this.orderService
      .primaryOrders()
      .subscribe((result) => {
        this.loading = false;
        if (!!result.data) {
          const orders = JSON.parse(JSON.stringify(result.data.primaryOrders));
          this.clothList = orders;
          // .filter(
          //   (order: any) => order.primaryOrderId == order.id
          // );
        } else {
          Swal.fire({
            title: 'Error!',
            text: result.errors[0].message,
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        }
      });
  }

  async onOrders(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.loading = true;
      this.$subscriptions = this.orderService
        .primaryOrders()
        .subscribe((result) => {
          this.loading = false;
          if (!!result.data) {
            const orders = JSON.parse(
              JSON.stringify(result.data.primaryOrders)
            );
            resolve(orders);
          } else {
            reject(result.errors[0].message);
          }
        });
    });
  }

  onViewDetail(id: number): void {
    this.router.navigate(['./../order-detail', id], {
      relativeTo: this.route,
    });
  }

  onSendOrder(order: any): void {
    const ref = this.dialogService.open(SendOrderComponent, {
      header: 'ส่งผ้า',
      width: '95%',
      contentStyle: { 'max-height': '85vh', overflow: 'auto' },
      closeOnEscape: true,
      closable: true,
      baseZIndex: 10000,
      data: {
        order,
      },
    });

    ref.onClose.subscribe((result) => {
      this.orderService.setOrder(null);
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
        await this.onRemoveOrder(Number(id)).catch((error) => {
          Swal.fire({
            title: 'Error!',
            text: error,
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        });
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
