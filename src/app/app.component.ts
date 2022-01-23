import { AuthService } from './core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  param = { value: 'world' };
  translate: TranslateService | any;

  constructor(translate: TranslateService, public authService: AuthService) {
    this.translate = translate;
    this.translate.setDefaultLang('th');
  }

  ngOnInit(): void {}

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }
}
