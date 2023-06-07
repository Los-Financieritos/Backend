import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent {
  formInfo!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.createForm();
  }

  createForm() {
    this.formInfo = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.maxLength(25)]],
      username: ['', [Validators.required]],
      company: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password1: ['', [Validators.required]],
      password2: ['', [Validators.required]]
    })
  }


  validarForm() {

    if (this.formInfo.get('name')?.valid &&
      this.formInfo.get('lastname')?.valid &&
      this.formInfo.get('username')?.valid &&
      this.formInfo.get('company')?.valid &&
      this.formInfo.get('email')?.valid &&
      this.formInfo.get('password1')?.valid &&
      this.formInfo.get('password2')?.valid
    ) {
      if (this.formInfo.get('password1')?.value === this.formInfo.get('password2')?.value)
        return true;
    }
    return false;

  }


  sendForm() {

    if (this.validarForm()) {

    let user:User = {
      "id":0,
      "name": this.formInfo.get('name')?.value,
      "lastname": this.formInfo.get('lastname')?.value,
      "username": this.formInfo.get('username')?.value,
      "company": this.formInfo.get('company')?.value,
      "email": this.formInfo.get('email')?.value,
      "password": this.formInfo.get('password1')?.value,

    }
    console.log(user);
    this.authService.signup(user).subscribe({
      next: (response) => {
        console.log(response);
        //this.router.navigateByUrl("/login");     
      },
      error: (error) => {
        console.log(error);
      }

    });
  }

  }
}
