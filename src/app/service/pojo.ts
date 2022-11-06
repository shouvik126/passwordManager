export class AccessToken {
  access_token?: string;
  scope?: string;
  token_type?: string;
  expires_in?: string;
  refresh_token?: string;
}

export class AccessTokenInfo {
  azp?: string;
  aud?: string;
  scope?: string;
  exp?: string;
  expires_in?: string;
  access_type?: string;
  sub?: string;
}

export class RefreshTokenInfo {
  access_token?: string;
  expires_in?: string;
  scope?: string;
  token_type?: string;
  id_token?: string;
}
