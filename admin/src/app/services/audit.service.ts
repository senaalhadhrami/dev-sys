import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Audit } from '../common/audit';
import{map} from "rxjs/operators"
import { environment } from 'src/environments/environment';


const baseURL = environment.API_URL + "audit"

@Injectable({
  providedIn: 'root'
})
export class AuditService {


  constructor(private httpClient : HttpClient) { }

  getAuditList(): Observable<Audit[]> {
    return this.httpClient.get<Audit[]>(`${baseURL}/`);
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
