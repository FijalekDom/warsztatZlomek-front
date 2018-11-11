import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  BanUser,
  ClientUpdateModel,
  LoginModel,
  RegisterEmployeeModel,
  RegisterModel,
  RemoveEmployeeModel,
  TokenModel
} from './app.component';
import {map} from 'rxjs/internal/operators';
import {v} from '@angular/core/src/render3';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) {
    }

    login(loginM: LoginModel) {
        return this.http.post<any>('http://127.0.0.1:8080/warsztatZlomek/rest/authorization/signIn', loginM)
            .pipe(map(user => {
                if (user && user.accessToken) {
                    localStorage.setItem('currentUser', JSON.stringify(user.accessToken.valueOf()));
                }
                return user;
            }));
    }


  logoutEmployee() {
    const accessToken = this.getAccessToken();
    const tokenModel: TokenModel = {'accessToken': accessToken};
    localStorage.removeItem('warsztatZlomekEmployee');
     return this.http.post<any>('http://127.0.0.1:8080/warsztatZlomek/rest/authorization/signOutEmployee', tokenModel).subscribe(() => {

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
          localStorage.setItem('warsztatZlomekEmployee', user.accessToken.valueOf() + ';' + date.toString()) ;
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
            .pipe(map(user => {
                localStorage.setItem('currentUser', JSON.stringify(user.accessToken.valueOf()));
                return user;
            }));
    }

    deleteUser(token: TokenModel) {
        return this.http.post<any>('http://127.0.0.1:8080/warsztatZlomek/rest/authorization/deleteAccount', token)
            .pipe(map(user => {
                return user;
            }));
    }

    getAllClientVisits(token: TokenModel) {
        return this.http.post<any>('http://127.0.0.1:8080/warsztatZlomek/rest/visits/getAllClientsVisits', token)
            .pipe(map( visits => {
                localStorage.setItem('currentUser', JSON.stringify(visits.accessToken.valueOf()));
                return visits;
            }));
    }

    registerEmployee(registerEmployeeModel: RegisterEmployeeModel) {
      if (registerEmployeeModel.accessToken == null) {
        return;
      }
      return this.http.post<any>('http://127.0.0.1:8080/warsztatZlomek/rest/authorization/registerEmployee',
        registerEmployeeModel).subscribe(
        () => {
          console.log('sukces');
        },
        (data) => {
          console.log(data);
        }
      );
    }

  removeEmployee(removeEmployeeModel: RemoveEmployeeModel) {
    if (removeEmployeeModel.accessToken == null) {
      return;
    }
    return this.http.post<any>('http://127.0.0.1:8080/warsztatZlomek/rest/authorization/removeEmployee',
      removeEmployeeModel).subscribe(
      (data) => {
        console.log(data);
      },
      (data) => {
        console.log(data);
      }
    );
  }

    getAccessToken() {
      const value = localStorage.getItem('warsztatZlomekEmployee');
      if (value == null) {
        return null;
      }
      const values = value.split(';');
      if (new Date().valueOf() < new Date(values[1]).valueOf()) {
        return values[0];
      } else {
        localStorage.removeItem('warsztatZlomekEmployee');
        return null;
      }
    }

    banUserRequest(form: BanUser) {
      if (form.accessToken == null) {
        return;
      }
      return this.http.post<any>('http://127.0.0.1:8080/warsztatZlomek/rest/authorization/banUser', form).subscribe(
        (data) => {
          console.log(data);
        },
        (data) => {
          console.log(data);
        }
      );
    }
}
