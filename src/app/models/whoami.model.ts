export interface WhoamiResponse {
  username?: string;
  name?: string;
  surname?: string;
  role: string;
}

export class WhoamiModel {
  role: string;
  username: string;
  name?: string;
  surname?: string;

  constructor(auth: WhoamiResponse) {
    this.role = auth.role;
    this.username = auth.username;
    this.name = auth.name;
    this.surname = auth.surname;
  }

  getDataForStorage() {
    return {
      role: this.role,
      username: this.username,
      name: this.name,
      surname: this.surname,
    };
  }

}
