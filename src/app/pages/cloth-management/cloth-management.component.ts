import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  fader,
  stepper,
  slider,
  transformer,
} from './../../core/animations/route-animations';

@Component({
  selector: 'app-cloth-management',
  templateUrl: './cloth-management.component.html',
  styleUrls: ['./cloth-management.component.scss'],
  animations: [fader, 
    // stepper, slider, transformer
  ],
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
      },
    ];
  }

  ngOnInit() {}

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }

  onDelete(id: string): void {}
}
