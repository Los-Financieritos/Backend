import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrincipalComponent } from './home/principal/principal.component';
import { EditClientComponent } from './client/edit-client/edit-client.component';
import { RegisterClientComponent } from './client/register-client/register-client.component';
import { RegisterFormComponent } from './proforma/register-form/register-form.component';
import { EditFormComponent } from './proforma/edit-form/edit-form.component';
import { ListFormComponent } from './proforma/list-form/list-form.component';
import { CronogramComponent } from './proforma/cronogram/cronogram.component';
import { RegisterUserComponent } from './auth/register-user/register-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BannerComponent } from './shared/banner/banner.component';
import { LoginComponent } from './auth/login/login.component';
import { ErrorInterceptorService } from './auth/error-interceptor.service';
import { TokenInterceptorService } from './auth/token-interceptor.interceptor';
import { AuthInterceptorService } from './auth/auth-interceptor.service';


@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    LoginComponent,
    EditClientComponent,
    RegisterClientComponent,
    RegisterFormComponent,
    EditFormComponent,
    ListFormComponent,
    CronogramComponent,
    RegisterUserComponent,
    BannerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
