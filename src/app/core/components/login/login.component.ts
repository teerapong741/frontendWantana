import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  constructor(private readonly router: Router, private route: ActivatedRoute) {}

  ngOnInit() {}

  onLogin(): void {
    this.router.navigate(['./dashboard']);
  }
}
