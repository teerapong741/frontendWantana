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
  pageName: string = 'Dashboard';
  username: string = 'ไม่ระบุตัวตน';
  visibleToggleMenu: boolean = false;

  employee: AuthData | null = null;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    public authService: AuthService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        const firstPath = event.url.split('/').filter((path) => path !== '')[0];
        if (firstPath === 'dashboard') this.pageName = 'แดชบอร์ด';
        else if (firstPath === 'cloth-management') this.pageName = 'จัดการผ้า';
        else if (firstPath === 'texture-cloth-management')
          this.pageName = 'จัดการชนิดเนื้อผ้า';
        else if (firstPath === 'type-cloth-management')
          this.pageName = 'จัดการประเภทการใช้งานผ้า';
        else if (firstPath === 'cloth-problem-management')
          this.pageName = 'จัดการประเภทผ้ามีปัญหา';
        else if (firstPath === 'employee-management')
          this.pageName = 'จัดการข้อมูลพนักงาน';
        else if (firstPath === 'customer-management')
          this.pageName = 'จัดการข้อมูลลูกค้า';
        else if (firstPath === 'profile') this.pageName = 'โปรไฟล์';
        else this.pageName = 'ไม่ได้ระบุ';
      }
      // NavigationEnd
      // NavigationCancel
      // NavigationError
      // RoutesRecognized
    });
  }

  ngOnInit() {
    this.employee = this.authService.isCodeEmployee();
    console.log(this.employee);
  }

  onBack(): void {
    window.history.back();
  }

  onLogout(): void {
    this.authService.setIsLogin(null);
    this.router.navigate(['login']);
  }
}
