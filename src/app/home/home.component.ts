import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../service/login-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _loginService: LoginServiceService) { }

  ngOnInit(): void {
  }

  logout() {
      this._loginService.logout();
    }

}
