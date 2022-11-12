import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Cookie} from 'ng2-cookies';
import {concatMap, Observable} from "rxjs";
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
    if (!Cookie.check("access_token")) {
      return false;
    } else {
      this.generateValidAccessToken();
      return true;
    }

  }

  logout() {
    Cookie.delete('access_token');
    Cookie.delete('refresh_token');
    Cookie.delete('aud');
    Cookie.delete('exp');
    Cookie.delete('sub');
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
          this.saveTokenDetails(data);
          return this.getTokenInfo(data.access_token);
        })
      )
      .subscribe({
        next: (tokenInfo: AccessTokenInfo) => {
          this.saveAccessTokenInfo(tokenInfo);
          window.location.href = 'http://localhost:4200';
        },
        error: err => {
          console.log(err);
          this.logout();
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

  generateValidAccessToken() {
    let exp: string = Cookie.get("exp");
    let currentTime: Date = new Date();
    if ((parseInt(exp) - (currentTime.getTime() / 1000)) < 10) {
      console.log("chutiya ban geya");
      this.getAccessTokenUsingRefreshToken(Cookie.get("refresh_token"))
        .pipe(
          concatMap<RefreshTokenInfo, Observable<AccessTokenInfo>>((data) => {
            this.saveTokenDetails(data);
            return this.getTokenInfo(data.access_token)
          })
        )
        .subscribe({
          next: (value) => {
            this.saveAccessTokenInfo(value);
          },
          error: err => {
            console.log(err);
            this.logout();
          }
        });
      console.log("shouvik hutiya----before---");
      console.log("shouvik hutiya----");
    }
  }

  private saveAccessTokenInfo(accessTokenInfo: AccessTokenInfo) {
    if (accessTokenInfo.aud != null) {
      Cookie.set("aud", accessTokenInfo.aud);
    }
    if (accessTokenInfo.exp != null) {
      Cookie.set("exp", accessTokenInfo.exp);
    }
    if (accessTokenInfo.sub != null) {
      Cookie.set("sub", accessTokenInfo.sub);
    }
  }

  private getTokenInfo(accessToken: string | undefined): Observable<AccessTokenInfo> {
    return this._http.get<AccessTokenInfo>(this.tokenInfoUri + accessToken);
  }

  private saveTokenDetails(accessToken: AccessToken) {
    if (accessToken.access_token != null) {
      Cookie.set("access_token", accessToken.access_token);
    }
    if (accessToken.refresh_token != null) {
      Cookie.set("refresh_token", accessToken.refresh_token);
    }
  }
}

