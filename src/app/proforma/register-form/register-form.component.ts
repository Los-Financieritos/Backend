import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Form, RowCrono } from '../form.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { FormService } from '../form.service';
import { Entidad } from '../entidad.interface';
import { Observable } from 'rxjs';
import { ClientService } from 'src/app/client/client.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/auth.service';
import { Finance } from 'financejs'

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit, OnDestroy {

  asesor!: string;
  id!: number;

  vercrono: boolean = false;
  ningun_plazo: boolean = true;

  myForm !: FormGroup;
  frm!: Form;
  dataEntidades$!: Observable<Entidad[]>;
  entidades: Entidad[] = [];

  //Variables de min y max segun entidad
  c_inicial!: number;
  c_inicial_por!: number;
  c_initialmax!: number;

  t_min!: number;
  t_max!: number;

  mminimo!: number;
  mmaximo!: number;

  pminimo!: number;
  pmaximo!: number;

  //Variables de calculo
  todollar: number = 0.27384;

  saldo_inicial!: number;
  interes_pagado!: number;
  valor_seg_degra!: number;
  amortizacion!: number;
  saldo_final!: number;
  interes_plazo!: number;

  displayedColumns: string[] = ['period', 'saldoini', 'amortization', 'intereses', 'seguro_degr', 'seguro_inm', 'saldofini', 'cuota_mensual'];

  rowscrono: RowCrono[] = [];
  flujos: number[] = []
  van!: number;
  tir!: number;

  error: string = '';
  exist!: boolean | undefined;
  simbo: string = '';
  selectTipo: string = '';
  dataSource !: MatTableDataSource<RowCrono>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.serv.getEntidades().subscribe(
      {
        next: (res) => {
          this.entidades = res;
          this.serv.entidades$.next(this.entidades);
        }
      });


    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
      }
    );

    this.authserv.getUserById(this.id).subscribe({
      next: (usuario) => {
        this.asesor = usuario.name.split(' ')[0] + ' ' + usuario.lastname.split(' ')[0];
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  constructor(private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private serv: FormService,
    private clientService: ClientService,
    private authserv: AuthService) {

    this.dataEntidades$ = this.serv.entidades$;
    this.reactiveForm();
  }
  ngOnDestroy(): void {

    this.rowscrono = [];

  }

  setMinandMax() {
    const seleccionado = this.myForm.get('entidad')?.value;

    this.c_inicial_por = seleccionado.cinicial;

    this.t_min = seleccionado.tminimo;
    this.t_max = seleccionado.tmaximo;

    this.mminimo = seleccionado.mminimo;
    this.mmaximo = seleccionado.mmaximo;
    this.pminimo = seleccionado.pminimo;
    this.pmaximo = seleccionado.pmaximo;

  }

  reactiveForm() {

    this.myForm = this.fb.group({
      dniclient: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      moneda: ['Seleccionar', [Validators.required, this.comboValidator]],
      entidad: ['Seleccionar', [Validators.required, this.comboValidator]],

      price: ['', [Validators.required, Validators.pattern('^[0-9]+([.])?([0-9]+)?$')]],
      cuota_initial: ['', [Validators.required]],
      apoyo: ['Seleccionar', [Validators.required, this.comboValidator]],
      sostenible: ['Seleccionar', [Validators.required, this.comboValidator]],
      tea: ['', [Validators.required]],
      segdegra: ['', [Validators.required]],
      seginm: ['', [Validators.required]],
      plazo: ['', [Validators.required, Validators.pattern('^[0-9]+')]],
      tipo: ['Seleccionar', [Validators.required, this.comboValidator]],
      periodo_gracia: ['', [Validators.required, Validators.pattern('^[0-9]+')]],

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

  existClient() {

    const dni = this.myForm.get('dniclient')?.value;
    this.clientService.getClientById(dni).subscribe(
      {
        next: (res) => {

          if (res !== null && res.dni === dni) {
            this.exist = true;
            this.error = 'Cliente registrado.';
          }
          else {
            this.exist = false;
            this.error = 'No existe un cliente con este DNI';
          }

        }
      });



  }

  comboValidator(control: { value: string; }) {
    return control.value != 'Seleccionar' ? null : { invalid: true };
  }

  calcularBBP(sostenible: boolean, help: boolean, valor_vivienda: number): number {
    const moneda = (this.myForm.get('moneda')!.value.split(' ')[0] == '$' ? this.todollar : 1);
    if (help) {
      return 0;
    }

    if (valor_vivienda >= 65200*moneda && valor_vivienda <= 93100*moneda) {
      return sostenible ? 31100*moneda : 25700*moneda;
    }

    if (valor_vivienda > 93100*moneda && valor_vivienda <= 139400*moneda) {
      return sostenible ? 26800*moneda : 21400*moneda;
    }

    if (valor_vivienda > 139400*moneda && valor_vivienda <= 232200*moneda) {
      return sostenible ? 25000*moneda : 19600*moneda;
    }

    if (valor_vivienda > 232200*moneda && valor_vivienda <= 343900*moneda) {
      return sostenible ? 16200*moneda : 10800*moneda;
    }

    return 0;
  }

  crearDatosForm() {

    if (!this.DatosIniIngresados()) {
      return;
    }
    this.existClient();

    const seleccionado = this.myForm.get('entidad')?.value;
    const moneda = (this.myForm.get('moneda')!.value.split(' ')[0] == '$' ? this.todollar : 1);
    this.mminimo = seleccionado.mminimo * moneda;
    this.mmaximo = seleccionado.mmaximo * moneda;

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
      tipo: this.myForm.get('tipo')!.value,
      gracePeriod: this.myForm.get('periodo_gracia')!.value,

      perInitial: 0,
      bbp: 0,
      montof: 0,
      tcea: 0,
      cuota: 0,
      asesor: this.asesor,
      fecha: new Date().toISOString(),

    }

    this.simbo = this.myForm.get('moneda')!.value.split(' ')[0];

    this.c_inicial = formu.price * (seleccionado.cinicial / 100);
    this.c_initialmax = formu.price * (0.3);

    //Calcular el porcentaje de cuota inicial
    formu.perInitial = formu.initial / formu.price * 100;

    // Calcular el monto final del préstamo despues de aplicar el BBP y cuota inicial
    formu.bbp = this.calcularBBP(formu.sustainable, formu.help, formu.price)

    // Calcular el monto del prestamo
    formu.montof = formu.price - formu.bbp - formu.initial;

    // Calcular la tasa de interés efectiva mensual
    const tasa_efectiva_mensual = Math.pow((1 + formu.tea / 100), (30 / 360)) - 1;

    // Calcular la tasa mensual + tasa seguro degravamen
    const tasa_mensual_mas_seguro = tasa_efectiva_mensual + formu.sdegMensual / 100

    // Calcular el valor del seguro del inmueble
    const valor_seg_inmu = formu.price * (formu.sinmAnual / 100) / 12;



    // Interes nominal anual
    const tasa_interes_nominal_anual = ((Math.pow((formu.tea / 100 + 1), (1 / 12)) - 1) * 12);


    // Asignar valor a saldo pendiente
    this.saldo_inicial = formu.montof;

    //Calcular tcea
    formu.tcea = formu.tea + 13.18 * formu.sdegMensual + 2.15 * formu.sinmAnual;

    if (formu.tipo != 'Seleccionar') {
      if (formu.tipo == 'Total') {
        this.ningun_plazo = false;
        for (let i = 0; i < formu.gracePeriod; i++) {
          // Se calcula el seguro_degravamen por cada periodo
          this.valor_seg_degra = this.saldo_inicial * this.frm.sdegMensual / 100;

          // Se calcula el interes pagado por cada periodo
          this.interes_pagado = this.saldo_inicial * tasa_interes_nominal_anual / 12;

          this.interes_plazo = this.interes_pagado + this.valor_seg_degra + valor_seg_inmu;
          this.saldo_inicial = this.saldo_inicial + this.interes_plazo;

        }

        const new_time = formu.time - formu.gracePeriod;

        // Calcular el pago periodico
        formu.cuota = (this.saldo_inicial * (tasa_mensual_mas_seguro * (Math.pow((1 + tasa_mensual_mas_seguro), new_time))) / ((Math.pow((1 + tasa_mensual_mas_seguro), new_time)) - 1)) + valor_seg_inmu;

      }
      else if (formu.tipo == 'Parcial') {
        this.ningun_plazo = false;
        const new_time = formu.time - formu.gracePeriod;

        // Calcular el pago periodico
        formu.cuota = (this.saldo_inicial * (tasa_mensual_mas_seguro * (Math.pow((1 + tasa_mensual_mas_seguro), new_time))) / ((Math.pow((1 + tasa_mensual_mas_seguro), new_time)) - 1)) + valor_seg_inmu;
      }
      else if (formu.tipo == 'Ninguno') {

        if (formu.gracePeriod != 0) formu.gracePeriod = 0;
        this.ningun_plazo = true;
        this.myForm.get('periodo_gracia')?.setValue(0);

        // Calcular el pago periodico
        formu.cuota = (formu.montof * (tasa_mensual_mas_seguro * (Math.pow((1 + tasa_mensual_mas_seguro), formu.time))) / ((Math.pow((1 + tasa_mensual_mas_seguro), formu.time)) - 1)) + valor_seg_inmu;
      }
    }

    //Publicar los datos en el formulario

    if (formu.initial !== null && formu.price !== null) { this.myForm.get('porc_cuotaini')?.setValue(formu.perInitial.toFixed(3)); }

    if (this.myForm.get('apoyo')?.invalid === false && this.myForm.get('sostenible')?.invalid === false) {
      this.myForm.get('bbp')?.setValue(formu.bbp.toFixed(3));
    }

    this.myForm.get('monto_prestamo')?.setValue(formu.montof.toFixed(2));

    if (formu.tea) {
      this.myForm.get('tcea')?.setValue(formu.tcea.toFixed(2));
    }
    if (formu.time) {
      this.myForm.get('info')?.setValue('Cuota: ' + formu.currency.split(' ')[0] + ' ' + formu.cuota.toFixed(3));
    }

    this.frm = formu;

  }
  arrayFlujoNormal(tasa_interes_nominal_anual: number, valor_seg_inmu: number): RowCrono[] {
    const datos: RowCrono[] = [];

    for (let i = 0; i < this.frm.time; i++) {

      // Se calcula el seguro_degravamen por cada periodo
      this.valor_seg_degra = this.saldo_inicial * this.frm.sdegMensual / 100;

      // Se calcula el interes pagado por cada periodo
      this.interes_pagado = this.saldo_inicial * tasa_interes_nominal_anual / 12;

      // Se calcula la amortizacion
      this.amortizacion = this.frm.cuota - this.interes_pagado - this.valor_seg_degra - valor_seg_inmu;

      //Saldo final
      this.saldo_final = this.saldo_inicial - this.amortizacion;


      const row: RowCrono = {
        position: i,
        period: i + 1,
        saldoini: this.saldo_inicial.toFixed(2),
        amortization: this.amortizacion.toFixed(2),
        intereses: this.interes_pagado.toFixed(3),
        seguro_degr: this.valor_seg_degra.toFixed(2),
        seguro_inm: valor_seg_inmu.toFixed(2),
        saldofini: this.saldo_final.toFixed(2),
        cuota_mensual: this.frm.cuota.toFixed(3)
      }

      datos.push(row);
      this.flujos.push(this.frm.cuota);
      this.saldo_inicial = this.saldo_inicial - this.amortizacion;
    }
    return datos;
  }
  arrayWithTotalGracia(tasa_interes_nominal_anual: number, valor_seg_inmu: number): RowCrono[] {

    const datos: RowCrono[] = [];
    //Meses de plazo de gracia
    for (let i = 0; i < this.frm.gracePeriod; i++) {

      // Se calcula el seguro_degravamen por cada periodo
      this.valor_seg_degra = this.saldo_inicial * this.frm.sdegMensual / 100;

      // Se calcula el interes pagado por cada periodo
      this.interes_pagado = this.saldo_inicial * tasa_interes_nominal_anual / 12;

      this.interes_plazo = this.interes_pagado + this.valor_seg_degra + valor_seg_inmu;

      this.saldo_final = this.saldo_inicial + this.interes_plazo;


      const row: RowCrono = {
        position: i,
        period: i + 1,
        saldoini: this.saldo_inicial.toFixed(2),
        amortization: '0.00',
        intereses: this.interes_pagado.toFixed(3),
        seguro_degr: this.valor_seg_degra.toFixed(2),
        seguro_inm: valor_seg_inmu.toFixed(3),
        saldofini: this.saldo_final.toFixed(2),
        cuota_mensual: '0.00'
      }

      datos.push(row);
      this.flujos.push(this.frm.cuota);
      this.saldo_inicial = this.saldo_final;
    }
    //Meses de plazo normal
    for (let i = this.frm.gracePeriod; i < this.frm.time; i++) {

      // Se calcula el seguro_degravamen por cada periodo
      this.valor_seg_degra = this.saldo_inicial * this.frm.sdegMensual / 100;

      // Se calcula el interes pagado por cada periodo
      this.interes_pagado = this.saldo_inicial * tasa_interes_nominal_anual / 12;

      // Se calcula la amortizacion
      this.amortizacion = this.frm.cuota - this.interes_pagado - this.valor_seg_degra - valor_seg_inmu;

      //Saldo final
      this.saldo_final = this.saldo_inicial - this.amortizacion;


      const row: RowCrono = {
        position: i,
        period: i + 1,
        saldoini: this.saldo_inicial.toFixed(2),
        amortization: this.amortizacion.toFixed(2),
        intereses: this.interes_pagado.toFixed(3),
        seguro_degr: this.valor_seg_degra.toFixed(2),
        seguro_inm: valor_seg_inmu.toFixed(2),
        saldofini: this.saldo_final.toFixed(2),
        cuota_mensual: this.frm.cuota.toFixed(3)
      }

      datos.push(row);
      this.flujos.push(this.frm.cuota);
      this.saldo_inicial = this.saldo_final;
    }

    return datos;
  }
  arrayWithParcialGracia(tasa_interes_nominal_anual: number, valor_seg_inmu: number): RowCrono[] {
    const datos: RowCrono[] = [];
    //Meses de plazo de gracia
    for (let i = 0; i < this.frm.gracePeriod; i++) {

      // Se calcula el seguro_degravamen por cada periodo
      this.valor_seg_degra = this.saldo_inicial * this.frm.sdegMensual / 100;

      // Se calcula el interes pagado por cada periodo
      this.interes_pagado = this.saldo_inicial * tasa_interes_nominal_anual / 12;

      this.interes_plazo = this.interes_pagado + this.valor_seg_degra + valor_seg_inmu;

      const row: RowCrono = {
        position: i,
        period: i + 1,
        saldoini: this.saldo_inicial.toFixed(2),
        amortization: '0.00',
        intereses: this.interes_pagado.toFixed(3),
        seguro_degr: this.valor_seg_degra.toFixed(2),
        seguro_inm: valor_seg_inmu.toFixed(2),
        saldofini: this.saldo_inicial.toFixed(2),
        cuota_mensual: this.interes_plazo.toFixed(3)
      }

      datos.push(row);
      this.flujos.push(this.frm.cuota);
    }
    //Meses de plazo normal
    for (let i = this.frm.gracePeriod; i < this.frm.time; i++) {

      // Se calcula el seguro_degravamen por cada periodo
      this.valor_seg_degra = this.saldo_inicial * this.frm.sdegMensual / 100;

      // Se calcula el interes pagado por cada periodo
      this.interes_pagado = this.saldo_inicial * tasa_interes_nominal_anual / 12;

      // Se calcula la amortizacion
      this.amortizacion = this.frm.cuota - this.interes_pagado - this.valor_seg_degra - valor_seg_inmu;

      //Saldo final
      this.saldo_final = this.saldo_inicial - this.amortizacion;


      const row: RowCrono = {
        position: i,
        period: i + 1,
        saldoini: this.saldo_inicial.toFixed(2),
        amortization: this.amortizacion.toFixed(2),
        intereses: this.interes_pagado.toFixed(3),
        seguro_degr: this.valor_seg_degra.toFixed(2),
        seguro_inm: valor_seg_inmu.toFixed(2),
        saldofini: this.saldo_final.toFixed(2),
        cuota_mensual: this.frm.cuota.toFixed(3)
      }

      datos.push(row);
      this.flujos.push(this.frm.cuota);
      this.saldo_inicial = this.saldo_final;
    }

    return datos;
  }
  arrayCronograma() {
    if (!this.myForm.invalid) {
      // Interes nominal anual
      const tasa_interes_nominal_anual = ((Math.pow((this.frm.tea / 100 + 1), (1 / 12)) - 1) * 12);

      // Calcular el valor del seguro del inmueble
      const valor_seg_inmu = this.frm.price * (this.frm.sinmAnual / 100) / 12

      // Asignar valor a saldo pendiente
      this.saldo_inicial = this.frm.montof;

      //Calcular interes pagado por periodo
      this.interes_pagado = this.frm.montof * tasa_interes_nominal_anual / 12;


      let finance = new Finance();

      if (this.frm.tipo != 'Seleccionar') {
        this.selectTipo = '';
        if (this.frm.tipo == 'Total') {

          this.rowscrono = this.arrayWithTotalGracia(tasa_interes_nominal_anual, valor_seg_inmu);
        }
        else if (this.frm.tipo == 'Parcial') {
          this.rowscrono = this.arrayWithParcialGracia(tasa_interes_nominal_anual, valor_seg_inmu);
        }
        else if (this.frm.tipo == 'Ninguno') {
          this.rowscrono = this.arrayFlujoNormal(tasa_interes_nominal_anual, valor_seg_inmu);
        }
      }
      else {
        this.selectTipo = 'Es obligatorio que seleccione una opción';
      }

      // e.g., If initial investment is -$500,000 and the cash flows are $200,000, $300,000, and $200,000, IRR is 18.82%.
      this.tir = finance.IRR(-this.frm.montof, ...this.flujos);
      this.van = finance.NPV(this.tir, -this.frm.montof, ...this.flujos);
      //=> 18.82
      this.dataSource = new MatTableDataSource<RowCrono>(this.rowscrono);
      this.dataSource.paginator = this.paginator;
    }
  }

  verCronograma() {
    if (this.frm) {
      this.arrayCronograma();
      this.vercrono = true;
    }
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
