import { Component, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { FormService } from '../form.service';
import { Form } from '../form.interface';

@Component({
  selector: 'app-cronogram',
  templateUrl: './cronogram.component.html',
  styleUrls: ['./cronogram.component.css']
})
export class CronogramComponent{

  @Input() form!: Form;
  frm!: Form;
  constructor( private router: Router,
    private serv: FormService) {
      this.frm = this.form;
      console.log("frm: " + this.frm);
      console.log("form: " + this.form);
  }


}
