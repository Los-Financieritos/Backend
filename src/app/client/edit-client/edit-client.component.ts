import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClientService } from '../client.service';
import { Client } from '../client.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent {
  myForm !: FormGroup;
  client$: Observable<Client>;
  dni!: number;

  constructor(private fb: FormBuilder,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    private router: Router) {
      this.reactiveForm();
  }

  reactiveForm() {
    this.myForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      name: ['', [Validators.required, Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.maxLength(25)]],
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

    return control.value !== 'Seleccionar' ? null : { invalidDate: true };
  }
  searchClient(){
    if(this.myForm.get('dni')?.valid){

      this.dni = this.myForm.get('dni')?.value;
      console.log(this.dni);
      this.clientService.getClientById().subscribe(res => {
        this.clientService.client$.next(res);
      });

      if(this.dni){
        this.client$ = this.clientService.client$;

        this.client$.subscribe(res => {
          this.emp = res;
    
          this.myForm.get('dni')?.setValue(this.emp.dni);
          this.myForm.get('name')?.setValue(this.emp.name);
          this.myForm.get('email')?.setValue(this.emp.email);
          this.myForm.get('phone')?.setValue(this.emp.phone);
    
          this.imgfile = this.emp.picture;
          this.previewImg = 'data:image/jpeg;base64,' + this.emp.picture;
    
        })
      }
    }
  }

  saveClient() {

  }
}
