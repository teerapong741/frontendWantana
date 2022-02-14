import { FilterInput } from './../../core/interfaces/order.interface';
import { OrderService } from 'src/app/core/services/order.service';
import { ClothProblemService } from 'src/app/core/services/cloth-problem.service';
import Swal from 'sweetalert2';
import { EmployeeService } from './../../core/services/employee.service';
import { CustomerService } from './../../core/services/customer.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  loading: boolean = false;

  reportsOptions: any[] = [];
  reportTypeSelected: any = null;

  customersOptions: any[] = [];
  customerSelected: any = null;

  clotheProblemsOptions: any[] = [];
  clotheProblemSelected: any = null;

  clotheStatusOptions: any[] = [];
  clotheStatusSelected: any = null;

  dateStart: Date = new Date();
  dateEnd: Date = new Date();

  tableData: any[] = [];
  cols: any[] = [];

  constructor(
    private customerService: CustomerService,
    private employeeService: EmployeeService,
    private problemService: ClothProblemService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    let dateMidNight: any = new Date();
    dateMidNight.setHours(0, 0, 0, 0);
    dateMidNight = new Date(dateMidNight);
    this.dateStart = dateMidNight;

    this.cols = [
      { header: 'วันที่', field: 'date' },
      { header: 'รหัส', field: 'key' },
      { header: 'ชื่อ', field: 'firstName' },
      { header: 'นามสกุล', field: 'lastName' },
      { header: 'ที่อยู่', field: 'address' },
      { header: 'เบอร์ติดต่อ', field: 'phone' },
    ];

    this.reportsOptions = [
      { name: 'ข้อมูลลูกค้า', value: 'customers', id: null },
      { name: 'ข้อมูลพนักงาน', value: 'employees', id: null },
      { name: 'การรับผ้าเข้าร้าน', value: 'orders', id: null },
      { name: 'ผ้ามีปัญหา', value: 'clothe_problems', id: null },
    ];
    this.reportTypeSelected = this.reportsOptions[0];

    this.customersOptions.push({ name: 'ทั้งหมด', value: 'all' });
    this.customerSelected = { name: 'ทั้งหมด', value: 'all' };

    this.clotheProblemsOptions.push(
      { name: 'ทั้งหมด', value: 'all' },
      { name: 'มีผ้ามีปัญหา', value: true },
      { name: 'ไม่มีผ้ามีปัญหา', value: false }
    );
    this.clotheProblemSelected = { name: 'ทั้งหมด', value: 'all' };

    this.clotheStatusOptions.push(
      { name: 'ทั้งหมด', value: 'all' },
      { name: 'อยู่ในระบบ', value: 'IN' },
      { name: 'นำส่งแล้ว', value: 'OUT' }
    );
    this.clotheStatusSelected = { name: 'ทั้งหมด', value: 'all' };

    this.loading = true;
    this.customerService.customers().subscribe((result) => {
      this.loading = false;
      if (!!result.data) {
        const customers = JSON.parse(JSON.stringify(result.data.customers));

        let customersFilter = [];
        for (let customer of customers)
          customersFilter.push({
            name: `${customer.firstName} ${customer.lastName}`,
            value: customer.id,
          });
        this.customersOptions = [...this.customersOptions, ...customersFilter];
      } else {
        Swal.fire({
          title: 'Error',
          text: result.errors[0].message,
          icon: 'error',
          confirmButtonText: 'ตกลง',
        });
      }
    });

    // this.loading = true;
    // this.problemService.problemClothes().subscribe((result) => {
    //   this.loading = false;
    //   if (!!result.data) {
    //     const problemClothes = JSON.parse(
    //       JSON.stringify(result.data.problemClothes)
    //     );

    //     let problemsFilter = [];
    //     for (let problem of problemClothes)
    //       problemsFilter.push({
    //         name: `${problem.name}`,
    //         value: problem.id,
    //       });
    //     this.clotheProblemsOptions = [
    //       ...this.clotheProblemsOptions,
    //       ...problemsFilter,
    //     ];
    //   } else {
    //     Swal.fire({
    //       title: 'Error',
    //       text: result.errors[0].message,
    //       icon: 'error',
    //       confirmButtonText: 'ตกลง',
    //     });
    //   }
    // });

    this.onChangeFilter();
  }

  onChangeFilter(): void {
    this.loading = true;
    if (
      this.reportTypeSelected.value === 'orders' ||
      this.reportTypeSelected.value === 'clothe_problems'
    ) {
      let firstDate =
        new Date(new Date(this.dateEnd).setHours(0, 0, 0, 0)).getTime() ===
        new Date(new Date(this.dateStart).setHours(0, 0, 0, 0)).getTime()
          ? new Date(this.dateEnd.setDate(this.dateStart.getDate() + 1))
          : new Date(this.dateEnd);
      firstDate = new Date(new Date(firstDate).setHours(0, 0, 0, 0));

      let lastDate = new Date(this.dateStart);
      lastDate = new Date(new Date(lastDate).setHours(0, 0, 0, 0));

      let filterInput: FilterInput = {
        customerName:
          !!this.customerSelected.name && this.customerSelected.value !== 'all'
            ? this.customerSelected.name.split(' ')[0]
            : null,
        status:
          this.clotheStatusSelected.value !== 'all'
            ? this.clotheStatusSelected.value
            : null,
        firstDate: firstDate,
        lastDate: lastDate,
        isProcess:
          this.clotheProblemSelected.value == 'all'
            ? null
            : this.clotheProblemSelected.value,
      };
      if (this.reportTypeSelected.value !== 'orders')
        this.problemTableData(filterInput);
      else this.ordersTableData(filterInput);
    } else if (this.reportTypeSelected.value === 'customers') {
      this.customersTableData();
    } else if (this.reportTypeSelected.value === 'employees') {
      this.employeesTableData();
    }
  }

  ordersTableData(filterInput: FilterInput): void {
    this.tableData = [];
    this.cols = [
      { header: 'วันที่', field: 'date' },
      { header: 'รหัส', field: 'key' },
      { header: 'ชื่อ', field: 'firstName' },
      { header: 'นามสกุล', field: 'lastName' },
      { header: 'ชนิดผ้า', field: 'sort' },
      { header: 'ประเภทผ้า', field: 'type' },
      { header: 'จำนวน', field: 'number' },
      // { header: 'สาเหตุผ้ามีปัญหา', field: 'problems' },
    ];
    this.orderService.filterOrder(filterInput).subscribe(async (result) => {
      this.loading = false;
      if (!!result.data) {
        const orders = JSON.parse(JSON.stringify(result.data.filterOrder));
        let ordersFilter: any[] = [];
        // console.log(orders);

        for (let order of orders) {
          let groups: any[] = [];

          if (!!order.clothes && order.clothes.length > 0) {
            for (let clothe of order.clothes) {
              if (groups.length > 0) {
                for (let [index, group] of groups.entries()) {
                  if (
                    JSON.stringify(
                      !!clothe.sortClothe
                        ? clothe.sortClothe.name
                        : clothe.sortClothe
                    ) ===
                      JSON.stringify(
                        !!group.sortClothe
                          ? group.sortClothe.name
                          : group.sortClothe
                      ) &&
                    JSON.stringify(
                      !!clothe.typeClothe
                        ? clothe.typeClothe.name
                        : clothe.typeClothe
                    ) ===
                      JSON.stringify(
                        !!group.typeClothe
                          ? group.typeClothe.name
                          : group.typeClothe
                      ) &&
                    JSON.stringify(
                      !!clothe.specialClothe
                        ? clothe.specialClothe.name
                        : clothe.specialClothe
                    ) ===
                      JSON.stringify(
                        !!group.specialClothe
                          ? group.specialClothe.name
                          : group.specialClothe
                      )
                  )
                    groups[index].number++;
                  else
                    groups.push({
                      ...clothe,
                      number: 1,
                      customer: order.customer,
                      created_at: order.created_at,
                    });
                }
              } else {
                groups.push({
                  ...clothe,
                  number: 1,
                  customer: order.customer,
                  created_at: order.created_at,
                });
              }
            }
            ordersFilter.push(groups);
          }
        }

        let ordersFilterResult: any = [];
        for (let order of ordersFilter) {
          let resultOrder: any = null;
          let sortFilter: string = '';
          let typeFilter: string = '';
          let numberFilter: string = '';
          for (let clothe of order) {
            if (!!clothe.sortClothe)
              sortFilter =
                await sortFilter.concat(`<p>${clothe.sortClothe.name}</p><br>
            `);
            else
              sortFilter = await sortFilter.concat(`<p>-</p><br>
            `);

            if (!!clothe.typeClothe)
              typeFilter =
                await typeFilter.concat(`<p>${clothe.typeClothe.name}</p><br>
            `);
            else
              typeFilter = await typeFilter.concat(`<p>-</p><br>
            `);

            numberFilter =
              await numberFilter.concat(`<p>${clothe.number}</p><br>
            `);

            resultOrder = await {
              date: clothe.created_at,
              key: clothe.key,
              firstName: clothe.customer.firstName,
              lastName: clothe.customer.lastName,
              sort: !!sortFilter ? sortFilter : 'ไม่ได้ระบุ',
              type: !!typeFilter ? typeFilter : 'ไม่ได้ระบุ',
              number: numberFilter,
              problems: null,
            };
          }

          await ordersFilterResult.push({
            ...resultOrder,
          });
        }

        this.tableData = ordersFilterResult;
      } else {
        Swal.fire({
          title: 'Error',
          text: result.errors[0].message,
          icon: 'error',
          confirmButtonText: 'ตกลง',
        });
      }
    });
  }

  compare(array1: any[], array2: any[]) {
    if (array1.length != array2.length) {
      return false;
    }

    array1 = array1.slice();
    array1.sort();
    array2 = array2.slice();
    array2.sort();

    for (var i = 0; i < array1.length; i++) {
      if (array1[i] != array2[i]) {
        return false;
      }
    }

    return true;
  }

  problemTableData(filterInput: FilterInput): void {
    this.tableData = [];
    this.cols = [
      { header: 'วันที่', field: 'date' },
      { header: 'รหัส', field: 'key' },
      { header: 'ชื่อ', field: 'firstName' },
      { header: 'นามสกุล', field: 'lastName' },
      { header: 'ชนิดผ้า', field: 'sort' },
      { header: 'ประเภทผ้า', field: 'type' },
      { header: 'จำนวน', field: 'number' },
      { header: 'สาเหตุผ้ามีปัญหา', field: 'problems' },
    ];
    this.orderService.filterOrder(filterInput).subscribe(async (result) => {
      this.loading = false;
      if (!!result.data) {
        const orders = JSON.parse(JSON.stringify(result.data.filterOrder));
        let ordersFilter: any[] = [];
        // console.log(orders);

        for (let order of orders) {
          let groups: any[] = [];

          if (!!order.clothes && order.clothes.length > 0) {
            for (let clothe of order.clothes) {
              if (groups.length > 0) {
                for (let [index, group] of groups.entries()) {
                  let isEqualProblem = false;
                  let isHasProblem: boolean = false;
                  if (
                    !!clothe.clotheHasProblems &&
                    !!group.clotheHasProblems &&
                    group.clotheHasProblems.length > 0 &&
                    clothe.clotheHasProblems.length > 0
                  )
                    isHasProblem = true;
                  if (!!clothe.clotheHasProblems && !!group.clotheHasProblems) {
                    const clothProblem = clothe.clotheHasProblems.map(
                      ({ name }: any) => name
                    );
                    const itemProblem = group.clotheHasProblems.map(
                      ({ name }: any) => name
                    );
                    // isEqualProblem = await this.compare(clothProblem, itemProblem);
                  }
                  // console.log(clothe.clotheHasProblem);
                  // console.log(group.clotheHasProblem);
                  if (
                    JSON.stringify(
                      !!clothe.sortClothe
                        ? clothe.sortClothe.name
                        : clothe.sortClothe
                    ) ===
                      JSON.stringify(
                        !!group.sortClothe
                          ? group.sortClothe.name
                          : group.sortClothe
                      ) &&
                    JSON.stringify(
                      !!clothe.typeClothe
                        ? clothe.typeClothe.name
                        : clothe.typeClothe
                    ) ===
                      JSON.stringify(
                        !!group.typeClothe
                          ? group.typeClothe.name
                          : group.typeClothe
                      ) &&
                    JSON.stringify(
                      !!clothe.specialClothe
                        ? clothe.specialClothe.name
                        : clothe.specialClothe
                    ) ===
                      JSON.stringify(
                        !!group.specialClothe
                          ? group.specialClothe.name
                          : group.specialClothe
                      ) &&
                    isEqualProblem &&
                    isHasProblem
                  )
                    groups[index].number++;
                  else if (isEqualProblem && isHasProblem) {
                    groups.push({
                      ...clothe,
                      number: 1,
                      customer: order.customer,
                      created_at: order.created_at,
                    });
                  }
                }
              } else {
                if (
                  !!clothe.clotheHasProblems &&
                  clothe.clotheHasProblems.length > 0
                ) {
                  groups.push({
                    ...clothe,
                    number: 1,
                    customer: order.customer,
                    created_at: order.created_at,
                  });
                }
              }
            }
            ordersFilter.push(groups);
          }
        }

        let ordersFilterResult: any = [];
        if (ordersFilter.length > 0)
          for (let order of ordersFilter) {
            let resultOrder: any = null;
            let sortFilter: string = '';
            let typeFilter: string = '';
            let problemsFilter: string = '';
            let numberFilter: string = '';
            for (let clothe of order) {
              if (!!clothe.sortClothe)
                sortFilter =
                  await sortFilter.concat(`<p>${clothe.sortClothe.name}</p><br>
            `);
              else
                sortFilter = await sortFilter.concat(`<p>-</p><br>
            `);

              if (!!clothe.typeClothe)
                typeFilter =
                  await typeFilter.concat(`<p>${clothe.typeClothe.name}</p><br>
            `);
              else
                typeFilter = await typeFilter.concat(`<p>-</p><br>
            `);

              numberFilter =
                await numberFilter.concat(`<p>${clothe.number}</p><br>
            `);

              if (!!clothe.clotheHasProblems)
                for (let problem of clothe.clotheHasProblems) {
                  problemsFilter = await problemsFilter.concat(
                    `<span>${problem.problemClothe.name}, </span>`
                  );
                }
              else
                problemsFilter = await problemsFilter.concat(`<p>-</p><br>
            `);

              resultOrder = await {
                date: clothe.created_at,
                key: clothe.key,
                firstName: clothe.customer.firstName,
                lastName: clothe.customer.lastName,
                sort: !!sortFilter ? sortFilter : 'ไม่ได้ระบุ',
                type: !!typeFilter ? typeFilter : 'ไม่ได้ระบุ',
                number: numberFilter,
                problems: !!problemsFilter ? problemsFilter : 'ไม่ได้ระบุ',
              };
            }

            await ordersFilterResult.push({
              ...resultOrder,
            });
          }

        this.tableData = ordersFilterResult.filter(
          (order: any) => Object.keys(order).length !== 0
        );
      } else {
        Swal.fire({
          title: 'Error',
          text: result.errors[0].message,
          icon: 'error',
          confirmButtonText: 'ตกลง',
        });
      }
    });
  }

  customersTableData(): void {
    this.tableData = [];
    this.cols = [
      { header: 'วันที่', field: 'date' },
      { header: 'รหัส', field: 'key' },
      { header: 'ชื่อ', field: 'firstName' },
      { header: 'นามสกุล', field: 'lastName' },
      { header: 'ที่อยู่', field: 'address' },
      { header: 'เบอร์ติดต่อ', field: 'phone' },
    ];
    this.customerService.customers().subscribe((result) => {
      this.loading = false;
      if (result.data) {
        const customers = JSON.parse(JSON.stringify(result.data.customers));
        let customersFilter = [];
        for (let customer of customers)
          if (
            new Date(
              new Date(customer.created_at).setHours(0, 0, 0, 0)
            ).getTime() >= new Date(this.dateStart).getTime() &&
            new Date(
              new Date(customer.created_at).setHours(0, 0, 0, 0)
            ).getTime() <= new Date(this.dateEnd).getTime()
          )
            customersFilter.push({
              date: customer.created_at,
              key: customer.key,
              firstName: customer.firstName,
              lastName: customer.lastName,
              address: customer.address,
              phone: customer.phoneNumber,
            });
        this.tableData = customersFilter;
      } else {
        Swal.fire({
          title: 'Error',
          text: result.errors[0].message,
          icon: 'error',
          confirmButtonText: 'ตกลง',
        });
      }
    });
  }

  employeesTableData(): void {
    this.tableData = [];
    this.cols = [
      { header: 'วันที่', field: 'date' },
      { header: 'รหัส', field: 'key' },
      { header: 'ชื่อ', field: 'firstName' },
      { header: 'นามสกุล', field: 'lastName' },
      { header: 'ที่อยู่', field: 'address' },
      { header: 'เบอร์ติดต่อ', field: 'phone' },
      { header: 'อีเมล์', field: 'email' },
    ];
    this.employeeService.employees().subscribe((result) => {
      this.loading = false;
      if (result.data) {
        const employees = JSON.parse(JSON.stringify(result.data.employees));
        let employeesFilter = [];
        for (let employee of employees)
          if (
            new Date(
              new Date(employee.created_at).setHours(0, 0, 0, 0)
            ).getTime() >= new Date(this.dateStart).getTime() &&
            new Date(
              new Date(employee.created_at).setHours(0, 0, 0, 0)
            ).getTime() <= new Date(this.dateEnd).getTime()
          )
            employeesFilter.push({
              date: employee.created_at,
              key: employee.key,
              firstName: employee.firstName,
              lastName: employee.lastName,
              address: employee.address,
              phone: employee.phoneNumber,
              email: employee.email,
            });
        this.tableData = employeesFilter;
      } else {
        Swal.fire({
          title: 'Error',
          text: result.errors[0].message,
          icon: 'error',
          confirmButtonText: 'ตกลง',
        });
      }
    });
  }
}
