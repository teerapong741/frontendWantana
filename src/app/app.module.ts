import { ClothManagementModule } from './pages/cloth-management/cloth-management.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

// Component
import { AppComponent } from './app.component';

// Module
import { LoginModule } from './core/components/login/login.module';
import { NavbarModule } from './core/components/navbar/navbar.module';
import { SidebarModule } from './core/components/sidebar/sidebar.module';

// PrimeNg

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    SidebarModule,
    NavbarModule,
    ClothManagementModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
