import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClientService } from '../client.service';
import { Client } from '../client.interface';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent {
  myForm !: FormGroup;

  constructor(private fb: FormBuilder,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    private router: Router) { this.reactiveForm(); }

  reactiveForm() {
    this.myForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.maxLength(25)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      birth: ['', [Validators.required]],
      nationality: ['', [Validators.required, Validators.maxLength(25)]],
      gender: ['Seleccionar', [this.comboValidator]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      state_civil: ['Seleccionar', [this.comboValidator]],
      direction: ['', [Validators.required, Validators.maxLength(60)]],
      namePartner: ['', [Validators.required, Validators.maxLength(25)]],
      lastnamePartner: ['', [Validators.required, Validators.maxLength(25)]],
      dni_partner: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      phonePartner: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      birthPartner: ['', [Validators.required]],
      profession: ['', [Validators.required, Validators.maxLength(40)]],
      company: ['', [Validators.required, Validators.maxLength(40)]],
      income: ['', [Validators.required, Validators.min(0)]]
    })
  }
  comboValidator(control: { value: string; }) {

    return control.value !== 'Seleccionar' ? null : { invalidDate:true};
  }

  saveClient() {

  }
}
