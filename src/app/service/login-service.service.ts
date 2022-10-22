import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cookie } from 'ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  public isLoggedIn: boolean = false;

  public clientId: string = "560230099999-f5h6trsojqho5kt9jf8qfvd64latk3uu.apps.googleusercontent.com";
  public clientSecret: string = "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";
  public redirectUri: string = "http://localhost:4200";

  constructor(private _http: HttpClient) { }

  login() {
    window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?response_type=code" +
      "&client_id=" + this.clientId +
      "&redirect_uri=" + this.redirectUri +
      "&prompt=consent" +
      "&access_type=offline" +
      "&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.appdata+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.metadata+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.metadata.readonly+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.photos.readonly+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.readonly+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.scripts";
  }

  checkCredentials() {
    return Cookie.check('access_token');
  }

  logout() {
    Cookie.delete('access_token');
    window.location.reload();
  }

  retrieveToken(code: string) {
    let params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', this.clientId);
    params.append('redirect_uri', this.redirectUri);
    params.append('client_secret', this.clientSecret);
    params.append('code', code);

    let headers =
      new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded' });

    this._http.post('https://oauth2.googleapis.com/token',
      params.toString(), { headers: headers })
      .subscribe({
        next: data => this.saveToken(data),
        error: err => alert('Invalid Credentials')
      });
  }

  saveToken(token: any) {
    //var expireDate = new Date().getTime() + (1000 * token.expires_in);
    //Cookie.set("access_token", token.access_token, expireDate);
    Cookie.set("access_token", token.access_token);
    console.log('Obtained Access token');
    window.location.href = 'http://localhost:4200';
  }
}
