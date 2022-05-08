import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exam } from '../common/exam';
import{map} from "rxjs/operators"
import { environment } from 'src/environments/environment';

const baseURL = environment.API_URL + "exam"

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  constructor(private httpClient : HttpClient) { }

  getExamList(): Observable<Exam[]> {
    return this.httpClient.get<Exam[]>(`${baseURL}/`);
  }

  getMyExamList(): Observable<Exam[]> {
    return this.httpClient.get<Exam[]>(`${baseURL}/myexams`);
  }

  createExam(exam: Exam): Observable<Exam> {
    return this.httpClient.post<Exam>(`${baseURL}/`, exam);
  }

  updateExam(id:any, exam: Exam): Observable<Object> {
    let _id = id.replace(/['"]+/g, '');
    return this.httpClient.put(`${baseURL}/${_id}`, exam);
  }

  getExam(id:any): Observable<any> {
    let _id = id.replace(/['"]+/g, '');
    return this.httpClient.get<Exam>(`${baseURL}/${_id}`);
  }

  getExams(id:any): Observable<any> {
    let _id = id.replace(/['"]+/g, '');
    return this.httpClient.get<Exam>(`${baseURL}/course/${_id}`);
  }

  deleteExam(id:any): Observable<any> {
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
