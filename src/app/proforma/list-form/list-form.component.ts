import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormService } from '../form.service';
import { Form } from '../form.interface';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.css']
})

export class ListFormComponent implements OnInit {
  
  dataProform$!: Observable<Form[]>;

 
  ngOnInit() {
    this.serv.getProforms().subscribe(
      {
        next: (res) => {;
          this.serv.proforms$.next(res);
        }
      });

  }

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private serv: FormService) {

    this.dataProform$ = this.serv.proforms$;

  }
}
