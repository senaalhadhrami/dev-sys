import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() public sidenavToggle = new EventEmitter();
  userIsAuthenticated = false;
  userRole ;
  userActive;
  private authListenerSubs: Subscription;

  constructor(private authService:AuthService) {
      this.userIsAuthenticated = this.authService.getIsAuth(); // to make sure authentication(token-check) runs first  before loading the component
    this.authService.getAuthStatusListener().subscribe( isAuthenticated =>{
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    if (this.userIsAuthenticated) {
        this.userRole = this.authService.getAuthData().role;
        this.userActive = this.authService.getAuthData().active;
      }
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

}
