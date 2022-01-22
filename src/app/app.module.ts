import { ClothProblemManagementModule } from './pages/cloth-problem-management/cloth-problem-management.module';
import { TypeClothManagementModule } from './pages/type-cloth-management/type-cloth-management.module';
import { TextureClothManagementModule } from './pages/texture-cloth-management/texture-cloth-management.module';
import { CommonModule } from '@angular/common';
import { ClothManagementModule } from './pages/cloth-management/cloth-management.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// Component
import { AppComponent } from './app.component';

// Module
import { LoginModule } from './core/components/login/login.module';
import { NavbarModule } from './core/components/navbar/navbar.module';
import { SidebarModule } from './core/components/sidebar/sidebar.module';

// PrimeNg

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
    HttpClientModule,
    ClothManagementModule,
    TextureClothManagementModule,
    TypeClothManagementModule,
    ClothProblemManagementModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
