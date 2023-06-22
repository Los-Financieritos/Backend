import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  @Input() login!: boolean;
  @Input() id!: number;
  username !: string;

  ngOnInit() {
    if(this.id)
   {this.serv.getUserById(this.id).subscribe({
      next: (usuario) => {
        this.username = usuario.username;
      },
      error: (error) => {
        console.log(error);
      }
    })}
  }

  constructor(private serv: AuthService) {

  }
}
