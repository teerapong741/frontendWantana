import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LineService {
  constructor(private http: HttpClient) {}

  messageToCustomer = (lineText: string, lineUserId: string) => {
    // const myHeader = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Headers': 'Content-Type',
    //   'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    // });

    // this.http
    //   .post<any>(
    //     'https://cors-anywhere.linewantana.herokuapp.com/messageToCustomer',
    //     JSON.stringify({
    //       lineText: 'hello',
    //       lineUserId: 'Ufe652df5e990d154d7030b2b1ee67e86',
    //     }),
    //     { headers: myHeader }
    //   )
    //   .subscribe((result) => console.log('result'));
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

    fetch('https://linewantana.herokuapp.com/messageToCustomer', requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));
  };
}
