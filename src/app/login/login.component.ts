import {Component, OnInit} from '@angular/core';
import {LoginServiceService} from '../service/login-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _loginService: LoginServiceService) {
  }

  ngOnInit(): void {
  }

  login() {
    this._loginService.login();
  }

}
