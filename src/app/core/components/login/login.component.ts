import { AuthService, AuthData } from './../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  $subscription: Subscription | any = null;

  authEmployees: any[] = [];
  username: string = '';
  password: string = '';

  constructor(
    private readonly router: Router,
    private route: ActivatedRoute,
    private readonly employeeService: EmployeeService,
    private readonly authService: AuthService
  ) {}

  ngOnInit() {
    this.$subscription = this.employeeService
      .authEmployees()
      .subscribe((result) => {
        if (!!result.data) {
          const authEmployees = result.data.employees;
          this.authEmployees = authEmployees;
        } else {
          console.error(result);
        }
      });
    this.authService.setIsLogin(null);
  }

  onLogin(): void {
    if (!!this.username && !!this.password) {
      const employee = this.authEmployees.filter(
        (emp) => emp.email === this.username
      );
      if (employee.length === -1) {
        console.error('ไม่พบอีเมล์');
      } else {
        if (this.password === employee[0].password) {
          const authData: AuthData = {
            id: employee[0].id,
            key: employee[0].key,
            email: employee[0].email,
            role: employee[0].role,
            firstName: employee[0].firstName,
            lastName: employee[0].lastName,
          };
          this.authService.setIsLogin(authData);
          this.router.navigate(['./dashboard']);
        }
      }
    } else {
      console.error('โปรดกรอกข้อมูลให้ครบ');
    }
  }

  ngOnDestroy(): void {
    if (!!this.$subscription) this.$subscription.unsubscribe();
    if (!!this.authEmployees) this.authEmployees = [];
  }
}
