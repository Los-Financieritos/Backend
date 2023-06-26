import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './home/principal/principal.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterClientComponent } from './client/register-client/register-client.component';
import { EditClientComponent } from './client/edit-client/edit-client.component';
import { RegisterFormComponent } from './proforma/register-form/register-form.component';
import { RegisterUserComponent } from './auth/register-user/register-user.component';
import { domainGuard } from './auth/auth-guard.service'
import { ListFormComponent } from './proforma/list-form/list-form.component';
import { EditFormComponent } from './proforma/edit-form/edit-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'home/:id',
    component: PrincipalComponent,
  },
  {
    path: 'client',
    children: [
      { path: 'register-client', component: RegisterClientComponent },
      { path: 'edit-client', component: EditClientComponent },
    ]
  },
  {
    path: 'proform',
    children: [
      { path: 'register-proform/:id', component: RegisterFormComponent },
      { path: 'detail/:id', component: EditFormComponent },
      { path: 'list-proform', component: ListFormComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register-user', component: RegisterUserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule {


}
