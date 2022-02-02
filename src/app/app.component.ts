import {
  problemClothList,
  specialClothList,
  typeClothList,
  textureClothList,
} from './core/values/cloth.value';
import { Subscription } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TypeClothService } from './core/services/type-cloth.service';
import { TextureClothService } from './core/services/texture-cloth.service';
import { ClothProblemService } from './core/services/cloth-problem.service';
import { SpecialClothService } from './core/services/special-cloth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  $subscription: Subscription | undefined = undefined;

  param = { value: 'world' };
  translate: TranslateService | any;

  typeClothes: string[] = [];
  textureClothes: string[] = [];
  specialClothes: string[] = [];
  problemClothes: string[] = [];

  constructor(
    translate: TranslateService,
    public authService: AuthService,
    private readonly typeClothService: TypeClothService,
    private readonly textureClothService: TextureClothService,
    private readonly clothProblemService: ClothProblemService,
    private readonly specialClothService: SpecialClothService
  ) {
    this.translate = translate;
    this.translate.setDefaultLang('th');
  }

  async ngOnInit(): Promise<void> {
    await this.onTypeClothes();
    await this.onTextureClothes();
    await this.onSpecialClothes();
    await this.onProblemClothes();

    for (let type of typeClothList) {
      if (!this.typeClothes.includes(type)) {
        const createTypeCloth = await this.onCreateTypeCloth(type);
      }
    }

    for (let texture of textureClothList) {
      if (!this.textureClothes.includes(texture)) {
        const createTextureClothe = await this.onCreateTextureCloth(texture);
      }
    }

    for (let special of specialClothList) {
      if (!this.specialClothes.includes(special)) {
        const createSpecialClothe = await this.onCreateSpecialCloth(special);
      }
    }

    for (let problem of problemClothList) {
      if (!this.problemClothes.includes(problem)) {
        const problemClothe = await this.onCreateProblemCloth(problem);
      }
    }
  }

  async onTypeClothes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.$subscription = this.typeClothService
        .typeClothes()
        .subscribe(async (result) => {
          if (!!result.data) {
            let typeClothes: any = await JSON.parse(
              JSON.stringify(result.data.typeClothes)
            );
            typeClothes = await typeClothes.map(({ name }: any) => name);
            this.typeClothes = typeClothes;
            resolve();
          } else {
            reject();
          }
        });
    });
  }

  async onTextureClothes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.$subscription = this.textureClothService
        .sortClothes()
        .subscribe((result) => {
          if (!!result.data) {
            let sortClothes: any = JSON.parse(
              JSON.stringify(result.data.sortClothes)
            );
            sortClothes = sortClothes.map(({ name }: any) => name);
            this.textureClothes = sortClothes;
            resolve();
          } else {
            reject();
          }
        });
    });
  }

  async onSpecialClothes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.$subscription = this.specialClothService
        .specialClothes()
        .subscribe((result) => {
          if (!!result.data) {
            let specialClothes: any = JSON.parse(
              JSON.stringify(result.data.specialClothes)
            );
            specialClothes = specialClothes.map(({ name }: any) => name);
            this.specialClothes = specialClothes;
            resolve();
          } else {
            reject();
          }
        });
    });
  }

  async onProblemClothes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.$subscription = this.clothProblemService
        .problemClothes()
        .subscribe((result) => {
          if (!!result.data) {
            let problemClothes: any = JSON.parse(
              JSON.stringify(result.data.problemClothes)
            );
            problemClothes = problemClothes.map(({ name }: any) => name);
            this.problemClothes = problemClothes;
            resolve();
          } else {
            reject();
          }
        });
    });
  }

  async onCreateTypeCloth(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.$subscription = this.typeClothService
        .createTypeClothe({ name })
        .subscribe((result) => {
          if (!!result.data) {
            resolve();
          } else {
            reject();
          }
        });
    });
  }

  async onCreateTextureCloth(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.$subscription = this.textureClothService
        .createSortClothe({ name })
        .subscribe((result) => {
          if (!!result.data) {
            resolve();
          } else {
            reject();
          }
        });
    });
  }

  async onCreateSpecialCloth(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.$subscription = this.specialClothService
        .createSpecialClothe({ name })
        .subscribe((result) => {
          if (!!result.data) {
            resolve();
          } else {
            reject();
          }
        });
    });
  }

  async onCreateProblemCloth(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.$subscription = this.clothProblemService
        .createProblemClothe({ name })
        .subscribe((result) => {
          if (!!result.data) {
            resolve();
          } else {
            reject();
          }
        });
    });
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }

  ngOnDestroy(): void {
    if (!!this.$subscription) this.$subscription.unsubscribe();
  }
}
