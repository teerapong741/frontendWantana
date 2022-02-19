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
  isDisable: boolean = false;

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
          this.clothList = orders.sort(function (a: any, b: any) {
            const date1: any = new Date(a.created_at);
            const date2: any = new Date(b.created_at);
            const result = date2 - date1;
            return result;
          });
          // .filter(
          //   (order: any) => order.primaryOrderId == order.id
          // );
        } else {
          Swal.fire({
            title: 'Error!',
            text: result.errors[0].message,
            icon: 'error',
            confirmButtonText: 'ตกลง',
          });
        }
      });
    await this.orderService.setOrder(null);
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
    this.isDisable = true;
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
      this.isDisable = false;
      this.orderService.setOrder(null);
      // window.location.reload();
    });
  }

  onDelete(id: number): void {
    // this.confirmationService.confirm({message: 'hel'})
    Swal.fire({
      title: 'คำเตือน',
      text: 'ต้องการลบรายการใช้หรือไม่',
      icon: 'warning',
      confirmButtonText: 'ลบ',
      confirmButtonColor: 'red',
      showCancelButton: true,
      cancelButtonText: 'ยกเลิก',
      cancelButtonColor: 'orange',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.onRemoveOrder(Number(id)).catch((error) => {
          Swal.fire({
            title: 'Error!',
            text: error,
            icon: 'error',
            confirmButtonText: 'ตกลง',
          });
        });
      }
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
