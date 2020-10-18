import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface User {
  username: string;
  name: string;
  surname: string;
  role: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  getRoles(){
    return this.http.get<string[]>(environment.apiBaseUrl + '/roles');
  }

  getUsers(){
    return this.http.get<User[]>(environment.apiBaseUrl + '/users');
  }

  deleteUser(username: string){
    return this.http.delete(environment.apiBaseUrl + '/users/' + username, );
  }

  addUser(user: User){
    return this.http.put(environment.apiBaseUrl + '/users', user);
  }

}
