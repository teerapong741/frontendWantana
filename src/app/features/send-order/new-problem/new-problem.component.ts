import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/core/services/order.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AddProblemComponent } from '../add-problem/add-problem.component';
import { DialogService as dialog } from './../../../core/services/dialog.service';

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.scss'],
})
export class NewProblemComponent implements OnInit {
  @Output() next = new EventEmitter<boolean>();
  clothes: any[] = [];

  constructor(
    private orderService: OrderService,
    public dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: dialog
  ) {}

  ngOnInit() {
    this.clothes = this.orderService.getOrder().clothes;
  }

  onAddProblem(id: number): void {
    const findIndex = this.clothes.findIndex((cloth) => cloth.id === id);
    const ref = this.dialogService.open(AddProblemComponent, {
      data: {
        problems: this.clothes[findIndex].clotheHasProblemsAfter,
      },
      header: 'เพิ่มผ้ามีปัญหา (หลังซัก)',
      width: this.dialog.dialogSize,
    });

    ref.onClose.subscribe((item: any) => {
      if (item) {
        this.clothes[findIndex].clotheHasProblemsAfter = item.problems;
      }
    });
  }

  onNext(): void {
    this.orderService.setOrder({
      ...this.orderService.getOrder(),
      clothes: this.clothes,
    });
    // this.router.navigate(['./../confirm-order-sender'], {
    //   relativeTo: this.route,
    // });
    this.next.emit(true);
  }

  onBack(): void {
    // window.history.back();
    this.next.emit(false);
  }
}
