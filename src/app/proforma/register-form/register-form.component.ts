import { Component } from '@angular/core';
import { Form } from '../form.interface';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent {

  myForm !: FormGroup;
  frm!: Form;
  constructor(private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router) { this.reactiveForm(); }

  reactiveForm() {
    this.myForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.maxLength(25)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      birth: ['', [Validators.required]],
      nationality: ['', [Validators.required, Validators.maxLength(25)]],
      gender: ['Seleccionar', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      state_civil: ['Seleccionar', [Validators.required]],
      direction: ['', [Validators.required, Validators.maxLength(60)]],
      namePartner: ['', [Validators.required, Validators.maxLength(25)]],
      lastnamePartner: ['', [Validators.required, Validators.maxLength(25)]],
      dni_partner: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      phonePartner: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      birthPartner: ['', [Validators.required]],
      profession: ['', [Validators.required, Validators.maxLength(40)]],
      company: ['', [Validators.required, Validators.maxLength(40)]],
      income: ['', [Validators.required]]
    })
  }
}
