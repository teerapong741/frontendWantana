import { Status } from 'src/app/core/enums/status';
import { FilterInput } from './../../core/interfaces/order.interface';
import { OrderService } from 'src/app/core/services/order.service';
import { AuthService } from './../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  loading = false;
  orders: any = [];

  totalCustomer: number = 0;
  totalSuccess: number = 0;
  totalProblem: number = 0;
  totalClothes: number = 0;

  orderFilters: any = [];

  constructor(private orderService: OrderService) {}

  async ngOnInit() {
    this.loading = true;
    this.orders = await this.onPrimaryOrders();
    let customers: any[] = [];
    let problemClothes: any[] = [];
    let totalClothes = 0;
    for (let order of this.orders) {
      if (!customers.includes(order.customer.key))
        customers.push(order.customer.key);
      for (let cloth of order.clothes) {
        if (!!cloth.clotheHasProblems && cloth.clotheHasProblems.length > 0)
          await problemClothes.push(order);
      }
      totalClothes += order.numClothe;
    }

    // const num: any = await this.onOrderOutLength(ordersFilter).catch(
    //   (error) => console.error(error)
    // );
    // totalSuccess = num;

    // this.totalSuccess = await totalSuccess;
    this.totalCustomer = await customers.length;
    this.totalProblem = await this.orders.filter(
      (order: any) => order.status === 'IN'
    ).length;

    if (this.orders.length > 0) {
      const num: any = await this.onOrderOutLength(this.orders).catch((error) =>
        console.error(error)
      );
      this.totalSuccess = await num;
      this.totalClothes = (await totalClothes) + this.totalSuccess;
    }

    this.loading = false;
  }

  onPrimaryOrders(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let dateMidNight: any = new Date();
      dateMidNight.setHours(0, 0, 0, 0);
      dateMidNight = new Date(dateMidNight).getTime();
      this.orderService.primaryOrders().subscribe(async (result) => {
        if (result.data) {
          const orders = JSON.parse(JSON.stringify(result.data.primaryOrders));
          const ordersFilter = [];
          const customers: any[] = [];
          const problemClothes: any[] = [];
          let totalClothes: number = 0;
          let totalSuccess = 0;
          for (let order of orders) {
            let orderDate = order.created_at;
            orderDate = new Date(orderDate).getTime();
            if (orderDate >= dateMidNight) await ordersFilter.push(order);
          }

          // .filter(order => order.status === Status.IN);
          resolve(ordersFilter);
        } else {
          Swal.fire({
            title: 'Error!',
            text: result.errors[0].message,
            icon: 'error',
            confirmButtonText: 'ตกลง',
          });
          this.loading = false;
        }
      });
    });
  }

  async onOrderOutLength(ordersFilter: any): Promise<number> {
    let num = 0;
    return new Promise(async (resolve, reject) => {
      for (let order of ordersFilter) {
        const numResult = await this.onFindOnePrimary(order.id);
        num = num + numResult;
      }
      return resolve(num);
    });
  }

  onFindOnePrimary(id: number): Promise<number> {
    return new Promise(async (resolve, reject) => {
      this.loading = true;
      this.orderService.findOneByPrimaryId(id).subscribe(async (result) => {
        if (!!result.data) {
          const orders = JSON.parse(
            JSON.stringify(result.data.findOneByPrimaryId)
          );
          let num = 0;
          for (let order of orders) {
            if (order.status === Status.OUT)
              num = await (num + order.clothes.length);
          }
          resolve(num);
        }
      });
    });
  }
}
