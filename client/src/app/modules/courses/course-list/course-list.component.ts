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
import { CreateCourseComponent } from '../create-course/create-course.component';
import { UpdateCourseComponent } from '../update-course/update-course.component';
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
  userId='' ;
  courses: Observable<Course[]>;
  displayedColumns: string[] = ['code','credits','name','teacher','seats', 'students','department', 'begins','actions'];
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
    if (this.userIsAuthenticated)  {
      this.userRole = this.authService.getAuthData().role;
      this.userId = this.authService.getAuthData().userId;
      this.loadData();
    }
  }

  studentInCourse(students:Array<string>):Boolean {
    var found = false;
    students.forEach(student => {
      if (student === this.userId)
      found = true;
    });
    return found
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

  onCreate(){
    this.router.navigate(["/course/new"]);
    /*const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(CreateCourseComponent, dialogConfig).afterClosed().subscribe(()=>this.loadData());
    */
  }

  onEdit(id){
    this.courseService.setSession('UserId', id);
    const dialogConfig= new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    this.dialog.open(UpdateCourseComponent, dialogConfig).afterClosed().subscribe(
      res=>{
        this.loadData();
        this.notificationService.success('Updated Successfully');
       });
  }

  onDelete(id: string){
    this.dialogService.openConfirmDialog('Are you sure to delete this record?')
    .afterClosed().subscribe(res =>{
      if(res){
        this.courseService.deleteCourse(id).subscribe(message=>{
          this.loadData();
          var msg = JSON.parse(message);
          this.notificationService.warn(msg.message);
          this.router.navigate(["/mycourses"]);
        });
      }
    });
  }

  onRegister(id){
    this.dialogService.openConfirmDialog('Confirm course registration?')
    .afterClosed().subscribe(res =>{
      if(res){
        this.profileService.registerCourse(id).subscribe(data=>{
          this.loadData();
          this.notificationService.warn(data.message);
          this.router.navigate(["/mycourses"]);
        });
      }
    });
  }

  onDrop(id){
    this.dialogService.openConfirmDialog('Are you sure you want to drop course?')
    .afterClosed().subscribe(res =>{
      if(res){
        this.profileService.dropCourse(id).subscribe(data=>{
          this.loadData();
          this.notificationService.warn(data.message);
        });
      }
    });
  }

}
