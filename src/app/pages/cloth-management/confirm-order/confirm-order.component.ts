import { LineService } from './../../../core/services/line.service';
import { UpdateOrderInput } from './../../../core/interfaces/order.interface';
import { ClothService } from './../../../core/services/cloth.service';
import {
  CreateClotheInput,
  CreateClotheProblemInput,
  UpdateClotheInput,
} from './../../../core/interfaces/cloth.interface';
import { ConfirmationService } from 'primeng/api';
import { NavigationEnd, Router } from '@angular/router';
import { OrderService } from 'src/app/core/services/order.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CreateOrderInput } from 'src/app/core/interfaces/order.interface';
import { Status } from 'src/app/core/enums/status';
import Swal from 'sweetalert2';

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
    private readonly confirmationService: ConfirmationService,
    private readonly clothService: ClothService,
    private readonly lineService: LineService
  ) {}

  ngOnInit() {
    this.orderDetail = this.orderService.getOrder();
    if (!this.orderDetail) this.router.navigate(['./../cloth-management']);

    const clothList = this.orderDetail.cloth_list;
    console.log(this.orderDetail);

    this.processOrder = clothList.filter((order: any) => !order.is_out_process);
    this.outProcessOrder = clothList.filter(
      (order: any) => order.is_out_process
    );

    clothList.map((cloth: any) => {
      this.totalCloths += cloth.number;
    });
    clothList
      .filter((cloth: any) => cloth.type.name === 'ผ้าหนา')
      .map((cloth: any) => {
        this.thickCloths += cloth.number;
      });
    clothList
      .filter((cloth: any) => cloth.type.name === 'ผ้าบาง')
      .map((cloth: any) => {
        this.thinCloths += cloth.number;
      });
    clothList
      .filter((cloth: any) => cloth.type.name === 'ผ้าพิเศษ')
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
        const allClothes: any[] = [];
        const inProcessClothes: any[] = [];
        const outProcessClothes: any[] = [];
        const clothesProblem: any[] = [];
        let problemList: any[] = [];
        let problemIdsList: any[] = [];

        // create main order
        const createOrderInput: CreateOrderInput = {
          customerId: Number(this.orderDetail.customer.id),
          employeeId: this.orderDetail.employee_id,
        };
        const createdOrder = await this.onCreateOrder(createOrderInput).catch(
          (error: any) => {
            Swal.fire({
              title: 'Error!',
              text: error,
              icon: 'error',
              confirmButtonText: 'Cool',
            });
          }
        );

        // create in process clothe
        for (let cloth of this.processOrder) {
          const createClotheInput: CreateClotheInput = {
            orderId: createdOrder.id,
            sortClotheId: cloth.type.id,
            specialClothId: !!cloth.type_special ? cloth.type_special.id : null,
            typeClotheId: cloth.type_of_use.id,
          };
          for (let i of Array.from(Array(cloth.number).keys())) {
            const createdCloth = await this.onCreateCloth(createClotheInput);
            inProcessClothes.push({ ...createdCloth });
            if (!!cloth.fabric_problem && cloth.fabric_problem.length > 0)
              clothesProblem.push({
                id: createdCloth.id,
                problems: cloth.fabric_problem,
              });
          }
        }

        // create out process clothe
        for (let cloth of this.outProcessOrder) {
          const createClotheInput: CreateClotheInput = {
            orderId: createdOrder.id,
            sortClotheId: cloth.type.id,
            specialClothId: !!cloth.type_special ? cloth.type_special.id : null,
            typeClotheId: cloth.type_of_use.id,
          };
          for (let i of Array.from(Array(cloth.number).keys())) {
            const createdCloth = await this.onCreateCloth(createClotheInput);
            outProcessClothes.push({ ...createdCloth });
            if (!!cloth.fabric_problem && cloth.fabric_problem.length > 0)
              clothesProblem.push({
                id: createdCloth.id,
                problems: cloth.fabric_problem,
              });
          }
        }

        // merge problem
        for (let cloth of clothesProblem) {
          // await problemList.concat(cloth.problems);
          problemList = await this.onMergeArrays(
            [problemList, cloth.problems],
            'id'
          );
        }

        // filter id only
        problemIdsList = await problemList.map(({ id }: any) => id);

        // filter clothe id by problem
        for (let problemId of problemIdsList) {
          const createClotheProblemInput: CreateClotheProblemInput = {
            status: Status.IN,
            clotheIds: [],
            problemClothes: problemId,
          };
          for (let cloth of clothesProblem) {
            let isExistProblem = await cloth.problems.filter(
              (problem: any) => problem.id === problemId
            );
            isExistProblem = isExistProblem.length > 0;
            if (isExistProblem)
              createClotheProblemInput.clotheIds.push(cloth.id);
          }

          // create cloth has problem
          await this.onCreateClothHasProblem(createClotheProblemInput).catch(
            (error: any) => {
              Swal.fire({
                title: 'Error!',
                text: error,
                icon: 'error',
                confirmButtonText: 'Cool',
              });
            }
          );
        }

        // concat clothes ids
        const outProcessClotheIds = outProcessClothes.map(({ id }: any) => id);
        const inProcessClotheIds = inProcessClothes.map(({ id }: any) => id);
        for (let clothe of outProcessClotheIds) await allClothes.push(clothe);
        for (let clothe of inProcessClotheIds) await allClothes.push(clothe);
        // update order
        const updateClotheInput: UpdateClotheInput = {
          ids: allClothes,
          orderId: createdOrder.id,
        };
        await this.onUpdateCloth(updateClotheInput).catch((error: any) => {
          Swal.fire({
            title: 'Error!',
            text: error,
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        });

        if (outProcessClotheIds.length > 0) {
          // create sub order for out process
          const createSubOrderInput: CreateOrderInput = {
            customerId: Number(this.orderDetail.customer.id),
            employeeId: this.orderDetail.employee_id,
            primaryOrderId: createdOrder.id,
          };
          const createdSubOrder = await this.onCreateOrder(
            createSubOrderInput
          ).catch((error: any) => {
            Swal.fire({
              title: 'Error!',
              text: error,
              icon: 'error',
              confirmButtonText: 'Cool',
            });
          });

          if (!!createdSubOrder) {
            // update sub order out process status = true
            const updateSubOrderInput: UpdateOrderInput = {
              id: createdSubOrder.id,
              isOutProcess: true,
              status: Status.IN,
            };
            const updatedOrder = await this.onUpdateOrder(
              updateSubOrderInput
            ).catch((error: any) => {
              Swal.fire({
                title: 'Error!',
                text: error,
                icon: 'error',
                confirmButtonText: 'Cool',
              });
            });

            // move clothe out process from main order to sub order
            const updateOutProcessClotheInput: UpdateClotheInput = {
              ids: outProcessClotheIds,
              orderId: createdSubOrder.id,
            };
            await this.onUpdateCloth(updateOutProcessClotheInput).catch(
              (error: any) => {
                Swal.fire({
                  title: 'Error!',
                  text: error,
                  icon: 'error',
                  confirmButtonText: 'Cool',
                });
              }
            );
          }

          this.lineService.messageCreateOrder(
            this.orderDetail,
            this.processOrder,
            this.outProcessOrder,
            this.totalCloths,
            this.thickCloths,
            this.thinCloths,
            this.specialCloths,
            this.problemCloths,
            this.inProcess,
            this.outProcess
          );
          // update sub order
          this.router
            .navigate(['./../cloth-management/'])
            .then(() => this.orderService.setOrder(null));
        }
      },
    });
  }

  onMergeArrays(arrays: any, prop: any) {
    const merged: any = {};

    arrays.forEach((arr: any) => {
      arr.forEach((item: any) => {
        merged[item[prop]] = Object.assign({}, merged[item[prop]], item);
      });
    });

    return Object.values(merged);
  }

  async onCreateOrder(createOrderInput: CreateOrderInput): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.$subscriptions = this.orderService
        .createOrder(createOrderInput)
        .subscribe((result) => {
          this.loading = false;
          if (!!result.data) {
            resolve(JSON.parse(JSON.stringify(result.data.createOrder)));
          } else {
            reject(result.errors[0].message);
          }
        });
    });
  }

  async onUpdateOrder(updateOrderInput: UpdateOrderInput): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.$subscriptions = this.orderService
        .updateOrder(updateOrderInput)
        .subscribe((result) => {
          this.loading = false;
          if (!!result.data)
            resolve(JSON.parse(JSON.stringify(result.data.updateOrder)));
          else reject(result.errors[0].message);
        });
    });
  }

  async onCreateCloth(createClotheInput: CreateClotheInput): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.$subscriptions = this.clothService
        .createClothe(createClotheInput)
        .subscribe((result) => {
          this.loading = false;
          if (!!result.data) {
            resolve(JSON.parse(JSON.stringify(result.data.createClothe)));
          } else {
            reject(result.errors[0].message);
          }
        });
    });
  }

  async onUpdateCloth(updateClotheInput: UpdateClotheInput): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.$subscriptions = this.clothService
        .updateClothe(updateClotheInput)
        .subscribe((result) => {
          this.loading = false;
          if (!!result.data)
            resolve(JSON.parse(JSON.stringify(result.data.updateClothe)));
          else reject(result.errors[0].message);
        });
    });
  }

  async onCreateClothHasProblem(
    createClotheProblemInput: CreateClotheProblemInput
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.$subscriptions = this.clothService
        .createClotheHasProblem(createClotheProblemInput)
        .subscribe((result) => {
          this.loading = false;
          if (!!result.data)
            resolve(
              JSON.parse(JSON.stringify(result.data.createClotheHasProblem))
            );
          else reject(result.errors[0].message);
        });
    });
  }

  ngOnDestroy(): void {
    if (!!this.$subscriptions) this.$subscriptions.unsubscribe();
  }
}
