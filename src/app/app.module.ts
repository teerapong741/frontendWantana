import { LoadingComponent } from './core/components/loading/loading.component';
import { ClothProblemService } from './core/services/cloth-problem.service';
import { SpecialClothService } from './core/services/special-cloth.service';
import { TextureClothService } from './core/services/texture-cloth.service';
import { TypeClothService } from './core/services/type-cloth.service';
import { GraphqlModule } from './graphql.module';
import { PagesModule } from './pages/pages.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {InputMaskModule} from 'primeng/inputmask';

// Component
import { AppComponent } from './app.component';

// Module
import { LoginModule } from './core/components/login/login.module';
import { NavbarModule } from './core/components/navbar/navbar.module';
import { SidebarModule } from './core/components/sidebar/sidebar.module';

// PrimeNg
import { TableModule } from 'primeng/table';
import { AddressService } from './core/services/address.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LoginModule,
    SidebarModule,
    NavbarModule,
    TableModule,
    HttpClientModule,
    InputMaskModule,
    PagesModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    GraphqlModule,
  ],
  providers: [
    TypeClothService,
    TextureClothService,
    SpecialClothService,
    ClothProblemService,
    AddressService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
