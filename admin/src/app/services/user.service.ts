import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../common/user';
import{map} from "rxjs/operators"
import { environment } from 'src/environments/environment';


const baseURL = environment.API_URL + "auth"

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private httpClient : HttpClient) { }

  getUserList(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${baseURL}/`);
  }

  getUser(id:any): Observable<any> {
    let _id = id.replace(/['"]+/g, '');
    return this.httpClient.get<User>(`${baseURL}/${_id}`);
  }

  approveUser(id:any): Observable<any> {
    let _id = id.replace(/['"]+/g, '');
    return this.httpClient.put(`${baseURL}/approve/${_id}`, { });
  }

  deleteUser(id:any): Observable<any> {
    let _id = id.replace(/['"]+/g, '');
    return this.httpClient.delete(`${baseURL}/${_id}`, { responseType: 'text' });
  }

  setSession(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getSession(key: string): any {
    if (typeof window !== 'undefined') {
        let retrievedObject = localStorage.getItem(key) as string;
        return retrievedObject;
    }
  }

  clearSession(): void {
    localStorage.clear();
  }

}
