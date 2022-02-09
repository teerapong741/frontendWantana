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

// Component
import { AppComponent } from './app.component';

// Module
import { LoginModule } from './core/components/login/login.module';
import { NavbarModule } from './core/components/navbar/navbar.module';
import { SidebarModule } from './core/components/sidebar/sidebar.module';

// PrimeNg
import { TableModule } from 'primeng/table';

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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
