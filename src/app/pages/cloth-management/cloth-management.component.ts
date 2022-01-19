import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cloth-management',
  templateUrl: './cloth-management.component.html',
  styleUrls: ['./cloth-management.component.scss'],
})
export class ClothManagementComponent implements OnInit {
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
      }
    ]
  }

  ngOnInit() {}

  onDelete(id: string): void {}
}
