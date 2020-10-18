export interface AuthResponse {
  access_token: string;
  valid: boolean;
}

export class AuthModel {
  access_token: string;
  valid: boolean;

  constructor(auth: AuthResponse) {
    this.access_token = auth.access_token;
    this.valid = auth.valid;
  }

  getDataForStorage() {
    return {
      access_token: this.access_token,
      valid : this.valid
    };
  }
}
