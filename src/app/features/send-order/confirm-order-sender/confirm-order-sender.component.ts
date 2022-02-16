import { CustomerService } from './../../../core/services/customer.service';
import { LineService } from './../../../core/services/line.service';
import {
  CreateClotheInput,
  CreateClotheProblemInput,
  UpdateClotheInput,
} from './../../../core/interfaces/cloth.interface';
import { ClothService } from './../../../core/services/cloth.service';
import {
  CreateOrderInput,
  UpdateOrderInput,
} from './../../../core/interfaces/order.interface';
import { OrderService } from './../../../core/services/order.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Status } from 'src/app/core/enums/status';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-confirm-order-sender',
  templateUrl: './confirm-order-sender.component.html',
  styleUrls: ['./confirm-order-sender.component.scss'],
})
export class ConfirmOrderSenderComponent implements OnInit {
  loading: boolean = false;
  @Output() next = new EventEmitter<boolean>();
  order: any = null;
  clothes: any[] = [];

  clothesTotalLength: number = 0;
  clothesOutLength: number = 0;
  clothesInLength: number = 0;

  constructor(
    private readonly orderService: OrderService,
    private clothService: ClothService,
    private lineService: LineService,
    private customerService: CustomerService
  ) {}

  async ngOnInit() {
    this.order = this.orderService.getOrder();
    this.clothes = this.order.clothes;
    this.loading = true;
    await this.onFindOnePrimary();
    this.loading = false;
  }

  onFindOnePrimary(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.orderService
        .findOneByPrimaryId(this.order.order_id)
        .subscribe((result) => {
          if (result.data) {
            const orders = JSON.parse(
              JSON.stringify(result.data.findOneByPrimaryId)
            );
            if (
              this.clothesTotalLength == 0 &&
              this.clothesInLength == 0 &&
              this.clothesOutLength == 0
            ) {
              for (let order of orders) {
                this.clothesTotalLength += order.clothes.length;
                if (order.status === Status.OUT)
                  this.clothesOutLength += order.clothes.length;
                else this.clothesInLength += order.clothes.length;
              }
            }
            return resolve();
          } else {
            Swal.fire({
              title: 'Error!',
              text: result.errors[0].message,
              icon: 'error',
              confirmButtonText: 'ตกลง',
            });
            return reject();
          }
        });
    });
  }

  async onNext(): Promise<void> {
    this.loading = true;
    const isTimeOut = setTimeout(() => {
      this.loading = false;
      this.next.emit(false);
    }, 60000);
    // this.orderService.setOrder(this.clothes);
    let isOutClothes: any[] = [];
    let isInClothes: any[] = [];

    // check order is out process

    for (let clothe of this.order.clothes)
      if (clothe.is_out_process) isOutClothes.push(clothe);
      else isInClothes.push(clothe);

    if (isInClothes.length > 0) {
      let problemList: any[] = [];

      // create sub order
      const createOrderInput: CreateOrderInput = {
        customerId: this.order.customer_id,
        employeeId: this.order.employee_id,
        primaryOrderId: this.order.order_id,
      };
      const createdOrder: any = await this.onCreateOrder(
        createOrderInput
      ).catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: error,
          icon: 'error',
          confirmButtonText: 'ตกลง',
        });
      });

      // update sub order to OUT
      const updateSubOrderInput: UpdateOrderInput = await {
        id: createdOrder.id,
        status: Status.OUT,
        isOutProcess: false,
      };
      const updatedSubOrder: any = await this.onUpdateOrder(
        updateSubOrderInput
      ).catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: error,
          icon: 'error',
          confirmButtonText: 'ตกลง',
        });
      });

      // if new problem after
      // merge problem
      const clothesProblem: any[] = [];
      for (let cloth of this.order.clothes)
        if (
          !!cloth.clotheHasProblemsAfter &&
          cloth.clotheHasProblemsAfter.length > 0
        )
          clothesProblem.push({
            id: cloth.id,
            problems: cloth.clotheHasProblemsAfter,
          });

      for (let cloth of clothesProblem) {
        // await problemList.concat(cloth.problems);
        problemList = await this.onMergeArrays(
          [problemList, cloth.problems],
          'id'
        );
      }

      // filter id only
      const problemIdsList = await problemList.map(({ id }: any) => id);

      // filter clothe id by problem
      for (let problemId of problemIdsList) {
        const createClotheProblemInput: CreateClotheProblemInput = {
          status: Status.OUT,
          clotheIds: [],
          problemClothes: problemId,
        };
        for (let cloth of clothesProblem) {
          let isExistProblem = await cloth.problems.filter(
            (problem: any) => problem.id === problemId
          );
          isExistProblem = isExistProblem.length > 0;
          if (isExistProblem) createClotheProblemInput.clotheIds.push(cloth.id);
        }
        // create cloth has problem
        await this.onCreateClothHasProblem(createClotheProblemInput).catch(
          (error) => {
            Swal.fire({
              title: 'Error!',
              text: error,
              icon: 'error',
              confirmButtonText: 'ตกลง',
            });
          }
        );
      }

      // update clothe (move clothe to sub order)
      const clothesIds: any[] = isInClothes.map(({ id }: any) => id);
      const updateClotheInput: UpdateClotheInput = {
        ids: clothesIds,
        orderId: Number(createdOrder.id),
      };
      const updateClothe: any = await this.onUpdateCloth(
        updateClotheInput
      ).catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: error,
          icon: 'error',
          confirmButtonText: 'ตกลง',
        });
      });
    }
    if (isOutClothes.length > 0) {
      let problemList: any[] = [];

      // create sub order
      const createOrderInput: CreateOrderInput = {
        customerId: this.order.customer_id,
        employeeId: this.order.employee_id,
        primaryOrderId: this.order.order_id,
      };
      const createdOrder: any = await this.onCreateOrder(
        createOrderInput
      ).catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: error,
          icon: 'error',
          confirmButtonText: 'ตกลง',
        });
      });

      // update sub order to OUT
      const updateSubOrderInput: UpdateOrderInput = {
        id: createdOrder.id,
        status: Status.OUT,
        isOutProcess: true,
      };
      const updatedSubOrder: any = await this.onUpdateOrder(
        updateSubOrderInput
      ).catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: error,
          icon: 'error',
          confirmButtonText: 'ตกลง',
        });
      });

      // if new problem after
      // merge problem
      const clothesProblem: any[] = [];
      for (let cloth of this.order.clothes)
        if (
          !!cloth.clotheHasProblemsAfter &&
          cloth.clotheHasProblemsAfter.length > 0
        )
          clothesProblem.push({
            id: cloth.id,
            problems: cloth.clotheHasProblemsAfter,
          });

      for (let cloth of clothesProblem) {
        // await problemList.concat(cloth.problems);
        problemList = await this.onMergeArrays(
          [problemList, cloth.problems],
          'id'
        );
      }

      // filter id only
      const problemIdsList = await problemList.map(({ id }: any) => id);

      // filter clothe id by problem
      for (let problemId of problemIdsList) {
        const createClotheProblemInput: CreateClotheProblemInput = {
          status: Status.OUT,
          clotheIds: [],
          problemClothes: problemId,
        };
        for (let cloth of clothesProblem) {
          let isExistProblem = await cloth.problems.filter(
            (problem: any) => problem.id === problemId
          );
          isExistProblem = isExistProblem.length > 0;
          if (isExistProblem) createClotheProblemInput.clotheIds.push(cloth.id);
        }
        // create cloth has problem
        await this.onCreateClothHasProblem(createClotheProblemInput).catch(
          (error) => {
            Swal.fire({
              title: 'Error!',
              text: error,
              icon: 'error',
              confirmButtonText: 'ตกลง',
            });
          }
        );
      }

      // update clothe (move clothe to sub order)
      const clothesIds: any[] = isOutClothes.map(({ id }: any) => id);
      const updateClotheInput: UpdateClotheInput = {
        ids: clothesIds,
        orderId: Number(createdOrder.id),
      };
      const updateClothe: any = await this.onUpdateCloth(
        updateClotheInput
      ).catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: error,
          icon: 'error',
          confirmButtonText: 'ตกลง',
        });
      });
    }

    // if Clear order
    if (
      this.order.clothes.length + this.clothesOutLength ===
      this.clothesTotalLength
    ) {
      const updateMainOrderInput: UpdateOrderInput = {
        id: this.order.order_id,
        status: Status.OUT,
        isOutProcess: false,
      };
      const updatedMainOrder: any = await this.onUpdateOrder(
        updateMainOrderInput
      ).catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: error,
          icon: 'error',
          confirmButtonText: 'ตกลง',
        });
      });

      this.customerService
        .customer(this.order.customer_id)
        .subscribe(async (result) => {
          if (!!result.data) {
            const customer = JSON.parse(JSON.stringify(result.data.customer));

            await this.lineService
              .messageSendClearOrder(customer, this.order.clothes)
              .then(() => {
                this.loading = false;
                window.clearTimeout(isTimeOut);
                this.next.emit(true);
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
    } else {
      this.customerService
        .customer(this.order.customer_id)
        .subscribe(async (result) => {
          if (!!result.data) {
            const customer = JSON.parse(JSON.stringify(result.data.customer));

            await this.lineService
              .messageSendSeparateOrder(customer, this.order.clothes)
              .then(() => {
                this.loading = false;
                window.clearTimeout(isTimeOut);
                this.next.emit(true);
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

  async onCreateOrder(createOrderInput: CreateOrderInput): Promise<any> {
    return new Promise((resolve, reject) => {
      this.orderService
        .createOrder(createOrderInput)
        .subscribe((result: any) => {
          if (!!result.data) {
            const createdOrder = JSON.parse(
              JSON.stringify(result.data.createOrder)
            );
            resolve(createdOrder);
          } else {
            reject(result.errors[0].message);
          }
        });
    });
  }

  async onUpdateOrder(updateOrderInput: UpdateOrderInput): Promise<any> {
    return new Promise((resolve, reject) => {
      this.orderService
        .updateOrder(updateOrderInput)
        .subscribe((result: any) => {
          if (!!result.data) {
            const updatedOrder = JSON.parse(
              JSON.stringify(result.data.updateOrder)
            );
            resolve(updatedOrder);
          } else {
            reject(result.errors[0].message);
          }
        });
    });
  }

  async onCreateClothHasProblem(
    createClotheProblemInput: CreateClotheProblemInput
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.clothService
        .createClotheHasProblem(createClotheProblemInput)
        .subscribe((result) => {
          if (!!result.data)
            resolve(
              JSON.parse(JSON.stringify(result.data.createClotheHasProblem))
            );
          else reject(result.errors[0].message);
        });
    });
  }

  async onUpdateCloth(updateClotheInput: UpdateClotheInput): Promise<any> {
    return new Promise((resolve, reject) => {
      this.clothService.updateClothe(updateClotheInput).subscribe((result) => {
        if (!!result.data)
          resolve(JSON.parse(JSON.stringify(result.data.updateClothe)));
        else reject(result.errors[0].message);
      });
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

  onBack(): void {
    this.next.emit(false);
  }
}
