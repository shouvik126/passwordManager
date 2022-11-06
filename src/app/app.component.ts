import { Component } from '@angular/core';
import { LoginServiceService } from './service/login-service.service';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public _loginService : LoginServiceService, private _http: HttpClient) {}

  ngOnInit() {
    this._loginService.isLoggedIn = this._loginService.checkCredentials();
    let i = window.location.href.indexOf('code');
    if(!this._loginService.isLoggedIn && i != -1) {
      this._loginService.retrieveToken(window.location.href.substring(i + 5));
    }
    // this._http.get("https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=ya29.a0Aa4xrXNYnQbJ6T_Af22-YXqkyRFnDsPJmmXs5DnEpZxowMs1pJacIVm6_lStcwSiu0phw11xi3-q2an2r8U7KR0bfEeGlA5j9mnIDfEifjZphVx_0XWigExSEtBjShuuwL4eZ5AMCKs3KL82qKu3EKwus3LnaCgYKATASARASFQEjDvL9yXUiAOsgM0ihYPeSaQCASw0163")
    //   .subscribe({
    //     next: value => {
    //       console.log("yoyo+++++++");
    //       console.log(value);
    //     },
    //     error: err => {console.log(err)}
    //   });
  }
}
