import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Audit } from 'src/app/common/audit';
import { AuditService } from 'src/app/services/audit.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  audits:Audit[];
  displayedColumns: string[] = ['message', 'createdAt'];
  userIsAuthenticated = false;
  userActive='no user status found';
  constructor(private authService:AuthService,private auditervice: AuditService) {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authService.getAuthStatusListener().subscribe( isAuthenticated =>{
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  ngOnInit() {
    if (this.userIsAuthenticated) {
      this.userActive = this.authService.getAuthData().active;
      console.log(this.userActive);
    }
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.loadData();
  }

  loadData(){
    this.auditervice.getAuditList()
    .subscribe(res => {
      this.audits = res['audits'] as Audit[];
    })
  }


  flagColor(color:String)  {
    switch (color) {
      case 'EXAM_CREATE':
         return 'rgb(0,255,127)'
      case 'EXAM_DELETE':
        return 'rgb(250,128,114)'
      default:
        return 'rgb(250,235,215)';
    }

  }

  public executeSelectedChange = (event) => {
    console.log(event);
  }
}
