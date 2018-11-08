import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ClientUpdateModel, LoginModel, RegisterModel, TokenModel} from './app.component';
import {map} from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(loginM: LoginModel) {
    return this.http.post<any>('http://127.0.0.1:8080/warsztatZlomek/rest/authorization/signIn', loginM)
        .pipe(map( user => {
            if (user && user.accessToken) {
                localStorage.setItem('currentUser', JSON.stringify(user.accessToken.valueOf()));
            }
            return user;
        } ));
  }

  logoutEmployee() {
    const accessToken = document.cookie.valueOf().split('/; */')[0].split('=')[1];
    const tokenModel: TokenModel = {'accessToken': accessToken};
    document.cookie = 'warsztatZlomekEmployee=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    console.log(tokenModel);
     return this.http.post<any>('http://127.0.0.1:8080/warsztatZlomek/rest/authorization/signOutEmployee', tokenModel).subscribe(() => {
      console.log('success');
     },
       (error1 => {
         console.log(error1);
       }));
  }

  loginEmployee(loginM: LoginModel) {
    return this.http.post<any>('http://127.0.0.1:8080/warsztatZlomek/rest/authorization/signInEmployee', loginM)
      .pipe(map( user => {
        if (user && user.accessToken) {
          const date = new Date();
          date.setTime(date.getTime() + (20 * 60 * 1000));
          document.cookie = 'warsztatZlomekEmployee=' + user.accessToken.valueOf() + '; expires=' + date.toString();
        }
        console.log(user.accessToken);
        return user;
      } ));
  }

  logout() {
        localStorage.removeItem('currentUser');
    }

  register(registerM: RegisterModel) {
      return this.http.post<any>('http://127.0.0.1:8080/warsztatZlomek/rest/authorization/register', registerM)
          .pipe(map(user => {
              return user;
          }));
  }

  getAccountData(token: TokenModel) {
      return this.http.post<any>('http://127.0.0.1:8080/warsztatZlomek/rest/authorization/getFullClientData', token)
          .pipe(map(user => {
              localStorage.setItem('currentUser', JSON.stringify(user.accessToken.valueOf()));
              return user;
          }));
  }

  getCars(token: TokenModel) {
      return this.http.post<any>('http://127.0.0.1:8080/warsztatZlomek/rest/car/getAllClientsCars', token)
          .pipe(map(cars => {
              localStorage.setItem('currentUser', JSON.stringify(cars.accessToken.valueOf()));
              return cars;
          }));
  }

  updateClientData(client: ClientUpdateModel) {
      return this.http.post<any>('http://127.0.0.1:8080/warsztatZlomek/rest/updateClient/editClientData', client)
          .pipe(map( user => {
              localStorage.setItem('currentUser', JSON.stringify(user.accessToken.valueOf()));
              return user;
          }));
  }
}
