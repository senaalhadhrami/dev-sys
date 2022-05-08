import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/common/user';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { DialogService } from 'src/app/services/dialog.service';
import { NotificationServiceService } from 'src/app/services/notification-service.service';
import { formatDate } from '@angular/common';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})



export class UserListComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  userIsAuthenticated = false;
  userRole='' ;
  users: Observable<User[]>;
  displayedColumns: string[] = ['_id','email','role','actions'];
  public dataSource = new MatTableDataSource<User>()
  searchKey : String;

  constructor(
    private authService:AuthService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private notificationService: NotificationServiceService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    if (this.userIsAuthenticated)  this.userRole = this.authService.getAuthData().role;
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data, filter) => {
      return this.displayedColumns.some(ele => {
        return ele != 'actions' && data[ele].toString().toLowerCase().indexOf(filter) != -1;
      });
    };
  }

  formatToDate(date):string {
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';
    return formatDate(date,format, locale)
  }

  loadData(){
    this.userService.getUserList()
    .subscribe(res => {
      this.dataSource.data = res['users'] as User[];
    })
  }

  deleteUser(id) {
     this.userService.deleteUser(id)
      .subscribe(
        data => {
          console.log(data);
        },
        error => console.log(error));
  }


  userDetails(id){
    this.router.navigate(['details', id]);
  }

  onSearchClear(){
    this.searchKey="";
  }

  applyFilter(){
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  onDelete(id: string){
    this.dialogService.openConfirmDialog('Are you sure to delete this user?')
    .afterClosed().subscribe(res =>{
      if(res){
        this.userService.deleteUser(id).subscribe(message=>{
          this.loadData();
          var msg = JSON.parse(message);
          this.notificationService.warn(msg.message);
          this.router.navigate(["/users"]);
        });
      }
    });
  }

  onApprove(id: string){
    this.dialogService.openConfirmDialog('Confirm Approve this User?')
    .afterClosed().subscribe(res =>{
      if(res){
        this.userService.approveUser(id).subscribe(data=>{
          this.loadData();
          this.notificationService.warn(data.message);
          this.router.navigate(["/users"]);
        });
      }
    });
  }


}
