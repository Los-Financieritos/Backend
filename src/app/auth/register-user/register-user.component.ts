import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent {
  formInfo!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.formInfo = this.fb.group({
      user: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required]],
    })
  }


  validarForm() {

    if (this.formInfo.get('user')?.valid && this.formInfo.get('password')?.valid) {
      return true;
    }
    return false;

  }


  sendForm() {

   if (this.validarForm()) {

      let object = {
        "data": {
          "user": this.formInfo.get('user')?.value,
          "password": this.formInfo.get('password')?.value,
        }
      }
      console.log(object);


    } 

  }
}
