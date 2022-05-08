import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';
import { Course } from 'src/app/common/course';
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
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})



export class CourseListComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  userIsAuthenticated = false;
  userRole='' ;
  courses: Observable<Course[]>;
  displayedColumns: string[] = ['code','credits','name','seats','department', 'begins','active','actions'];
  public dataSource = new MatTableDataSource<Course>()
  searchKey : String;

  constructor(
    private authService:AuthService,
    private profileService:ProfileService,
    private courseService: CourseService,
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
    this.courseService.getCourseList()
    .subscribe(res => {
      this.dataSource.data = res['courses'] as Course[];
    })
  }

  deleteCourse(id) {
     this.courseService.deleteCourse(id)
      .subscribe(
        data => {
          console.log(data);
        },
        error => console.log(error));
  }


  courseDetails(id){
    this.router.navigate(['details', id]);
  }

  onSearchClear(){
    this.searchKey="";
  }

  applyFilter(){
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  onDelete(id: string){
    this.dialogService.openConfirmDialog('Are you sure to delete this course?')
    .afterClosed().subscribe(res =>{
      if(res){
        this.courseService.deleteCourse(id).subscribe(message=>{
          this.loadData();
          var msg = JSON.parse(message);
          this.notificationService.warn(msg.message);
          this.router.navigate(["/courses"]);
        });
      }
    });
  }

  onApprove(id: string){
    this.dialogService.openConfirmDialog('Confirm Approve this Course?')
    .afterClosed().subscribe(res =>{
      if(res){
        this.courseService.approveCourse(id).subscribe(data=>{
          this.loadData();
          this.notificationService.warn(data.message);
          this.router.navigate(["/courses"]);
        });
      }
    });
  }


}
