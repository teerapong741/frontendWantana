import { OrderService } from 'src/app/core/services/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  loading = false;
  orders: any = null;
  ordersIn: any = null;
  ordersOut: any = null;
  clothesIn: any = null;
  clothesOut: any = null;

  totalCloths: number = 0;
  thickCloths: number = 0;
  thinCloths: number = 0;
  specialCloths: number = 0;
  problemCloths: number = 0;
  otherCloths: number = 0;
  inProcess: number = 0;
  outProcess: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly orderService: OrderService
  ) {}

  ngOnInit() {
    const orderId = this.route.snapshot.params['id'];
    this.loading = true;
    this.orderService
      .findOneByPrimaryId(Number(orderId))
      .subscribe((result) => {
        this.loading = false;
        if (!!result.data) {
          const orders = JSON.parse(
            JSON.stringify(result.data.findOneByPrimaryId)
          );
          this.orders = orders;
          this.ordersIn = orders.filter((order: any) => order.status === 'IN');
          this.ordersOut = orders.filter(
            (order: any) => order.status === 'OUT'
          );

          const clothesIn: any = [];
          const clothesOut: any = [];
          let clothesAll = [];
          for (let order of this.ordersIn)
            for (let clothe of order.clothes) {
              let clotheHasProblems = [];
              let clotheHasProblemsAfter = [];
              for (let problem of clothe.clotheHasProblems) {
                if (problem.status === 'IN') clotheHasProblems.push(problem);
                else clotheHasProblemsAfter.push(problem);
              }
              clothesIn.push({
                ...clothe,
                is_out_process: order.isOutProcess,
                clotheHasProblems: clotheHasProblems,
                clotheHasProblemsAfter,
              });
            }
          this.clothesIn = clothesIn;
          console.log(this.ordersOut);
          for (let order of this.ordersOut)
            for (let clothe of order.clothes) {
              let clotheHasProblems = [];
              let clotheHasProblemsAfter = [];
              for (let problem of clothe.clotheHasProblems) {
                if (problem.status === 'IN') clotheHasProblems.push(problem);
                else clotheHasProblemsAfter.push(problem);
              }
              clothesOut.push({
                ...clothe,
                is_out_process: order.isOutProcess,
                clotheHasProblems: clotheHasProblems,
                clotheHasProblemsAfter,
              });
            }
          this.clothesOut = clothesOut;
          clothesAll = [...clothesIn, ...clothesOut];

          clothesAll.map((cloth: any) => {
            this.totalCloths += 1;
          });
          clothesAll
            .filter((cloth: any) => cloth.sortClothe.name === 'ผ้าหนา')
            .map((cloth: any) => {
              this.thickCloths += 1;
            });
          clothesAll
            .filter((cloth: any) => cloth.sortClothe.name === 'ผ้าบาง')
            .map((cloth: any) => {
              this.thinCloths += 1;
            });
          clothesAll
            .filter((cloth: any) => cloth.sortClothe.name === 'ผ้าพิเศษ')
            .map((cloth: any) => {
              this.specialCloths += 1;
            });
          clothesAll
            .filter(
              (cloth: any) =>
                cloth.sortClothe.name !== 'ผ้าพิเศษ' &&
                cloth.sortClothe.name !== 'ผ้าบาง' &&
                cloth.sortClothe.name !== 'ผ้าหนา'
            )
            .map((cloth: any) => {
              this.otherCloths += cloth.number;
            });
          clothesAll
            .filter(
              (cloth: any) =>
                !!cloth.clotheHasProblems && cloth.clotheHasProblems.length > 0
            )
            .map((cloth: any) => (this.problemCloths += 1));
          clothesAll
            .filter((cloth: any) => !cloth.is_out_process)
            .map((cloth: any) => {
              this.inProcess++;
            });
          clothesAll
            .filter((cloth: any) => cloth.is_out_process)
            .map((cloth: any) => {
              this.outProcess++;
            });
        } else {
          Swal.fire({
            title: 'Error!',
            text: result.errors[0].message,
            icon: 'error',
            confirmButtonText: 'ตกลง',
          });
        }
      });
  }
}
