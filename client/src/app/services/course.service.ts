import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../common/course';
import{map} from "rxjs/operators"
import { environment } from 'src/environments/environment';


const baseURL = environment.API_URL + "course"

@Injectable({
  providedIn: 'root'
})
export class CourseService {


  constructor(private httpClient : HttpClient) { }

  getCourseList(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(`${baseURL}/`);
  }

  getMyCourseList(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(`${baseURL}/mylist`);
  }

  createCourse(course: Course): Observable<Course> {
    return this.httpClient.post<Course>(`${baseURL}/`, course);
  }

  updateCourse(id:any, course: Course): Observable<Object> {
    let _id = id.replace(/['"]+/g, '');
    return this.httpClient.put(`${baseURL}/${_id}`, course);
  }

  getCourse(id:any): Observable<any> {
    let _id = id.replace(/['"]+/g, '');
    return this.httpClient.get<Course>(`${baseURL}/${_id}`);
  }

  deleteCourse(id:any): Observable<any> {
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
