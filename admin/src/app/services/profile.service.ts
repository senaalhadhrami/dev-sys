import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../common/profile';
import{map} from "rxjs/operators"
import { environment } from 'src/environments/environment';


const baseURL = environment.API_URL + "profile"

@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  constructor(private httpClient : HttpClient) { }

  getProfile(): Observable<Profile> {
    return this.httpClient.get<Profile>(`${baseURL}/`);
  }

  getMyProfileList(): Observable<Profile[]> {
    return this.httpClient.get<Profile[]>(`${baseURL}/mylist`);
  }

  createProfile(profile: Profile): Observable<Profile> {
    return this.httpClient.post<Profile>(`${baseURL}/`, profile);
  }

  registerCourse(id: any): Observable<any> {
    let _id = id.replace(/['"]+/g, '');
    return this.httpClient.post<any>(`${baseURL}/register`, {'id':_id});
  }

  dropCourse(id: any): Observable<any> {
    let _id = id.replace(/['"]+/g, '');
    return this.httpClient.post<any>(`${baseURL}/drop`, {id:_id});
  }

  updateProfile(id, profile: Profile): Observable<Object> {
    let _id = id.replace(/['"]+/g, '');
    return this.httpClient.put(`${baseURL}/${_id}`, profile);
  }

  getProfiles(id): Observable<any> {
    let _id = id.replace(/['"]+/g, '');
    return this.httpClient.get<Profile>(`${baseURL}/${_id}`);
  }

  deleteProfile(id): Observable<any> {
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
