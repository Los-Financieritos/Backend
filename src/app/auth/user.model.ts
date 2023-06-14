export interface User {
  id: number,
  name: string,
  lastname: string,
  company: string,
  username: string,
  email: string,
  password: string

}

export interface Credentials {
  email: string;
  password: string;
}