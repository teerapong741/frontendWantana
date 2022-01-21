import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  param = { value: 'world' };
  translate: TranslateService | any;

  constructor(translate: TranslateService) {
    this.translate = translate;
    this.translate.setDefaultLang('th');
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }
}
