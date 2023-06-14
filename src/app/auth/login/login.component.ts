import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Credentials, User } from '../user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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


  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router, private snackbar: MatSnackBar) {
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
      
      const exist = this.authService.arrayUsers.find(user => 
        (user.email === credentials.email && user.password === credentials.password));

      if(!exist){
        this.snackbar.open('Las credenciales son incorrectas.', '', {
          duration: 2000,
        });
        return;
      }


      this.authService.ingresar(credentials).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (error) => {
          this.snackbar.open('No puede ingresar!', '', {
            duration: 2000,
          });
          this.isLoading = false;

        }
      });
    }
  }

  changeViewPassword() {
    this.viewPsw = this.viewPsw ? false : true;
  }

}