import { Component } from '@angular/core';
import { LoginServiceService } from './service/login-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public _loginService : LoginServiceService) {}

  ngOnInit() {
    this._loginService.isLoggedIn = this._loginService.checkCredentials();    
    let i = window.location.href.indexOf('code');
    if(!this._loginService.isLoggedIn && i != -1) {
      this._loginService.retrieveToken(window.location.href.substring(i + 5));
    }
  }
}
