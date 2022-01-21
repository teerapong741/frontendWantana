import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cloth-table',
  templateUrl: './cloth-table.component.html',
  styleUrls: ['./cloth-table.component.scss'],
})
export class ClothTableComponent implements OnInit {
  clothList: any[] = [];

  constructor() {
    this.clothList = [
      {
        date: new Date(),
        id: '123',
        customer_name: 'Nat',
        number: 7,
        status: 'padding',
        note: 'none',
      },
    ];
  }

  ngOnInit() {}

  onDelete(id: string): void {}
}
