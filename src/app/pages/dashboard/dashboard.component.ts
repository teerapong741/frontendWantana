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

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    let dateMidNight: any = new Date();
    dateMidNight.setHours(0, 0, 0, 0);
    dateMidNight = new Date(dateMidNight).getTime();
    this.loading = true;
    this.orderService.primaryOrders().subscribe(async (result) => {
      this.loading = false;
      if (result.data) {
        const orders = JSON.parse(JSON.stringify(result.data.primaryOrders));
        const ordersFilter = [];
        const customers: any[] = [];
        const problemClothes: any[] = [];
        const successClothes: any[] = [];
        for (let order of orders) {
          let orderDate = order.created_at;
          orderDate = new Date(orderDate).getTime();
          if (orderDate >= dateMidNight) await ordersFilter.push(order);
        }

        for (let order of ordersFilter) {
          if (!customers.includes(order.customer.key))
            customers.push(order.customer.key);
          if (order.status === Status.OUT) successClothes.push(order);
          for (let cloth of order.clothes)
            if (!!cloth.clotheHasProblems && cloth.clotheHasProblems.length > 0)
              problemClothes.push(order);
        }

        this.totalCustomer = customers.length;
        this.totalSuccess = successClothes.length;
        this.totalProblem = problemClothes.length;
        this.orders = orders;
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
}
