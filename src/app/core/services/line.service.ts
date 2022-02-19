import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LineService {
  constructor(private http: HttpClient) {}

  messageToCustomer = (lineText: string, lineUserId: string): Promise<void> => {
    return new Promise(async (resolve) => {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        lineText,
        lineUserId,
      });

      const requestOptions: any = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      fetch(
        'https://linewantana.herokuapp.com/messageToCustomer',
        requestOptions
      )
        .then(() => {
          return resolve();
        })
        // .then((response) => response.text())
        // .then((result) => console.log(result))
        .catch((error) => console.error('error', error));
    });
  };

  async messageCreateOrder(
    orderDetail: any,
    processOrder: any[],
    outProcessOrder: any[],
    totalCloths: number,
    thickCloths: number,
    thinCloths: number,
    specialCloths: number,
    problemCloths: number,
    inProcess: number,
    outProcess: number
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let message =
        await `คุณ ${orderDetail.customer.firstName} ${orderDetail.customer.lastName} (${orderDetail.customer.key})
ทางร้านได้นำรายการผ้าเข้าสู่ระบบเรียบร้อยแล้ว
-------------------------------


✅  รายการผ้าที่นำเข้าซัก  ✅
`;

      if (processOrder.length > 0) {
        for (let [index, order] of processOrder.entries()) {
          const number = index + 1;
          let problemMessage = '';
          if (!!order.fabric_problem && order.fabric_problem.length > 0) {
            for (let problem of order.fabric_problem) {
              problemMessage = await problemMessage.concat(
                `${problem.name} , `
              );
            }
          }
          message = await message.concat(
            `
${number}) ${!!order.type ? order.type.name : '-'}  |  ${
              !!order.type_of_use && !!order.type_of_use.value
                ? order.type_of_use.name
                : '-'
            }  |  ${!!order.type_special ? order.type_special.name : '-'}
  ปัญหา:   ${!!problemMessage ? problemMessage : '-'}
  จำนวน:   ${order.number} ตัว 
       --------------------- \
            `
          );
        }
      }

      if (outProcessOrder.length > 0) {
        message = await message.concat(`



⛔️  รายการผ้าที่ไม่นำเข้าซัก  ⛔️
        `);
        for (let [index, order] of outProcessOrder.entries()) {
          const number = (await index) + 1;
          let problemMessage = '';
          if (!!order.fabric_problem && order.fabric_problem.length > 0) {
            for (let problem of order.fabric_problem) {
              problemMessage = await problemMessage.concat(
                `${problem.name} , `
              );
            }
          }
          message = await message.concat(
            `
${number}) ${!!order.type ? order.type.name : '-'}  |  ${
              !!order.type_of_use && !!order.type_of_use.value
                ? order.type_of_use.name
                : '-'
            }  |  ${!!order.type_special ? order.type_special.name : '-'}
  ปัญหา:   ${!!problemMessage ? problemMessage : '-'}
  จำนวน:   ${order.number} ตัว
       --------------------- \
            `
          );
        }
      }

      message = await message.concat(`



📣  สรุปรายการ  📣
        `);

      if (totalCloths)
        message = await message.concat(
          `
- จำนวนผ้าทั้งหมด ${totalCloths} ตัว \
          `
        );
      if (thickCloths)
        message = await message.concat(
          `
- ผ้าหนา ${thickCloths} ตัว \
          `
        );
      if (thinCloths)
        message = await message.concat(
          `
- ผ้าบาง ${thinCloths} ตัว \
          `
        );
      if (specialCloths)
        message = await message.concat(
          `
- ผ้าพิเศษ ${specialCloths} ตัว \
          `
        );
      if (problemCloths)
        message = await message.concat(
          `
- เป็นผ้ามีปัญหาจำนวน   ${problemCloths} ตัว \
          `
        );
      if (inProcess)
        message = await message.concat(
          `
- นำเข้าซัก ${inProcess} ตัว \
          `
        );
      if (outProcess)
        message = await message.concat(
          `
- ไม่นำเข้าซัก ${outProcess} ตัว \
          `
        );
      message = await message.concat(`
        
        
-------------------------------
เมื่อเสร็จสิ้นทางร้านจะแจ้งเตือนให้คุณทราบ
  🙏  ขอบคุณที่ใช้บริการ  🙏
        `);

      await this.messageToCustomer(
        message,
        // orderDetail.line_id,
        'Ufe652df5e990d154d7030b2b1ee67e86'
      ).then(() => {
        return resolve();
      });
    });
  }

  async messageSendSeparateOrder(
    customer: any,
    senderOrder: any
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let message =
        await `คุณ ${customer.firstName} ${customer.lastName} (${customer.key})
ทางร้านได้นำผ้าบางรายการส่งคืนให้ลูกค้าแล้ว
-------------------------------


🚚  รายการผ้าที่นำส่ง  🚚
`;
      let isProblem = [];
      let isNotProblem = [];
      isProblem = senderOrder.filter(
        (order: any) =>
          (!!order.clotheHasProblems && order.clotheHasProblems.length > 0) ||
          (!!order.clotheHasProblemsAfter &&
            order.clotheHasProblemsAfter.length > 0)
      );
      isNotProblem = senderOrder.filter(
        (order: any) =>
          (!order.clotheHasProblems || order.clotheHasProblems.length == 0) &&
          (!order.clotheHasProblemsAfter ||
            order.clotheHasProblemsAfter.length == 0)
      );
      senderOrder = [...isNotProblem, ...isProblem];
      let clothList: any[] = [];
      for (let item of senderOrder) {
        const isExist: any[] = [];
        for (let cloth of clothList) {
          let isEqualProblem = false;
          let isEqualProblemAfter = false;
          if (
            (!!item.clotheHasProblems && item.clotheHasProblems.length > 0) ||
            (!!item.clotheHasProblemsAfter &&
              item.clotheHasProblemsAfter.length > 0)
          ) {
            if (!!cloth.clotheHasProblems && !!item.clotheHasProblems) {
              const clothProblem = cloth.clotheHasProblems.map(
                ({ problemClothe }: any) => problemClothe.name
              );
              const itemProblem = item.clotheHasProblems.map(
                ({ problemClothe }: any) => problemClothe.name
              );
              isEqualProblem = this.compare(clothProblem, itemProblem);
            }
            if (
              !!cloth.clotheHasProblemsAfter &&
              !!item.clotheHasProblemsAfter
            ) {
              const clothProblem = cloth.clotheHasProblemsAfter.map(
                (problemClothe: any) => problemClothe.name
              );
              const itemProblem = item.clotheHasProblemsAfter.map(
                (problemClothe: any) => problemClothe.name
              );
              isEqualProblemAfter = this.compare(clothProblem, itemProblem);
            }
            if (
              !!cloth.clotheHasProblems &&
              !!item.clotheHasProblems &&
              isEqualProblem &&
              !cloth.clotheHasProblemsAfter &&
              !item.clotheHasProblemsAfter
            )
              isEqualProblemAfter = true;
            if (
              !cloth.clotheHasProblems &&
              !item.clotheHasProblems &&
              isEqualProblemAfter &&
              !!cloth.clotheHasProblemsAfter &&
              !!item.clotheHasProblemsAfter
            )
              isEqualProblem = true;
            if (
              JSON.stringify(cloth.sortClothe) ===
                JSON.stringify(item.sortClothe) &&
              JSON.stringify(cloth.typeClothe) ===
                JSON.stringify(item.typeClothe) &&
              isEqualProblem &&
              isEqualProblemAfter &&
              JSON.stringify(cloth.specialClothe) ===
                JSON.stringify(item.specialClothe) &&
              JSON.stringify(cloth.key) !== JSON.stringify(item.key)
            )
              await isExist.push(cloth);
          } else {
            let isEqualProblemElse = false;
            let isEqualProblemAfterElse = false;
            if (
              !!item.clotheHasProblems &&
              item.clotheHasProblems.length > 0 &&
              !!cloth.clotheHasProblems &&
              cloth.clotheHasProblems.length > 0
            ) {
              isEqualProblemElse = await this.compare(
                item.clotheHasProblems,
                cloth.clotheHasProblems
              );
            } else isEqualProblemElse = true;
            if (
              !!item.clotheHasProblemsAfter &&
              item.clotheHasProblemsAfter.length > 0 &&
              !!cloth.clotheHasProblemsAfter &&
              cloth.clotheHasProblemsAfter.length > 0
            ) {
              isEqualProblemAfterElse = await this.compare(
                item.clotheHasProblemsAfter,
                cloth.clotheHasProblemsAfter
              );
            } else isEqualProblemAfterElse = true;

            if (
              JSON.stringify(cloth.sortClothe) ===
                JSON.stringify(item.sortClothe) &&
              JSON.stringify(cloth.typeClothe) ===
                JSON.stringify(item.typeClothe) &&
              JSON.stringify(cloth.specialClothe) ===
                JSON.stringify(item.specialClothe) &&
              isEqualProblemElse &&
              isEqualProblemAfterElse &&
              JSON.stringify(cloth.key) !== JSON.stringify(item.key)
            )
              await isExist.push(cloth);
          }
        }

        if (isExist.length === 0)
          clothList.push({
            ...item,
            number: 1,
          });
        else {
          const index = clothList.findIndex(
            (cloth) => cloth.key === isExist[0].key
          );
          clothList[index].number = clothList[index].number + 1;
        }
      }
      senderOrder = clothList;

      for (let [index, order] of senderOrder.entries()) {
        const number = index + 1;
        let problemMessage = '';
        let problemAfterMessage = '';
        if (!!order.clotheHasProblems && order.clotheHasProblems.length > 0) {
          for (let problem of order.clotheHasProblems) {
            problemMessage = await problemMessage.concat(
              `${problem.problemClothe.name} , `
            );
          }
        }
        if (
          !!order.clotheHasProblemsAfter &&
          order.clotheHasProblemsAfter.length > 0
        ) {
          for (let problem of order.clotheHasProblemsAfter) {
            problemAfterMessage = await problemAfterMessage.concat(
              `${problem.name} , `
            );
          }
        }
        message = await message.concat(
          `
${number}) ${!!order.sortClothe ? order.sortClothe.name : '-'}  |  ${
            !!order.typeClothe && !!order.typeClothe.name
              ? order.typeClothe.name
              : '-'
          }  |  ${!!order.specialClothe ? order.specialClothe.name : '-'}
  ปัญหาก่อนซัก:   ${!!problemMessage ? problemMessage : '-'}
  ปัญหาหลังซัก:   ${!!problemAfterMessage ? problemAfterMessage : '-'}
  จำนวน:   ${order.number} ตัว
       --------------------- \
            `
        );
      }

      await this.messageToCustomer(
        message,
        // customer.lineUserId
        'Ufe652df5e990d154d7030b2b1ee67e86'
      ).then(() => {
        return resolve();
      });
    });
  }

  async messageSendClearOrder(customer: any, senderOrder: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let message =
        await `คุณ ${customer.firstName} ${customer.lastName} (${customer.key})
ทางร้านได้นำผ้าส่งคืนให้ลูกค้าแล้ว
-------------------------------


🚚  รายการผ้าที่นำส่ง  🚚
`;
      let isProblem = [];
      let isNotProblem = [];
      isProblem = senderOrder.filter(
        (order: any) =>
          (!!order.clotheHasProblems && order.clotheHasProblems.length > 0) ||
          (!!order.clotheHasProblemsAfter &&
            order.clotheHasProblemsAfter.length > 0)
      );
      isNotProblem = senderOrder.filter(
        (order: any) =>
          (!order.clotheHasProblems || order.clotheHasProblems.length == 0) &&
          (!order.clotheHasProblemsAfter ||
            order.clotheHasProblemsAfter.length == 0)
      );
      senderOrder = [...isNotProblem, ...isProblem];
      let clothList: any[] = [];
      for (let item of senderOrder) {
        const isExist: any[] = [];
        for (let cloth of clothList) {
          let isEqualProblem = false;
          let isEqualProblemAfter = false;
          if (
            (!!item.clotheHasProblems && item.clotheHasProblems.length > 0) ||
            (!!item.clotheHasProblemsAfter &&
              item.clotheHasProblemsAfter.length > 0)
          ) {
            if (!!cloth.clotheHasProblems && !!item.clotheHasProblems) {
              const clothProblem = cloth.clotheHasProblems.map(
                ({ problemClothe }: any) => problemClothe.name
              );
              const itemProblem = item.clotheHasProblems.map(
                ({ problemClothe }: any) => problemClothe.name
              );
              isEqualProblem = this.compare(clothProblem, itemProblem);
            }
            if (
              !!cloth.clotheHasProblemsAfter &&
              !!item.clotheHasProblemsAfter
            ) {
              const clothProblem = cloth.clotheHasProblemsAfter.map(
                (problemClothe: any) => problemClothe.name
              );
              const itemProblem = item.clotheHasProblemsAfter.map(
                (problemClothe: any) => problemClothe.name
              );
              isEqualProblemAfter = this.compare(clothProblem, itemProblem);
            }
            if (
              !!cloth.clotheHasProblems &&
              !!item.clotheHasProblems &&
              isEqualProblem &&
              !cloth.clotheHasProblemsAfter &&
              !item.clotheHasProblemsAfter
            )
              isEqualProblemAfter = true;
            if (
              !cloth.clotheHasProblems &&
              !item.clotheHasProblems &&
              isEqualProblemAfter &&
              !!cloth.clotheHasProblemsAfter &&
              !!item.clotheHasProblemsAfter
            )
              isEqualProblem = true;
            if (
              JSON.stringify(cloth.sortClothe) ===
                JSON.stringify(item.sortClothe) &&
              JSON.stringify(cloth.typeClothe) ===
                JSON.stringify(item.typeClothe) &&
              isEqualProblem &&
              isEqualProblemAfter &&
              JSON.stringify(cloth.specialClothe) ===
                JSON.stringify(item.specialClothe) &&
              JSON.stringify(cloth.key) !== JSON.stringify(item.key)
            )
              await isExist.push(cloth);
          } else {
            let isEqualProblemElse = false;
            let isEqualProblemAfterElse = false;
            if (
              !!item.clotheHasProblems &&
              item.clotheHasProblems.length > 0 &&
              !!cloth.clotheHasProblems &&
              cloth.clotheHasProblems.length > 0
            ) {
              isEqualProblemElse = await this.compare(
                item.clotheHasProblems,
                cloth.clotheHasProblems
              );
            } else isEqualProblemElse = true;
            if (
              !!item.clotheHasProblemsAfter &&
              item.clotheHasProblemsAfter.length > 0 &&
              !!cloth.clotheHasProblemsAfter &&
              cloth.clotheHasProblemsAfter.length > 0
            ) {
              isEqualProblemAfterElse = await this.compare(
                item.clotheHasProblemsAfter,
                cloth.clotheHasProblemsAfter
              );
            } else isEqualProblemAfterElse = true;

            if (
              JSON.stringify(cloth.sortClothe) ===
                JSON.stringify(item.sortClothe) &&
              JSON.stringify(cloth.typeClothe) ===
                JSON.stringify(item.typeClothe) &&
              JSON.stringify(cloth.specialClothe) ===
                JSON.stringify(item.specialClothe) &&
              isEqualProblemElse &&
              isEqualProblemAfterElse &&
              JSON.stringify(cloth.key) !== JSON.stringify(item.key)
            )
              await isExist.push(cloth);
          }
        }

        if (isExist.length === 0)
          clothList.push({
            ...item,
            number: 1,
          });
        else {
          const index = clothList.findIndex(
            (cloth) => cloth.key === isExist[0].key
          );
          clothList[index].number = clothList[index].number + 1;
        }
      }
      senderOrder = clothList;

      for (let [index, order] of senderOrder.entries()) {
        const number = index + 1;
        let problemMessage = '';
        let problemAfterMessage = '';
        if (!!order.clotheHasProblems && order.clotheHasProblems.length > 0) {
          for (let problem of order.clotheHasProblems) {
            problemMessage = await problemMessage.concat(
              `${problem.problemClothe.name} , `
            );
          }
        }
        if (
          !!order.clotheHasProblemsAfter &&
          order.clotheHasProblemsAfter.length > 0
        ) {
          for (let problem of order.clotheHasProblemsAfter) {
            problemAfterMessage = await problemAfterMessage.concat(
              `${problem.name} , `
            );
          }
        }
        message = await message.concat(
          `
${number}) ${!!order.sortClothe ? order.sortClothe.name : '-'}  |  ${
            !!order.typeClothe && !!order.typeClothe.name
              ? order.typeClothe.name
              : '-'
          }  |  ${!!order.specialClothe ? order.specialClothe.name : '-'}
  ปัญหาก่อนซัก:   ${!!problemMessage ? problemMessage : '-'}
  ปัญหาหลังซัก:   ${!!problemAfterMessage ? problemAfterMessage : '-'}
  จำนวน:   ${order.number} ตัว
       --------------------- \
            `
        );
      }

      message = await message.concat(`
        
        
-------------------------------
  🙏  ขอบคุณที่ใช้บริการ  🙏
        `);

      await this.messageToCustomer(
        message,
        // customer.lineUserId
        'Ufe652df5e990d154d7030b2b1ee67e86'
      ).then(() => {
        return resolve();
      });
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
}
