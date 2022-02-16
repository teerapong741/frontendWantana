import { EmployeeService } from './../../services/employee.service';
import { AuthService, AuthData } from './../../services/auth.service';
import {
  Router,
  ActivatedRoute,
  NavigationStart,
  Event,
} from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  pageName: string = 'หน้าแรก';
  username: string = 'ไม่ระบุตัวตน';
  visibleToggleMenu: boolean = false;

  id: number = 0;
  employee: AuthData | null | any = null;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    public authService: AuthService,
    private readonly employeeService: EmployeeService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        const firstPath = event.url.split('/').filter((path) => path !== '')[0];
        if (firstPath === 'dashboard') this.pageName = 'หน้าแรก';
        else if (firstPath === 'cloth-management') this.pageName = 'จัดการผ้า';
        else if (firstPath === 'texture-cloth-management')
          this.pageName = 'จัดการชนิดเนื้อผ้า';
        else if (firstPath === 'type-cloth-management')
          this.pageName = 'จัดการประเภทการใช้งานผ้า';
        else if (firstPath === 'cloth-problem-management')
          this.pageName = 'จัดการประเภทผ้ามีปัญหา';
        else if (firstPath === 'employee-management')
          this.pageName = 'จัดการข้อมูลพนักงาน';
        else if (firstPath === 'special-cloth-management')
          this.pageName = 'จัดการข้อมูลผ้าชนิดพิเศษ';
        else if (firstPath === 'customer-management')
          this.pageName = 'จัดการข้อมูลลูกค้า';
        else if (firstPath === 'profile') this.pageName = 'โปรไฟล์';
        else if (firstPath === 'reports') this.pageName = 'ออกรายงาน';
        else this.pageName = 'ไม่ได้ระบุ';
      }
      // NavigationEnd
      // NavigationCancel
      // NavigationError
      // RoutesRecognized
    });
  }

  ngOnInit() {
    this.id = this.authService.isCodeEmployee().id;
    console.log(this.id)
    this.employeeService.employee(this.id).subscribe((result) => {
      if (result.data) {
        const employee = result.data.employee;
        this.employee = employee;
        console.log(result)
      }
    });
  }

  onBack(): void {
    window.history.back();
  }

  onLogout(): void {
    this.authService.setIsLogin(null);
    this.router.navigate(['login']);
  }
}
