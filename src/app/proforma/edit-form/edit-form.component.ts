import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RowCrono, Form } from '../form.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { FormService } from '../form.service';
import { Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css']
})
export class EditFormComponent implements OnInit {
  vercrono: boolean = false;

  myForm !: FormGroup;
  id!: number;
  formu$!: Observable<Form>;
  frmAux!:Form;
  frm!:Form;

  saldo_inicial!: number;
  interes_pagado!: number;
  valor_seg_degra!: number;
  amortizacion!: number;
  saldo_final!: number;
  interes_plazo!: number;

  displayedColumns: string[] = ['period', 'saldoini', 'amortization', 'intereses', 'seguro_degr', 'seguro_inm', 'saldofini', 'cuota_mensual'];

  rowscrono: RowCrono[] = [];

  asesor: string = '';
  simbo: string = '';
  fecha: string = '';

  dataSource !: MatTableDataSource<RowCrono>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
      }
    );
    this.serv.getProformById(this.id).subscribe({
      next: (res) => {
        if (res) {
          this.frm =res;
          this.serv.proform$.next(this.frmAux);
          this.serv.proform = this.frmAux;
        }
        else {
          this.snackBar.open('No existe una proforma con este código', '', {
            duration: 2000,
          });
        }
      }
    });
  }

  constructor(private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private serv: FormService) {
      this.formu$ =  new Subject<Form>();
      this.formu$ = this.serv.proform$;
    this.reactiveForm();
    this.cargaDatos();
  }
  reactiveForm() {

    this.myForm = this.fb.group({
      dniclient: [''],
      moneda: ['Seleccionar',],
      entidad: ['Seleccionar'],

      price: ['',],
      cuota_initial: [''],
      apoyo: ['Seleccionar'],
      sostenible: ['Seleccionar'],
      tea: [''],
      segdegra: [''],
      seginm: [''],
      plazo: [''],
      tipo: ['Seleccionar'],
      periodo_gracia: [''],

      porc_cuotaini: [''],
      bbp: [''],
      monto_prestamo: [''],
      tcea: [''],
      info: ['']
    });
  }
  cargaDatos() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
      }
    );
    this.serv.getProformById(this.id).subscribe({
      next: (res) => {
        if (res) {

          this.myForm.get('dniclient')?.setValue(res.client_id);
          this.myForm.get('moneda')?.setValue(res.currency);
          this.simbo = res.currency.split(' ')[0];
          this.myForm.get('entidad')?.setValue(res.entity);
          this.asesor = res.asesor;
          this.fecha = res.fecha;

          this.myForm.get('price')?.setValue(res.price.toFixed(2));
          this.myForm.get('cuota_initial')?.setValue(res.initial.toFixed(2));
          this.myForm.get('apoyo')?.setValue((res.help ? 'Si' : 'No'));
          this.myForm.get('sostenible')?.setValue((res.sustainable ? 'Si' : 'No'));
          this.myForm.get('tea')?.setValue(res.tea.toFixed(2));
          this.myForm.get('segdegra')?.setValue(res.sdegMensual.toFixed(3));
          this.myForm.get('seginm')?.setValue(res.sinmAnual.toFixed(3));
          this.myForm.get('plazo')?.setValue(res.time);
          this.myForm.get('tipo')?.setValue(res.tipo);
          this.myForm.get('periodo_gracia')?.setValue(res.gracePeriod);


          this.myForm.get('porc_cuotaini')?.setValue(res.perInitial.toFixed(2));
          this.myForm.get('bbp')?.setValue(res.bbp.toFixed(2));
          this.myForm.get('monto_prestamo')?.setValue(res.montof.toFixed(3));
          this.myForm.get('tcea')?.setValue(res.tcea.toFixed(2));
          this.myForm.get('info')?.setValue('Cuota: ' + res.currency.split(' ')[0] + ' ' + res.cuota.toFixed(3));
        }
        else {
          this.snackBar.open('No existe una proforma con este código', '', {
            duration: 2000,
          });
        }
      }
    });
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
      this.saldo_inicial = this.saldo_final;
    }

    return datos;
  }

  verCronograma() {
    this.formu$.subscribe(res => {
        this.frm = res;
      }
    );
    console.log("form: " + this.frm.asesor);
    // Interes nominal anual
    const tasa_interes_nominal_anual = ((Math.pow((this.frm.tea / 100 + 1), (1 / 12)) - 1) * 12);

    // Calcular el valor del seguro del inmueble
    const valor_seg_inmu = this.frm.price * (this.frm.sinmAnual / 100) / 12

    // Asignar valor a saldo pendiente
    this.saldo_inicial = this.frm.montof;

    //Calcular interes pagado por periodo
    this.interes_pagado = this.frm.montof * tasa_interes_nominal_anual / 12;


    if (this.frm.tipo != 'Seleccionar' && this.frm.gracePeriod != 0) {
      if (this.frm.tipo == 'Total') {

        this.rowscrono = this.arrayWithTotalGracia(tasa_interes_nominal_anual, valor_seg_inmu);
      }
      else {
        this.rowscrono = this.arrayWithParcialGracia(tasa_interes_nominal_anual, valor_seg_inmu);
      }
    }
    else {
      this.rowscrono = this.arrayFlujoNormal(tasa_interes_nominal_anual, valor_seg_inmu);
    }

    this.dataSource = new MatTableDataSource<RowCrono>(this.rowscrono);
    this.dataSource.paginator = this.paginator;
    this.vercrono = true;

  }


}
