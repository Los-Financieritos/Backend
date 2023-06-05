import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './home/principal/principal.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterClientComponent } from './client/register-client/register-client.component';
import { EditClientComponent } from './client/edit-client/edit-client.component';
import { RegisterFormComponent } from './proforma/register-form/register-form.component';
import { EditFormComponent } from './proforma/edit-form/edit-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: PrincipalComponent,
    //canActivate: [AuthGuard],
  },
  { path: 'client',
    children: [
    { path:'register-client', component: RegisterClientComponent },
    { path:'edit-client', component: EditClientComponent },
  ]
  },
  { path: 'proform',
    children: [
    { path:'register-proform', component: RegisterFormComponent },
    { path:'edit-proform', component: EditFormComponent },
  ]
  },
  { path: 'auth', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


 }
