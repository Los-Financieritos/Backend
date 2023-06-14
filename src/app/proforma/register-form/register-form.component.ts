import { Component, OnInit } from '@angular/core';
import { Form } from '../form.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormService } from '../form.service';
import { Entidad } from '../entidad.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

  myForm !: FormGroup;
  frm!: Form;
  dataEntidades$!: Observable<Entidad[]>;
  entidades: Entidad[] = [];

  //Variables de min y max segun entidad
  t_min!: number;
  t_max!: number;

  mminimo!: number;
  mmaximo!: number;

  plazomax!: number;

  //Variables de calculo
  todollar: number = 0.27384;

  constructor(private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private serv: FormService) {
    this.dataEntidades$ = this.serv.entidades$;
    this.reactiveForm();
  }

  ngOnInit() {
    this.serv.getEntidades().subscribe(
      {
        next: (res) => {
          this.entidades = res;
          this.serv.entidades$.next(this.entidades);
        }
      });
  }

  setMinandMax() {
    const seleccionado = this.myForm.get('entidad')?.value;
    this.t_min = seleccionado.tminimo;
    this.t_max = seleccionado.tmaximo;

    this.mminimo = seleccionado.mminimo;
    this.mmaximo = seleccionado.mmaximo;
    this.plazomax = seleccionado.plazomax;

    console.log(this.mmaximo);
  }

  reactiveForm() {

    this.myForm = this.fb.group({
      dniclient: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      moneda: ['Seleccionar', [Validators.required, this.comboValidator]],
      entidad: ['Seleccionar', [Validators.required, this.comboValidator]],

      price: ['', [Validators.required]],
      cuota_initial: ['', [Validators.required]],
      apoyo: ['Seleccionar', [Validators.required, this.comboValidator]],
      sostenible: ['Seleccionar', [Validators.required, this.comboValidator]],
      tea: ['', [Validators.required]],
      segdegra: ['', [Validators.required]],
      seginm: ['', [Validators.required]],
      plazo: ['', [Validators.required]],
      periodo_gracia: ['', [Validators.required]],

      porc_cuotaini: [''],
      bbp: [''],
      monto_prestamo: [''],
      tcea: [''],
      info: ['']
    });
  }

  DatosIniIngresados(): boolean {
    if ((this.myForm.get('dniclient')?.invalid)
      || (this.myForm.get('moneda')?.invalid)
      || (this.myForm.get('entidad')?.invalid)) {
      return false;
    }
    else return true;

  }

  comboValidator(control: { value: string; }) {
    return control.value != 'Seleccionar' ? null : { invalid: true };
  }

  calcularBBP(sostenible: boolean, help: boolean, valor_vivienda: number): number {
    if (help) {
      return 0;
    }

    if (valor_vivienda >= 65200 && valor_vivienda <= 93100) {
      return sostenible ? 31100 : 25700;
    }

    if (valor_vivienda > 93100 && valor_vivienda <= 139400) {
      return sostenible ? 26800 : 21400;
    }

    if (valor_vivienda > 139400 && valor_vivienda <= 232200) {
      return sostenible ? 25000 : 19600;
    }

    if (valor_vivienda > 232200 && valor_vivienda <= 343900) {
      return sostenible ? 16200 : 10800;
    }

    return 0;
  }

  crearDatosForm() {

    if (!this.DatosIniIngresados()) {
      return;
    }
    const seleccionado = this.myForm.get('entidad')?.value;

    const formu: Form = {

      form_id: 0,

      client_id: this.myForm.get('dniclient')!.value,
      currency: this.myForm.get('moneda')!.value,
      entity: seleccionado.name,

      price: this.myForm.get('price')!.value,
      initial: this.myForm.get('cuota_initial')!.value,
      sustainable: (this.myForm.get('sostenible')!.value == 'Si' ? true : false),
      help: (this.myForm.get('apoyo')!.value == 'Si' ? true : false),
      tea: this.myForm.get('tea')!.value,
      sinmAnual: this.myForm.get('seginm')!.value,
      sdegMensual: this.myForm.get('segdegra')!.value,
      time: this.myForm.get('plazo')!.value,
      gracePeriod: this.myForm.get('periodo_gracia')!.value,

      perInitial: 0,
      bbp: 0,
      montof: 0,
      tcea: 0,
      cuota: 0,
    }

    //Calcular el porcentaje de cuota inicial
    formu.perInitial = formu.initial / formu.price * 100;

    // Calcular el monto final del préstamo despues de aplicar el BBP y cuota inicial
    formu.bbp = this.calcularBBP(formu.sustainable, formu.help, formu.price)

    // Calcular el monto del prestamo
    formu.montof = formu.price - formu.bbp - formu.initial;

    // Calcular la tasa de interés efectiva mensual
    const tasa_efectiva_mensual = Math.pow((1 + formu.tea / 100),(30 / 360)) -1 ;

    // Calcular la tasa mensual + tasa seguro degravamen
    const tasa_mensual_mas_seguro = tasa_efectiva_mensual + formu.sdegMensual / 100
    // Calcular el valor del seguro del inmueble
    const valor_seg_inmu = formu.price * (formu.sinmAnual / 100) / 12

    // Calcular el pago periodico
    formu.cuota = (formu.montof * (tasa_mensual_mas_seguro*(Math.pow((1 + tasa_mensual_mas_seguro), formu.time))) / ((Math.pow((1 + tasa_mensual_mas_seguro), formu.time)) - 1)) + valor_seg_inmu;

    //Calcular tcea
    formu.tcea = formu.tea + 1.22;

    if (formu.initial !== null && formu.price !== null) { this.myForm.get('porc_cuotaini')?.setValue(formu.perInitial); }
   
    if (this.myForm.get('apoyo')?.invalid === false && this.myForm.get('sostenible')?.invalid===false) {
      this.myForm.get('bbp')?.setValue(formu.bbp);
    }

    this.myForm.get('monto_prestamo')?.setValue(formu.montof);

    if (formu.tea) {
    this.myForm.get('tcea')?.setValue(formu.tcea);
    }
    if (formu.time) {
      this.myForm.get('info')?.setValue('Cuota: ' + formu.cuota);
    }
    this.frm = formu;

  }
  saveForm() {
    this.crearDatosForm();
    this.serv.addForm(this.frm).subscribe({
      next: (data) => {
        console.log(data);
        this.snackBar.open('Se registro la proforma con exito!', '', {
          duration: 2000,
        });

      },
      error: (err) => {

        console.log(err);
        this.snackBar.open('Error al calcular los datos!', '', {
          duration: 2000,
        });

      },
    });



  }
}
