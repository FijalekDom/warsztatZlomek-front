import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoginModel} from './app.component';
import {map} from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(loginM: LoginModel) {
    return this.http.post<any>('http://127.0.0.1:8080/warsztatZlomek/rest/authorization/signInEmployee', loginM)
        .pipe(map( user => {
            if (user && user.accessToken) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            }
            console.log(user.accessToken);
            return user;
        } ));
  }

    logout() {
        localStorage.removeItem('currentUser');
    }
}
