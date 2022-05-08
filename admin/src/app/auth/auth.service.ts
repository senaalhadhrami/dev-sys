import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Auth } from './auth';
import { Subject } from "rxjs";
import { NotificationServiceService } from '../services/notification-service.service';

const baseURL = environment.API_URL + 'auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private userId: string;
  private tokenTimer: any; //to clear timer on logout and clear token data
  private authStatusListener = new Subject<boolean>(); // to push authentation informmation to commponents/ boolean authenticated/or not

  constructor(private notificationService:NotificationServiceService, private http: HttpClient, private router: Router ) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable(); // so we emit from within the service, and listen fromm other parts of app
  }


  login(email: string, password: string) {
    const authData: Auth = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number, role:string, email:string, active:string }>(
        `${baseURL}/login`,
        authData
      )
      .subscribe(response => {
        console.log(response.role);
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true); // broadcast the user authenticated
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          //console.log(expirationDate);
          this.saveAuthData(token, expirationDate, response.role, response.email, response.active);
          this.router.navigate(["/"]); // redirect users home after login
        }else{
          this.notificationService.warn('wrong credentials');
          this.router.navigate(["/unauthorized"]);
        }
      });
  }

  // check if token available
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/login"]);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, role:string, email:string, active:string) {
    localStorage.setItem("token", token); // save token to stay logged in on page refresh
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("role", role);
    localStorage.setItem("email", email);
    localStorage.setItem("active", active);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  public getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const role = localStorage.getItem("role");
    const active = localStorage.getItem("active");
    const email = localStorage.getItem("email");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      role:role,
      active:active,
      email:email
    }
  }

}
