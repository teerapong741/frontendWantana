import { Router, ActivatedRoute } from '@angular/router';
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

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {}

  onBack(): void {
    window.history.back();
  }

  onLogout(): void {
    this.router.navigate(['login'])
  }
}
