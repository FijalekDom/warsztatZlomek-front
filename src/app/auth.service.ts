import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ClientUpdateModel, LoginModel, RegisterModel, TokenModel} from './app.component';
import {map} from 'rxjs/internal/operators';

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
}
