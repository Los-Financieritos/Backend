import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Credentials, Login, User } from '../user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formInfo!: FormGroup;
  viewPsw: boolean = false;
  error!: string;
  isLoading = false;

  arrayUsers: User[] = [];
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.createForm();
  }

  createForm() {
    this.formInfo = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    this.authService.getUsers().subscribe(
      (res) => {
  
        for (let i of res) {
          this.arrayUsers.push(i);
        }
  
        this.authService.dataUsers$.next(this.arrayUsers);
        this.authService.arrayUsers = this.arrayUsers;
      });
  }

  validarForm() {

    if (this.formInfo.get('email')?.valid && this.formInfo.get('password')?.valid) {
      return true;
    }
    return false;

  }

  loginForm() {

    if (this.validarForm()) {

      const credentials: Credentials = {

        "email": this.formInfo.get('email')?.value,
        "password": this.formInfo.get('password')?.value,

      }
      console.log('send : ' + credentials.email + " " +credentials.password);
      console.log(this.authService.arrayUsers);

      this.authService.ingresar(credentials).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (error) => {
          console.log(error);
          this.error = error;
          this.isLoading = false;
        }
      });
    }
  }
  /*this.authService.getUsers().subscribe(
    (res) => {

      for (let i of res) {
        this.arrayUsers.push(i);
      }

      this.authService.dataUsers$.next(this.arrayUsers);
      this.authService.arrayUsers = this.arrayUsers;
    });
  console.log(this.authService.arrayUsers);

 
      this.authService.login(credentials).subscribe({
        next: (res) => {
          localStorage.setItem('platzi_token', res.token);
          this.isLoading = false;
          this.router.navigateByUrl("/home");
          this.formInfo.reset();
        },
        error: (error) => {
          console.log(error);
          this.error = error;
          this.isLoading = false;
        }
  
      });

  this.authService.ingresar(credentials).subscribe({
    next: (res) => {
      console.log(res);
    },
    error: (error) => {
      console.log(error);
      this.error = error;
      this.isLoading = false;
    }
  });
  */


  changeViewPassword() {
    this.viewPsw = this.viewPsw ? false : true;
  }

}