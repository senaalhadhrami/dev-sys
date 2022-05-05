import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../common/department';
import{map} from "rxjs/operators"
import { environment } from 'src/environments/environment';


const baseURL = environment.API_URL + "department"

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {


  constructor(private httpClient : HttpClient) { }

  getDepartmentList(): Observable<Department[]> {
    return this.httpClient.get<Department[]>(`${baseURL}/`);
  }

  createDepartment(department: Department): Observable<Department> {
    return this.httpClient.post<Department>(`${baseURL}/`, department);
  }

  updateDepartment(id, department: Department): Observable<Object> {
    let _id = id.replace(/['"]+/g, '');
    return this.httpClient.put(`${baseURL}/${_id}`, department);
  }

  getDepartments(id): Observable<any> {
    let _id = id.replace(/['"]+/g, '');
    return this.httpClient.get<Department>(`${baseURL}/${_id}`);
  }

  deleteDepartment(id): Observable<any> {
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
