import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClothProblemService } from 'src/app/core/services/cloth-problem.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-problem',
  templateUrl: './add-problem.component.html',
  styleUrls: ['./add-problem.component.scss'],
})
export class AddProblemComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  $subscriptions: Subscription | undefined = undefined;

  problemOptions: any[] = [];
  problemSelected: any = null;

  constructor(
    private readonly clothProblemService: ClothProblemService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {}

  ngOnInit() {
    this.$subscriptions = this.clothProblemService
      .problemClothes()
      .subscribe((result) => {
        this.loading = false;
        if (!!result.data) {
          const problemCloths = JSON.parse(
            JSON.stringify(result.data.problemClothes)
          );
          const problemClothsFilter = [];
          for (let problem of problemCloths) {
            problemClothsFilter.push({
              ...problem,
              value: problem.name,
            });
          }

          this.problemOptions = problemClothsFilter;
        } else {
          Swal.fire({
            title: 'Error!',
            text: result.errors[0].message,
            icon: 'error',
            confirmButtonText: 'ตกลง',
          });
        }
      });
    if (this.config.data.problems) {
      this.problemSelected = this.config.data.problems
    }
  }

  onAdd() {
    this.ref.close({
      problems: this.problemSelected,
    });
  }

  ngOnDestroy(): void {
    if (!!this.$subscriptions) this.$subscriptions.unsubscribe();
  }
}
