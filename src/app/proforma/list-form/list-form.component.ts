import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormService } from '../form.service';
import { Form } from '../form.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.css']
})

export class ListFormComponent implements OnInit {
  
  dataProform$!: Observable<Form[]>;
  dataSource !: MatTableDataSource<Form>;
  datos: Form[] = [];

  displayedColumns: string[] = ['cod', 'dni', 'ase', 'fec', 'prec', 'deta'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
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
    
    this.dataProform$.subscribe(res =>{
      this.datos = res;
      this.dataSource = new MatTableDataSource<Form>(this.datos);
      this.dataSource.paginator = this.paginator;
    });
    
   
  }
}
