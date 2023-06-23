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
  client$!: Observable<Client>;
  dni!: string;

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
      birth: ['dd/mm/yyyy', [Validators.required]],
      nationality: ['', [Validators.required, Validators.maxLength(25)]],
      gender: ['Seleccionar', [this.comboValidator]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      state_civil: ['Seleccionar', [this.comboValidator]],
      direction: ['', [Validators.required, Validators.maxLength(60)]],
      namePartner: ['', [Validators.maxLength(25)]],
      lastnamePartner: ['', [Validators.maxLength(25)]],
      dni_partner: ['', [Validators.pattern('^[0-9]{8}$')]],
      phonePartner: ['', [Validators.pattern('^[0-9]{9}$')]],
      birthPartner: ['dd/mm/yyyy'],
      profession: ['', [Validators.required, Validators.maxLength(40)]],
      company: ['', [Validators.required, Validators.maxLength(40)]],
      income: ['', [Validators.required, Validators.min(0)]]
    })
  }
  comboValidator(control: { value: string; }) {

    return control.value !== 'Seleccionar' ? null : { invalidDate: true };
  }
  searchClient() {
    if (!this.myForm.get('dni')?.value) {
      this.snackBar.open('Ingrese el DNI del cliente que quiere editar', '', {
        duration: 2000,
      });
      return;
    }
    if (this.myForm.get('dni')?.valid) {

      this.dni = this.myForm.get('dni')?.value;

      this.clientService.getClientById(this.dni).subscribe({
        next: (res) => {
          if (res) {
            this.myForm.get('dni')?.setValue(res.dni);
            this.myForm.get('name')?.setValue(res.name);
            this.myForm.get('lastname')?.setValue(res.lastname);
            this.myForm.get('birth')?.setValue(new Date(res.birth).toISOString().substring(0, 10));
            this.myForm.get('nationality')?.setValue(res.nationality);
            this.myForm.get('gender')?.setValue(res.gender);
            this.myForm.get('phone')?.setValue(res.phone);
            this.myForm.get('state_civil')?.setValue(res.state_civil);
            this.myForm.get('direction')?.setValue(res.direction);
            this.myForm.get('namePartner')?.setValue(res.namePartner);
            this.myForm.get('lastnamePartner')?.setValue(res.lastnamePartner);
            this.myForm.get('dni_partner')?.setValue(res.dni_partner);
            this.myForm.get('phonePartner')?.setValue(res.phonePartner);
            if(res.birthPartner){
              this.myForm.get('birthPartner')?.setValue(new Date(res.birthPartner).toISOString().substring(0, 10))}
              else  this.myForm.get('birthPartner')?.setValue('dd/mm/yyyy');
            this.myForm.get('profession')?.setValue(res.profession);
            this.myForm.get('company')?.setValue(res.company);
            this.myForm.get('income')?.setValue(res.income);
          

          }
          else{
            this.snackBar.open('No existe un cliente con el DNI ingresado', '', {
              duration: 2000,
            });
          }
        }
      });

    }

  }

  saveClient() {

    const client: Client = {
      dni: this.dni,
      name: this.myForm.get('name')!.value,
      lastname: this.myForm.get('lastname')!.value,
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
 
    this.clientService.updateClient(this.dni, client).subscribe({
      next: (data) => {
        this.snackBar.open('El cliente fue actualizado con éxito!', '', {
          duration: 2000,
        });

      },
      error: (err) => {

       console.log(err);

      },
    });
  }
  
}
