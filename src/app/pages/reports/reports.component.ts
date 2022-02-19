import { FilterInput } from './../../core/interfaces/order.interface';
import { OrderService } from 'src/app/core/services/order.service';
import { ClothProblemService } from 'src/app/core/services/cloth-problem.service';
import Swal from 'sweetalert2';
import { EmployeeService } from './../../core/services/employee.service';
import { CustomerService } from './../../core/services/customer.service';
import { Component, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as htmlToText from 'html-to-text';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
(pdfMake as any).fonts = {
  // Default font should still be available
  THSarabunNew: {
    normal: 'THSarabunNew.ttf',
    bold: 'THSarabunNew Bold.ttf',
    italics: 'THSarabunNew Italic.ttf',
    bolditalics: 'THSarabunNew BoldItalic.ttf',
  },
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
};

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

  dateStartReport: any = '';
  dateEndReport: any = '';

  defaultRow = ['*', '*', '*', '*', '*', '*', '*'];
  defaultBody = ['null', 'null', 'null', 'null', 'null', 'null', 'null'];
  headerTablePdf: any[] = [];
  rowHeaderPdf: any[] = this.defaultRow;
  bodyTablePdf: any[] = this.defaultBody;

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
    this.dateEnd = new Date(
      new Date(new Date().setHours(59, 59, 59, 59)).setDate(
        new Date().getDate()
      )
    );

    this.headerTablePdf = [
      'Date',
      'Code',
      'First Name',
      'Last Name',
      'Address',
      'Phone',
    ];
    this.rowHeaderPdf = this.defaultRow;
    this.bodyTablePdf = this.defaultBody;

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

    this.onChangeFilter();
  }

  generatePdf() {
    this.dateStartReport = `${new Date(this.dateStart).toLocaleDateString(
      'th-TH'
    )} ${
      new Date(new Date(this.dateStart).setHours(59, 59, 59))
        .getHours()
        .toString().length === 1
        ? '0' +
          new Date(new Date(this.dateStart).setHours(59, 59, 59))
            .getHours()
            .toString()
        : new Date(new Date(this.dateStart).setHours(59, 59, 59))
            .getHours()
            .toString()
    }:${
      new Date(new Date(this.dateStart).setHours(59, 59, 59))
        .getMinutes()
        .toString().length === 1
        ? '0' +
          new Date(new Date(this.dateStart).setHours(59, 59, 59))
            .getMinutes()
            .toString()
        : new Date(new Date(this.dateStart).setHours(59, 59, 59))
            .getMinutes()
            .toString()
    } น.`;
    this.dateEndReport = `${new Date(this.dateEnd).toLocaleDateString(
      'th-TH'
    )} ${
      new Date(new Date(this.dateEnd).setHours(0, 0, 0, 0))
        .getHours()
        .toString().length === 1
        ? '0' +
          new Date(new Date(this.dateEnd).setHours(0, 0, 0, 0))
            .getHours()
            .toString()
        : new Date(new Date(this.dateEnd).setHours(0, 0, 0, 0))
            .getHours()
            .toString()
    }:${
      new Date(new Date(this.dateEnd).setHours(0, 0, 0, 0))
        .getMinutes()
        .toString().length === 1
        ? '0' +
          new Date(new Date(this.dateEnd).setHours(0, 0, 0, 0))
            .getMinutes()
            .toString()
        : new Date(new Date(this.dateEnd).setHours(0, 0, 0, 0))
            .getMinutes()
            .toString()
    } น.`;
    const documentDefinition: any = {
      pageOrientation: 'landscape',
      pageSize: 'A4',
      content: [
        {
          text: `ร้านวันทนาซักรีด`,
          bold: true,
          fontSize: 18,
          alignment: 'center',
        },
        {
          text: `240/6 ถนนสาธุประดิษฐ์ แขวงบางโพงพาง เขตยานนาวา กรุงเทพฯ 10120`,
          bold: true,
          fontSize: 18,
          alignment: 'center',
        },
        {
          text: `ออกรายงาน${this.reportTypeSelected.name}`,
          bold: true,
          fontSize: 18,
          alignment: 'center',
        },
        {
          text: `สําหรับรอบระยะเวลาตั้งแต่วันที่ ${this.dateStartReport} ถึงวันที่ ${this.dateEndReport}`,
          bold: true,
          fontSize: 18,
          alignment: 'center',
          margin: [0, 0, 0, 40],
        },
        {
          table: {
            headerRows: 1,
            widths: this.rowHeaderPdf,
            body: [this.headerTablePdf, ...this.bodyTablePdf],
            alignment: 'center',
          },
          alignment: 'center',
        },
      ],
      defaultStyle: {
        font: 'THSarabunNew',
        alignment: 'center',
      },
      footer: function (currentPage: any, pageCount: any) {
        return {
          margin: 10,
          columns: [
            {
              fontSize: 9,
              text: [
                {
                  text:
                    '--------------------------------------------------------------------------' +
                    '\n',
                  margin: [0, 20],
                },
                {
                  text:
                    'หน้าที่ ' + currentPage.toString() + ' จาก ' + pageCount,
                  fontSize: 10,
                },
              ],
              alignment: 'center',
            },
          ],
        };
      },
      unbreakable: true,
    };
    pdfMake.createPdf(documentDefinition).open();
  }

  onChangeFilter(): void {
    this.loading = true;
    if (
      this.reportTypeSelected.value === 'orders' ||
      this.reportTypeSelected.value === 'clothe_problems'
    ) {
      let x = this.dateEnd;
      let firstDate: any = x.setHours(23, 59, 59);
      let lastDate: any = this.dateStart;

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
      { header: 'ลำดับ', field: 'num' },
      { header: 'วันที่', field: 'date' },
      { header: 'รหัส', field: 'key' },
      { header: 'ชื่อ', field: 'firstName' },
      { header: 'นามสกุล', field: 'lastName' },
      { header: 'ชนิดผ้า', field: 'sort' },
      { header: 'ประเภทผ้า', field: 'type' },
      { header: 'จำนวน', field: 'number' },
      // { header: 'สาเหตุผ้ามีปัญหา', field: 'problems' },
    ];
    this.headerTablePdf = [
      'ลำดับ',
      'วันที่',
      'รหัส',
      'ชื่อ',
      'นามสกุล',
      'ชนิดผ้า',
      'ประเภทผ้า',
      'จำนวน',
      // 'ผ้าพิเศษ',
    ];
    this.rowHeaderPdf = ['*', '*', '*', '*', '*', '*', '*', '*'];
    this.orderService.filterOrder(filterInput).subscribe(async (result) => {
      this.loading = false;
      if (!!result.data) {
        const orders = JSON.parse(JSON.stringify(result.data.filterOrder)).sort(
          (a: any, b: any) => {
            const date1: any = new Date(a.created_at);
            const date2: any = new Date(b.created_at);
            const result = date1 - date2;
            return result;
          }
        );
        let ordersFilter: any[] = [];

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
                      key: order.key,
                      number: 1,
                      customer: order.customer,
                      created_at: order.created_at,
                    });
                }
              } else {
                groups.push({
                  ...clothe,
                  key: order.key,
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
        for (let [index, order] of ordersFilter.entries()) {
          let resultOrder: any = null;
          let sortFilter: string = '';
          let typeFilter: string = '';
          let numberFilter: string = '';
          for (let clothe of order) {
            if (!!clothe.sortClothe)
              sortFilter =
                await sortFilter.concat(`<span>${clothe.sortClothe.name}</span><br>
            `);
            else
              sortFilter = await sortFilter.concat(`<p>-</p><br>
            `);

            if (!!clothe.typeClothe || !!clothe.specialClothe)
              typeFilter = await typeFilter.concat(`<span>${
                !!clothe.typeClothe ? clothe.typeClothe.name : ''
              } ${
                !!clothe.specialClothe ? clothe.specialClothe.name : ''
              }</span><br>
            `);
            else
              typeFilter = await typeFilter.concat(`<span>-</span><br>
            `);

            numberFilter =
              await numberFilter.concat(`<span>${clothe.number}</span><br>
            `);
            resultOrder = await {
              num: index + 1,
              date: clothe.created_at,
              key: order[0].key,
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
        if (this.tableData.length > 0) {
          this.bodyTablePdf = [];
          for (let [index, cs] of this.tableData.entries()) {
            let data = [];
            data.push(`${index + 1}`);
            data.push(
              `${new Date(cs.date).toLocaleDateString('th-TH')} | ${
                new Date(cs.date).getHours().toString().length === 1
                  ? '0' + new Date(cs.date).getHours().toString()
                  : new Date(cs.date).getHours()
              }:${
                new Date(cs.date).getMinutes().toString().length === 1
                  ? '0' + new Date(cs.date).getMinutes()
                  : new Date(cs.date).getMinutes()
              }`
            );
            data.push(`${cs.key}`);
            data.push(`${cs.firstName}`);
            data.push(`${cs.lastName}`);
            data.push(
              `${htmlToText
                .fromString(cs.sort, { wordwrap: 7 })
                .split('--')
                .join('\n')}`
            );
            data.push(`${htmlToText.fromString(cs.type, { wordwrap: 7 })}`);
            data.push(`${htmlToText.fromString(cs.number, { wordwrap: 7 })}`);

            this.bodyTablePdf.push(data);
          }
        } else {
          this.rowHeaderPdf = this.defaultRow;
          this.bodyTablePdf = [
            'null',
            'null',
            'null',
            'null',
            'null',
            'null',
            'null',
            'null',
          ];
        }
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
      { header: 'ลำดับ', field: 'num' },
      { header: 'วันที่', field: 'date' },
      { header: 'รหัส', field: 'key' },
      { header: 'ชื่อ', field: 'firstName' },
      { header: 'นามสกุล', field: 'lastName' },
      { header: 'ชนิดผ้า', field: 'sort' },
      { header: 'ประเภทผ้า', field: 'type' },
      { header: 'จำนวน', field: 'number' },
      { header: 'สาเหตุผ้ามีปัญหา', field: 'problems' },
    ];
    this.headerTablePdf = [
      'ลำดับ',
      'วันที่',
      'รหัส',
      'ชื่อ',
      'นามสกุล',
      'ชนิดผ้า',
      'ประเภทผ้า',
      'จำนวน',
      'สาเหตุผ้ามีปัญหา',
    ];
    this.rowHeaderPdf = ['*', '*', '*', '*', '*', '*', '*', '*', '*'];
    this.orderService.filterOrder(filterInput).subscribe(async (result) => {
      this.loading = false;
      if (!!result.data) {
        const orders = JSON.parse(JSON.stringify(result.data.filterOrder)).sort(
          (a: any, b: any) => {
            const date1: any = new Date(a.created_at);
            const date2: any = new Date(b.created_at);
            const result = date1 - date2;
            return result;
          }
        );
        let ordersFilter: any[] = [];

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
                  }
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
                      key: order.key,
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
                    key: order.key,
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
          for (let [index, order] of ordersFilter.entries()) {
            let resultOrder: any = null;
            let sortFilter: string = '';
            let typeFilter: string = '';
            let problemsFilter: string = '';
            let numberFilter: string = '';
            for (let clothe of order) {
              if (!!clothe.sortClothe)
                sortFilter =
                  await sortFilter.concat(`<span>${clothe.sortClothe.name}</span><br>
            `);
              else
                sortFilter = await sortFilter.concat(`<span>-</span><br>
            `);

              if (!!clothe.typeClothe || !!clothe.specialClothe)
                typeFilter = await typeFilter.concat(`<span>${
                  !!clothe.typeClothe ? clothe.typeClothe.name : ''
                } ${
                  !!clothe.specialClothe ? clothe.specialClothe.name : ''
                }</span><br>
            `);
              else
                typeFilter = await typeFilter.concat(`<span>-</span><br>
            `);

              numberFilter =
                await numberFilter.concat(`<span>${clothe.number}</span><br>
            `);

              if (!!clothe.clotheHasProblems)
                for (let [
                  index,
                  problem,
                ] of clothe.clotheHasProblems.entries()) {
                  problemsFilter = await problemsFilter.concat(
                    `<span>${problem.problemClothe.name} </span>`
                  );
                }
              else
                problemsFilter = await problemsFilter.concat(`<span>-</span><br>
            `);

              resultOrder = await {
                num: index + 1,
                date: clothe.created_at,
                key: order[0].key,
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
        if (this.tableData.length > 0) {
          this.bodyTablePdf = [];
          for (let [index, cs] of this.tableData.entries()) {
            let data = [];
            data.push(`${index + 1}`);
            data.push(
              `${new Date(cs.date).toLocaleDateString('th-TH')} | ${
                new Date(cs.date).getHours().toString().length === 1
                  ? '0' + new Date(cs.date).getHours().toString()
                  : new Date(cs.date).getHours()
              }:${
                new Date(cs.date).getMinutes().toString().length === 1
                  ? '0' + new Date(cs.date).getMinutes()
                  : new Date(cs.date).getMinutes()
              }`
            );
            data.push(`${cs.key}`);
            data.push(`${cs.firstName}`);
            data.push(`${cs.lastName}`);
            data.push(`${htmlToText.fromString(cs.sort, { wordwrap: 7 })}`);
            data.push(`${htmlToText.fromString(cs.type, { wordwrap: 7 })}`);
            data.push(`${htmlToText.fromString(cs.number, { wordwrap: 7 })}`);
            data.push(`${htmlToText.fromString(cs.problems, { wordwrap: 7 })}`);

            this.bodyTablePdf.push(data);
          }
        } else {
          this.rowHeaderPdf = this.defaultRow;
          this.bodyTablePdf = [
            'null',
            'null',
            'null',
            'null',
            'null',
            'null',
            'null',
            'null',
          ];
        }
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
      { header: 'ลำดับ', field: 'num' },
      { header: 'วันที่', field: 'date' },
      { header: 'รหัส', field: 'key' },
      { header: 'ชื่อ', field: 'firstName' },
      { header: 'นามสกุล', field: 'lastName' },
      { header: 'ที่อยู่', field: 'address' },
      { header: 'เบอร์ติดต่อ', field: 'phone' },
    ];
    this.headerTablePdf = [
      'ลำดับ',
      'วันที่',
      'รหัส',
      'ชื่อ',
      'นามสกุล',
      'ที่อยู่',
      'เบอร์ติดต่อ',
    ];
    this.rowHeaderPdf = ['*', '*', '*', '*', '*', '*', '*'];
    this.customerService.customers().subscribe((result) => {
      this.loading = false;
      if (result.data) {
        const customers = JSON.parse(
          JSON.stringify(result.data.customers)
        ).sort((a: any, b: any) => {
          const date1: any = new Date(a.created_at);
          const date2: any = new Date(b.created_at);
          const result = date1 - date2;
          return result;
        });
        let customersFilter = [];
        for (let [index, customer] of customers.entries())
          if (
            new Date(
              new Date(customer.created_at).setHours(0, 0, 0, 0)
            ).getTime() >= new Date(this.dateStart).getTime() &&
            new Date(
              new Date(customer.created_at).setHours(0, 0, 0, 0)
            ).getTime() <= new Date(this.dateEnd).getTime()
          )
            customersFilter.push({
              num: index + 1,
              date: customer.created_at,
              key: customer.key,
              firstName: customer.firstName,
              lastName: customer.lastName,
              address: customer.address,
              phone: customer.phoneNumber,
            });

        this.tableData = customersFilter;
        if (this.tableData.length > 0) {
          this.bodyTablePdf = [];

          for (let [index, cs] of this.tableData.entries()) {
            let data: string[] = [];
            data.push(`${index + 1}`);
            data.push(
              `${new Date(cs.date).toLocaleDateString('th-TH')} | ${
                new Date(cs.date).getHours().toString().length === 1
                  ? '0' + new Date(cs.date).getHours().toString()
                  : new Date(cs.date).getHours()
              }:${
                new Date(cs.date).getMinutes().toString().length === 1
                  ? '0' + new Date(cs.date).getMinutes().toString()
                  : new Date(cs.date).getMinutes()
              }`
            );
            data.push(`${cs.key}`);
            data.push(`${cs.firstName}`);
            data.push(`${cs.lastName}`);
            data.push(`${cs.address}`);
            data.push(`${cs.phone}`);
            this.bodyTablePdf.push(data);
          }
        } else {
          this.rowHeaderPdf = this.defaultRow;
          this.bodyTablePdf = [
            'null',
            'null',
            'null',
            'null',
            'null',
            'null',
            'null',
            'null',
          ];
        }
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
      { header: 'ลำดับ', field: 'num' },
      { header: 'วันที่', field: 'date' },
      { header: 'รหัส', field: 'key' },
      { header: 'ชื่อ', field: 'firstName' },
      { header: 'นามสกุล', field: 'lastName' },
      { header: 'ที่อยู่', field: 'address' },
      { header: 'เบอร์ติดต่อ', field: 'phone' },
      { header: 'อีเมล์', field: 'email' },
    ];
    this.headerTablePdf = [
      'ลำดับ',
      'วันที่',
      'รหัส',
      'ชื่อ',
      'นามสกุล',
      'ที่อยู่',
      'เบอร์ติดต่อ',
      'อีเมล์',
    ];
    this.rowHeaderPdf = ['*', '*', '*', '*', '*', '*', '*', '*'];
    this.employeeService.employees().subscribe((result) => {
      this.loading = false;
      if (result.data) {
        const employees = JSON.parse(
          JSON.stringify(result.data.employees)
        ).sort((a: any, b: any) => {
          const date1: any = new Date(a.created_at);
          const date2: any = new Date(b.created_at);
          const result = date1 - date2;
          return result;
        });
        let employeesFilter = [];
        for (let [index, employee] of employees.entries())
          if (
            new Date(
              new Date(employee.created_at).setHours(0, 0, 0, 0)
            ).getTime() >= new Date(this.dateStart).getTime() &&
            new Date(
              new Date(employee.created_at).setHours(0, 0, 0, 0)
            ).getTime() <= new Date(this.dateEnd).getTime()
          )
            employeesFilter.push({
              num: index + 1,
              date: employee.created_at,
              key: employee.key,
              firstName: employee.firstName,
              lastName: employee.lastName,
              address: employee.address,
              phone: employee.phoneNumber,
              email: employee.email,
            });

        this.tableData = employeesFilter;
        if (this.tableData.length >= 1) {
          this.bodyTablePdf = [];
          for (let [index, em] of this.tableData.entries()) {
            let data: string[] = [];
            data.push(`${index + 1}`);
            data.push(
              `${new Date(em.date).toLocaleDateString('th-TH')} | ${
                new Date(em.date).getHours().toString().length === 1
                  ? '0' + new Date(em.date).getHours().toString()
                  : new Date(em.date).getHours()
              }:${
                new Date(em.date).getMinutes().toString().length === 1
                  ? '0' + new Date(em.date).getMinutes().toString()
                  : new Date(em.date).getMinutes()
              }`
            );
            data.push(`${em.key}`);
            data.push(`${em.firstName}`);
            data.push(`${em.lastName}`);
            data.push(`${em.address}`);
            data.push(`${em.phone}`);
            data.push(`${em.email}`);
            this.bodyTablePdf.push(data);
          }
        } else {
          this.rowHeaderPdf = this.defaultRow;
          this.bodyTablePdf = [
            'null',
            'null',
            'null',
            'null',
            'null',
            'null',
            'null',
            'null',
          ];
        }
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
