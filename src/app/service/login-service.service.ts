import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Cookie} from 'ng2-cookies';
import {concatMap, Observable, pipe, tap} from "rxjs";
import {AccessToken, AccessTokenInfo, RefreshTokenInfo} from "./pojo";

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  public isLoggedIn: boolean = false;

  public clientId: string = "560230099999-f5h6trsojqho5kt9jf8qfvd64latk3uu.apps.googleusercontent.com";
  public clientSecret: string = "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";
  public redirectUri: string = "http://localhost:4200";
  public tokenInfoUri: string = "https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=";

  constructor(private _http: HttpClient) {
  }

  login() {
    window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?response_type=code" +
      "&client_id=" + this.clientId +
      "&redirect_uri=" + this.redirectUri +
      "&prompt=consent" +
      "&access_type=offline" +
      "&scope=https://www.googleapis.com/auth/drive" +
      "+https://www.googleapis.com/auth/userinfo.profile";
  }

  checkCredentials() {
    return Cookie.check('access_token');
  }

  logout() {
    Cookie.delete('access_token');
    Cookie.delete('refresh_token');
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
      new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded'});

    this._http.post<AccessToken>('https://oauth2.googleapis.com/token',
      params.toString(), {headers: headers})
      .pipe(
        concatMap<AccessToken, Observable<AccessTokenInfo>>((data) => {
          return this.saveTokenAndExtractTokenInfo(data);
        })
      )
      .subscribe({
        next: (tokenInfo: AccessTokenInfo) => {
          this.saveAccessTokenInfo(tokenInfo);
          window.location.href = 'http://localhost:4200';
        },
        error: err => {
          console.log(err)
        }
      });
  }

  private getAccessTokenUsingRefreshToken(refreshToken: string): Observable<RefreshTokenInfo> {
    let params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);
    params.append('refresh_token', refreshToken);
    return this._http.post<RefreshTokenInfo>('https://www.googleapis.com/oauth2/v4/token',
      params.toString);
  }

  getValidAccessToken(): string {
    let exp: string = Cookie.get("exp");
    let currentTime: Date = new Date();
    if (+exp - currentTime.getTime() > 10) {
      return Cookie.get("access_token")
    } else {
      let flag: boolean = true;
      let access_token: string | undefined = "";
      this.getAccessTokenUsingRefreshToken(Cookie.get("refresh_token"))
        .subscribe({
          next: (value: RefreshTokenInfo) => {
            flag = false;
            access_token = value.access_token;
          },
          error: err => console.log(err)
        });
      while (flag) ;
      return access_token;
    }
  }

  private saveAccessTokenInfo(tokenInfo: AccessTokenInfo) {
    if (tokenInfo.aud != null) {
      Cookie.set("aud", tokenInfo.aud);
    }
    if (tokenInfo.exp != null) {
      Cookie.set("exp", tokenInfo.exp);
    }
    if (tokenInfo.sub != null) {
      Cookie.set("sub", tokenInfo.sub);
    }
  }

  private saveTokenAndExtractTokenInfo(data: AccessToken): Observable<AccessToken> {
    this.saveTokenDetails(data);
    return this._http.get<AccessTokenInfo>(this.tokenInfoUri + data.access_token);
  }

  private saveTokenDetails(token: AccessToken) {
    if (token.access_token != null) {
      Cookie.set("access_token", token.access_token);
    }
    if (token.refresh_token != null) {
      Cookie.set("refresh_token", token.refresh_token);
    }
    console.log('Obtained Access token');
    console.log("Shouvik-----")
    this.tokenInfoUri = this.tokenInfoUri + token.access_token;
    console.log(this.tokenInfoUri);
    console.log(token);
  }
}

