import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrincipalComponent } from './home/principal/principal.component';
import { EditClientComponent } from './client/edit-client/edit-client.component';
import { RegisterClientComponent } from './client/register-client/register-client.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterFormComponent } from './proforma/register-form/register-form.component';
import { EditFormComponent } from './proforma/edit-form/edit-form.component';
import { ListFormComponent } from './proforma/list-form/list-form.component';
import { CronogramComponent } from './proforma/cronogram/cronogram.component';
import { RegisterUserComponent } from './auth/register-user/register-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BannerComponent } from './shared/banner/banner.component';

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    EditClientComponent,
    RegisterClientComponent,
    LoginComponent,
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
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
