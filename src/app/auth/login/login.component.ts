import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Login } from 'src/app/shared/models/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userLogin:Login={
    email:'',
    password:'',
  };

  invalidLogin:boolean;

  constructor(private authService:AuthenticationService) { }

  ngOnInit() {

  }

  login() {
    this.authService.login(this.userLogin).subscribe(
      (response) => {
        if (response) {
        } 
      },
      (err: any) => {
        this.invalidLogin = true;
      }
    );
  }

}
