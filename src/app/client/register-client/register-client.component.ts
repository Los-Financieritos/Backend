import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClientService } from '../client.service';
import { Client } from '../client.interface';

@Component({
  selector: 'app-register-client',
  templateUrl: './register-client.component.html',
  styleUrls: ['./register-client.component.css']
})
export class RegisterClientComponent {
  myForm !: FormGroup;
  cli!: Client;
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

  saveClient() {
    const client: Client = {
      name: this.myForm.get('name')!.value,
      lastname: this.myForm.get('lastname')!.value,
      dni: this.myForm.get('dni')!.value,
      birth: this.myForm.get('birth')!.value,
      nationality: this.myForm.get('nationality')!.value,
      gender: this.myForm.get('gender')!.value,
      phone: this.myForm.get('phone')!.value,
      state_civil: this.myForm.get('state_civil')!.value,
      direction: this.myForm.get('direction')!.value,
      namePartner: this.myForm.get('namePartner')!.value,
      lastnamePartner: this.myForm.get('lastnamePartner')!.value,
      dni_partner: this.myForm.get('dni_partner')!.value,
      phonePartner: this.myForm.get('phonePartner')!.value,
      birthPartner: this.myForm.get('birthPartner')!.value,
      profession: this.myForm.get('profession')!.value,
      company: this.myForm.get('company')!.value,
      income: this.myForm.get('income')!.value,

    };

    this.clientService.getClientById(client.dni).subscribe(res =>{
      this.cli = res;
    });

    console.log(this.cli.dni + 'dd' + client.dni);
    if(this.cli.dni === client.dni){
      this.snackBar.open('Ya existe un empleado con el mismo DNI', '', {
        duration: 2000,
      });
      return;
    }
    this.clientService.addClient(client).subscribe({
      next: (data) => {
        this.snackBar.open('El cliente fue registrado con éxito!', '', {
          duration: 2000,
        });
        
      },
      error: (err) => {
        
        this.snackBar.open('No se puede registrar al cliente!', '', {
          duration: 2000,
        });
        
      },
    });
  }


}
