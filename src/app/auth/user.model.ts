export interface User {
  id: number,
  name: string,
  lastname: string,
  company: string,
  username: string,
  email: string,
  password: string

}
export class CredentialsUser {
  constructor(
    public email: string,
    public id: number,
    public password: string,
    private _token: string,
  ) { }

  get token() {
   
    return this._token;
  }
}
export interface Credentials {
  email: string;
  password: string;
}
export interface Login {
  access_token: string;
}